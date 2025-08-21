import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import React from "react";

type Props = {
    name?: string;
    defaultValue?: string;
};

export function EmailField({ name = "email", defaultValue = "" }: Props) {
    return (
        <div className="flex flex-col gap-3 relative">
            <Label htmlFor={name} className="opacity-50">
                {'Email Address'}
            </Label>
            <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-500">
                    <Mail size={14} />
                </span>
                <Input type="email" id={name} key={name} name={name} placeholder="Enter your email address" className="pl-10" defaultValue={defaultValue} />
            </div>

            {/* <p className="text-red-500 text-[12px]">Error Message</p> */}
        </div>
    );
}

export default EmailField;