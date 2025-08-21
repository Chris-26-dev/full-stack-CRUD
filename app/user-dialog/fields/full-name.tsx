import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { User2 } from "lucide-react";

type Props = {
    name?: string;
    defaultValue?: string;
};

export function FullNameField({ name = "full-name", defaultValue = "" }: Props) {
    return (
        <div className="flex flex-col gap-3 relative">
            <Label htmlFor={name} className="opacity-50">
                Full Name
            </Label>
            <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-500">
                    <User2 size={14} />
                </span>
                <Input id={name} name={name} placeholder="Enter your full name" className="pl-10" defaultValue={defaultValue} />
            </div>

            {/* <p className="text-red-500 text-[12px]">Error Message</p> */}
        </div>
    );
}

export default FullNameField;