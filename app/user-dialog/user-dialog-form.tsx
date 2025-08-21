'use client'

import React from 'react'
import Dialog1 from '../components/form-dialog'
import { useOpenDialogForm } from '../hooks/useOpenDialogForm';
import FullNameField from './fields/full-name';
import { FaUserPlus } from 'react-icons/fa';
import { UserRoleField } from './fields/user-role';
import EmailField from './fields/email-address';
import { DatePicker } from './fields/created-date';
import LocationField from './fields/location';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function UserDialogForm() {
    const { isOpen, openDialog, closeDialog } = useOpenDialogForm();
    const createUser = useMutation(api.users.create);
    const router = useRouter();

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const form = e.currentTarget as HTMLFormElement;
        const fd = new FormData(form);
        const fullName = (fd.get('full-name') as string) || '';
        const emailAddress = (fd.get('email') as string) || '';
        const role = (fd.get('user-role') as string) || 'user';
        const roleValue: 'admin' | 'contributor' | 'user' =
            role === 'admin' || role === 'contributor' || role === 'user'
                ? (role as 'admin' | 'contributor' | 'user')
                : 'user';
        const location = (fd.get('location') as string) || '';
        const createdAtRaw = (fd.get('date') as string) || '';
        const createdAt = createdAtRaw ? new Date(createdAtRaw) : new Date();

        try {
            await createUser({ fullName, emailAddress, role: roleValue, location, createdAt: createdAt.toISOString() });
            // refresh data and close dialog
            router.refresh();
            closeDialog();
            // toast feedback
            toast.success(`${fullName || emailAddress} added`);
        } catch (err) {
            // eslint-disable-next-line no-console
            console.error('create user failed', err);
            toast.error('Could not create user');
        }
    }

    return (
        <div>
            <Dialog1
                dialogTitle='New User'
                dialogDescription='Add a new user'
                DialogIcon={FaUserPlus}

                components={[
                    <FullNameField key="text" />,
                    <UserRoleField key="role" />,
                    <EmailField key="email" />,
                    //<DatePicker key="date" />,
                    <LocationField key="location" />
                ]}
                open={isOpen}
                onOpenChange={openDialog}
                hideTrigger={true}
                onSubmit={handleSubmit}
            />
        </div>
    )
}

export default UserDialogForm