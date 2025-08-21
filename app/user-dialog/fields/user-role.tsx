import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

type Props = {
    name?: string;
    defaultValue?: string;
};

export function UserRoleField({ name = "user-role", defaultValue = "" }: Props) {
    return (
        <div className="flex flex-col gap-3 relative">
            <Label htmlFor={name} className="opacity-50">
                Role
            </Label>
            <div className="relative">
                <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2" size={14} />
                <select id={name} name={name} defaultValue={defaultValue} className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 pl-10 text-base shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm">
                    <option value="">Select a role</option>
                    <option value="admin">Admin</option>
                    <option value="contributor">Contributor</option>
                    <option value="user">User</option>
                </select>

                {/* error message placeholder removed to avoid layout shifts; add back a <p> when showing errors */}
            </div>
        </div>
    );
}

export default UserRoleField;
