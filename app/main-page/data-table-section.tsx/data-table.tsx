"use client";

import React, { useState } from "react";
import { DataTable } from "@/app/components/table";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { MdLocationOn } from "react-icons/md";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useRouter } from "next/navigation";
import { useConfirm } from "@/app/hooks/use-confirm";
import { toast } from "sonner";
import { ResponsiveDialog } from "@/components/responsive-dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import FullNameField from "@/app/user-dialog/fields/full-name";
import UserRoleField from "@/app/user-dialog/fields/user-role";
import EmailField from "@/app/user-dialog/fields/email-address";
import { DatePicker } from "@/app/user-dialog/fields/created-date";
import LocationField from "@/app/user-dialog/fields/location";

type UserRow = {
    id: string;
    fullName: string;
    emailAddress: string;
    role: React.ReactNode;
    location: React.ReactNode;
    created: string; // ISO date string or formatted
    actions?: React.ReactNode;
};

// Table headers: keys must match UserRow keys
const headers: Record<string, React.ReactNode> = {
    id: "ID",
    fullName: "FULL NAME",
    emailAddress: "EMAIL ADDRESS",
    role: "ROLE",
    location: "LOCATION",
    created: "CREATED",
    actions: "ACTIONS",
};

export default function DataTableSection() {
    const users = useQuery(api.users.list, {}); // fetches from convex
    const removeUser = useMutation(api.users.remove);
    const router = useRouter();
    const [ConfirmationDialog, confirm] = useConfirm(
        "Delete user",
        "Are you sure you want to delete this user? This action cannot be undone."
    );

    // Hooks must be declared unconditionally (before any early returns)
    const [editingUser, setEditingUser] = useState<any | null>(null);
    const updateUser = useMutation(api.users.update);

    // Handle loading state
    if (users === undefined) {
        return (
            <div className="flex items-center justify-center h-48">
                        <div role="status" className="flex flex-col items-center gap-3 transform translate-y-32">
                    <div className="w-12 h-12 border-4 border-gray-200 rounded-full animate-spin border-t-primary" />
                    <span className="text-sm text-slate-500">Loading users...</span>
                </div>
            </div>
        );
    }

    // Map Convex data -> DataTable rows
    // Build a lookup so we can open an edit dialog with the raw user object
    const userById: Record<string, any> = {};
    users.forEach((u) => {
        try {
            const k = u._id?.toString?.() ?? String(u._id);
            userById[k] = u;
        } catch (e) {
            // ignore
        }
    });

    

    const rows = users.map((user, idx) => ({
        // visible id shown in the table (highest number for newest)
        id: `ID${String(users.length - idx).padStart(3, '0')}`,
        // keep the original Convex id for mutations
        convexId: user._id,
        fullName: user.fullName,
        emailAddress: user.emailAddress,
        role: (
            <Badge
                variant="default"
                className={
                    user.role === "admin"
                        ? "bg-green-600 text-white border-transparent"
                        : user.role === "contributor"
                            ? "bg-blue-600 text-white border-transparent"
                            : "bg-gray-600 text-white border-transparent"
                }
            >
                {user.role}
            </Badge>
        ),
        location: (
            <div className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <MdLocationOn className="text-sm text-slate-500" />
                <span>{user.location}</span>
            </div>
        ),
        created: (() => {
            try {
                return format(new Date(user.createdAt), "MMMM d, yyyy");
            } catch (e) {
                return String(user.createdAt ?? "");
            }
        })(),
    }));

    return (
        <>
            <ConfirmationDialog />

                {/* Edit dialog */}
                {editingUser && (
                    <ResponsiveDialog
                        open={!!editingUser}
                        onOpenChange={() => setEditingUser(null)}
                        title="Edit user"
                        description="Update user details"
                    >
                        <form
                            onSubmit={async (e) => {
                                e.preventDefault();
                                const fd = new FormData(e.currentTarget as HTMLFormElement);
                                const fullName = (fd.get('edit-full-name') as string) || '';
                                const emailAddress = (fd.get('edit-email') as string) || '';
                                const role = (fd.get('edit-role') as string) || undefined;
                                const location = (fd.get('edit-location') as string) || undefined;
                                try {
                                    const roleValue: 'admin' | 'contributor' | 'user' | undefined =
                                        role === 'admin' || role === 'contributor' || role === 'user'
                                            ? (role as 'admin' | 'contributor' | 'user')
                                            : undefined;
                                    await updateUser({ id: editingUser._id, fullName, emailAddress, role: roleValue, location });
                                    toast.success('User updated');
                                    setEditingUser(null);
                                    router.refresh();
                                } catch (err) {
                                    console.error('update failed', err);
                                    toast.error('Could not update user');
                                }
                            }}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Left column: Name + Email */}
                                <div className="flex flex-col gap-4">
                                    <FullNameField name="edit-full-name" defaultValue={editingUser.fullName} />
                                    <EmailField name="edit-email" defaultValue={editingUser.emailAddress} />
                                </div>

                                {/* Right column: Role + Location */}
                                <div className="flex flex-col gap-4">
                                    <UserRoleField name="edit-role" defaultValue={editingUser.role} />
                                    <LocationField name="edit-location" defaultValue={editingUser.location} />
                                </div>

                                {/* Buttons — span both columns on md+ */}
                                <div className="pt-4 flex justify-end gap-2 md:col-span-2">
                                    <Button type="button" variant="outline" onClick={() => setEditingUser(null)}>Cancel</Button>
                                    <Button type="submit">Save</Button>
                                </div>
                            </div>
                        </form>
                    </ResponsiveDialog>
                )}

            <div className="w-full mt-10 mb-10">
                <DataTable
                    title="Users"
                    description="List of users"
                    headers={headers}
                    rows={rows}
                    className="mx-auto max-w-7xl"
                    sort={{ defaultProperty: "created" }}
                    filterBy={["role", "location"]}
                    clickableColumns={["fullName"]}
                    onRowClick={(row) => {
                        const idStr = row?.convexId?.toString?.() ?? String(row?.convexId ?? row?.id);
                        const found = userById[idStr];
                        if (found) setEditingUser(found);
                    }}
                    showCheckboxes={{
                        enable: true,
                        onDeleteButtonClicked: async (selectedRows) => {
                            try {
                                if (!selectedRows || selectedRows.length === 0) return;
                                const confirmed = await confirm();
                                if (!confirmed) return;

                                // Delete all selected rows in parallel
                                await Promise.all(
                                    selectedRows.map((r) => {
                                        const idToRemove = r?.convexId ?? r?.id;
                                        return removeUser({ id: idToRemove });
                                    })
                                );

                                toast.success(`${selectedRows.length} user(s) deleted`);
                                router.refresh();
                            } catch (e) {
                                // eslint-disable-next-line no-console
                                console.error('bulk delete failed', e);
                                toast.error('Could not delete selected users');
                            }
                        },
                    }}
                    showSortingButtons={true}
                    showActionsColumn={true}
                    dropDownItems={{
                        trigger: <button className="text-lg px-2">⋯</button>,
                        items: [
                            {
                                label: "Copy",
                                onClick: (row) =>
                                    navigator.clipboard?.writeText(JSON.stringify(row)),
                            },
                            {
                                label: "Edit",
                                onClick: (row) => {
                                        const idStr = row?.convexId?.toString?.() ?? String(row?.convexId ?? row?.id);
                                        const found = userById[idStr];
                                        if (found) setEditingUser(found);
                                    },
                            },
                            {
                                label: "Delete",
                                className: "text-red-600",
                                onClick: async (row) => {
                                    try {
                                        const confirmed = await confirm();
                                        if (!confirmed) return;
                                        // row.convexId is the document id
                                        const idToRemove = row?.convexId ?? row?.id;
                                        await removeUser({ id: idToRemove });
                                        router.refresh();
                                        toast.success("User deleted");
                                    } catch (e) {
                                        // eslint-disable-next-line no-console
                                        console.error('delete failed', e);
                                        toast.error("Could not delete user");
                                    }
                                },
                                separator: true,
                            },
                        ],
                    }}
                    isLoading={false}
                    pagination={{ rowsPerPage: 10 }}
                />
            </div>
        </>
    );
}
