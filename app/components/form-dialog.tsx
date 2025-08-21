

"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { BoxIcon, LucideIcon } from "lucide-react";
import { IconType } from "react-icons/lib";
import { MdAdd } from "react-icons/md";
import { ButtonHTMLAttributes, FormEvent, ReactNode } from "react";
import {
    FieldValues,
    FormProvider,
    SubmitHandler,
    UseFormReturn,
} from "react-hook-form";

interface ButtonProps {
    icon?: IconType | ReactNode | undefined;
    text: string;
    buttonProps?: ButtonHTMLAttributes<HTMLButtonElement>;
}

// type IconType = React.ComponentType<{ clasName?: string }>;

// Base props shared between both variants
type Dialog1PropsBase = {
    open?: boolean;
    hideTrigger?: boolean;
    onOpenChange?: (open: boolean) => void;
    triggerItem?: ReactNode;
    dialogTitle?: string;
    DialogIcon?: LucideIcon | IconType;
    iconSize?: number;
    dialogDescription?: string;
    primaryButton?: ButtonProps;
    secondaryButton?: ButtonProps;
    layout?: "Grid" | "List";
    components?: Array<ReactNode>;
};

// When using React Hook Form
type Dialog1PropsWithRHF<T extends FieldValues> = Dialog1PropsBase & {
    useFormProvider: true;
    methods: UseFormReturn<T>;
    onSubmit?: SubmitHandler<T>;
};

// When not using React Hook Form
type Dialog1PropsWithoutRHF = Dialog1PropsBase & {
    useFormProvider?: false;
    methods?: never;
    onSubmit?: (e: FormEvent) => void;
};

// Function overloads to improve type safety
function Dialog1<T extends FieldValues>(
    props: Dialog1PropsWithRHF<T>
): JSX.Element;
function Dialog1(props: Dialog1PropsWithoutRHF): JSX.Element;

// Implementation with proper type handling
function Dialog1<T extends FieldValues>(
    props: Dialog1PropsWithRHF<T> | Dialog1PropsWithoutRHF
) {
    const {
        open,
        hideTrigger = false,
        onOpenChange,
        triggerItem = <Button>Open</Button>,
        dialogTitle = "Dialog Title",
        DialogIcon = BoxIcon,
        dialogDescription = "Configure your settings here. Click the action button when finished.",
        primaryButton = { text: "Confirm", buttonProps: {} },
        secondaryButton = { icon: undefined, text: "Cancel", buttonProps: {} },
        layout = "Grid",
        components,
        useFormProvider,
        iconSize = 20,
    } = props;

    const {
        icon: PrimaryButtonIcon = <MdAdd />,
        text: primaryButtonText,
        buttonProps: primaryButtonProps = {},
    } = primaryButton;

    const {
        icon: SecondaryButtonIcon = <></>,
        text: secondaryButtonText,
        buttonProps: secondaryButtonProps = {},
    } = secondaryButton;

    // Safe access to properties based on discriminated union
    const handleFormSubmit = (e: FormEvent) => {
        e.preventDefault();

        if (useFormProvider) {
            const { methods, onSubmit } = props as Dialog1PropsWithRHF<T>;
            if (onSubmit) {
                methods.handleSubmit(onSubmit)(e);
            }
        } else {
            const { onSubmit } = props as Dialog1PropsWithoutRHF;
            if (onSubmit) {
                onSubmit(e);
            }
        }
    };

    const formContent = (
        <form onSubmit={handleFormSubmit}>
            <div
                className={`flex ${layout == "List" ? "flex-col " : "grid grid-cols-2 max-sm:flex-col"
                    } gap-9 px-6 my-7`}
            >
                {components?.map((component, index) => (
                    <div key={index}>{component}</div>
                ))}
            </div>

            <DialogFooter className="relative bg-neutral-50 dark:bg-neutral-800 p-5 py-8 overflow-hidden">
                <Button
                    {...secondaryButtonProps}
                    type="button"
                    onClick={() => onOpenChange?.(false)}
                    variant={"outline"}
                    className="h-11 mr-4 px-8 max-sm:mr-0 max-sm:mt-3"
                >
                    {SecondaryButtonIcon && typeof SecondaryButtonIcon === "function" ? (
                        <SecondaryButtonIcon />
                    ) : (
                        SecondaryButtonIcon
                    )}
                    {secondaryButtonText}
                </Button>
                <Button {...primaryButtonProps} type="submit" className="h-11">
                    <span>{primaryButtonText}</span>
                </Button>
            </DialogFooter>
        </form>
    );

    // Access methods only if useFormProvider is true
    const methods = useFormProvider
        ? (props as Dialog1PropsWithRHF<T>).methods
        : undefined;

    return (
        <Dialog onOpenChange={onOpenChange} open={open}>
            {hideTrigger === false && (
                <DialogTrigger asChild>{triggerItem}</DialogTrigger>
            )}
            <DialogContent className="sm:max-w-3xl poppins p-0 overflow-hidden">
                <DialogHeader className="p-6 py-8 bg-neutral-50 dark:bg-neutral-800">
                    <div className="flex items-center gap-4">
                        <div className="bg-neutral-300 max-sm:hidden dark:bg-neutral-950 dark:text-white w-12 text-neutral-800 rounded-lg h-12 flex justify-center items-center">
                            {typeof DialogIcon === "function" ? (
                                // some icon libraries accept `size` prop
                                <DialogIcon size={iconSize} />
                            ) : (
                                DialogIcon
                            )}
                        </div>
                        <div>
                            <DialogTitle className="text-2xl font-bold">
                                {dialogTitle}
                            </DialogTitle>
                            <DialogDescription className="mt-1">
                                {dialogDescription}
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                {useFormProvider && methods ? (
                    <FormProvider {...methods}>{formContent}</FormProvider>
                ) : (
                    formContent
                )}
            </DialogContent>
        </Dialog>
    );
}

export default Dialog1;


