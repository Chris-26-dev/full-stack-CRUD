import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { MapPin } from "lucide-react";

type Props = {
    name?: string;
    defaultValue?: string;
};

export function LocationField({ name = "location", defaultValue = "" }: Props) {
    return (
        <div className="flex flex-col gap-3 relative">
            <Label htmlFor={name} className="opacity-50">
                Location
            </Label>
            <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2" size={14} />
                <Input id={name} name={name} placeholder="Enter location" className="p-3 pl-10" defaultValue={defaultValue} />
            </div>

        </div>
    );
}

export default LocationField;
