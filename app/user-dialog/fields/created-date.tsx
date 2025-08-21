"use client"

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Label } from "@/components/ui/label";

type Props = {
    name?: string;
    defaultDate?: string; // ISO string
};

export function DatePicker({ name = "date", defaultDate }: Props) {
        const initial = defaultDate ? new Date(defaultDate) : new Date();
        const [date, setDate] = React.useState<Date>(initial);
    const [open, setOpen] = React.useState(false);

    return (
        <Popover modal={true} open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="date" className="opacity-50">{'Created Date'}</Label>
                    <Button variant="outline" data-empty={!date} className="w-full justify-start">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : "Pick a date"}
                    </Button>
                    {/* hidden input so parent forms can read selected date (ISO string) */}
                    <input type="hidden" id={name} name={name} value={date ? date.toISOString() : ""} />
                </div>
            </PopoverTrigger>

            <PopoverContent side="top"  sideOffset={8} className="w-auto p-0">
                <div className="pointer-events-auto">
                    <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(selectedDate) => {
                            if (selectedDate) {
                                setDate(selectedDate);
                                setOpen(false);
                            }
                        }}
                    />
                </div>
            </PopoverContent>
        </Popover>
    );
}
