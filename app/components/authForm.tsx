"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple, FaGithub } from "react-icons/fa";
import { ButtonHTMLAttributes, useEffect } from "react";
import { MdBolt } from "react-icons/md";
import Link from "next/link";

// Form validation schemas
const signUpFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const signInFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type SignUpFormData = z.infer<typeof signUpFormSchema>;
type SignInFormData = z.infer<typeof signInFormSchema>;

// Base props shared by both sign-in and sign-up
type BaseAuthFormProps = {
  className?: string;
  buttonElement?: {
    text?: string;
    attributes?: ButtonHTMLAttributes<HTMLButtonElement>;
  };
  urls?: {
    termsOfService?: string;
    privacyOfPolicy?: string;
    signInFooterLink?: string;
    signUpFooterLink?: string;
  };
  showTermsAgrement?: boolean;
  authButtons?: {
    google?: { enable?: boolean; onGoogleClickedButton?: () => void };
    gitHub?: { enable?: boolean; onGitHubClickedButton?: () => void };
    apple?: { enable?: boolean; onAppleClickedButton?: () => void };
  };
  appName?: string;
  iconApp?: JSX.Element;
  email?: string;
  password?: string;
  onEmailChange?: (email: string) => void;
  onPasswordChange?: (password: string) => void;
};

// Sign-up specific props (includes name)
type SignUpFormProps = BaseAuthFormProps & {
  authForm: "signUp";
  name?: string;
  onNameChange?: (name: string) => void;
  onSubmit?: (values: SignUpFormData) => void;
};

// Sign-in specific props (excludes name)
type SignInFormProps = BaseAuthFormProps & {
  authForm: "signIn";
  onSubmit?: (values: SignInFormData) => void;
};

// Union type for the component props
type AuthFormProps = SignUpFormProps | SignInFormProps;

// Component overloads for better type inference
function AuthForm(props: SignUpFormProps): JSX.Element;
function AuthForm(props: SignInFormProps): JSX.Element;
function AuthForm(props: AuthFormProps): JSX.Element {
  const { authForm } = props;

  const name =
    authForm === "signUp" ? (props as SignUpFormProps).name : undefined;
  const onNameChange =
    authForm === "signUp" ? (props as SignUpFormProps).onNameChange : undefined;

  if (authForm === "signUp") {
    return (
      <SignUpForm
        {...(props as SignUpFormProps)}
        name={name}
        onNameChange={onNameChange}
      />
    );
  } else {
    return <SignInForm {...(props as SignInFormProps)} />;
  }
}

// Sign Up Form Component
function SignUpForm({
  buttonElement = { text: "Create Account" },
  urls = {
    privacyOfPolicy: "",
    signInFooterLink: "",
    signUpFooterLink: "",
    termsOfService: "",
  },
  showTermsAgrement = true,
  className = "",
  email = "",
  iconApp = <MdBolt className="text-primary text-2xl" />,
  appName = "Bolt Stack",
  password = "",
  name = "",
  onEmailChange,
  onPasswordChange,
  onNameChange,
  onSubmit,
  authButtons,
}: SignUpFormProps) {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const {
    enable: enableGoogle = true,
    onGoogleClickedButton: handleGoogleClick = () => {
      console.log("google clicked");
    },
  } = authButtons?.google || {};

  const {
    enable: gitHubEnable = true,
    onGitHubClickedButton: handleGitHubBtn = () => {
      console.log("git hub clicked");
    },
  } = authButtons?.gitHub || {};

  const {
    enable: appleEnable = true,
    onAppleClickedButton: handleAppleBtn = () => {
      console.log("apple clicked");
    },
  } = authButtons?.apple || {};

  const showAuthButtons = enableGoogle || gitHubEnable || appleEnable;

  useEffect(() => {
    setValue("email", email);
  }, [email, setValue]);

  useEffect(() => {
    setValue("password", password);
  }, [password, setValue]);

  useEffect(() => {
    setValue("name", name);
  }, [name, setValue]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("email", value);
    clearErrors("email");
    onEmailChange?.(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    clearErrors("password");
    setValue("password", value);
    onPasswordChange?.(value);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("name", value);
    clearErrors("name");
    onNameChange?.(value);
  };

  const handleFormSubmit = handleSubmit((values) => {
    onSubmit?.(values);
  });

  return (
    <div
      className={`max-w-lg w-full dark:bg-neutral-900 space-y-8 max-sm:border-none border max-sm:rounded-none shadow-md max-sm:w-full bg-white p-10 rounded-2xl ${className}`}
    >
      <div className="text-center">
        <Link href={"/"}>
          <div className="flex items-center justify-center">
            <div className="bg-inherit text-white rounded-md flex items-center justify-center">
              {iconApp}
            </div>
            <h1 className="text-xl font-medium">{appName}</h1>
          </div>
        </Link>

        <div className="flex flex-col mt-8">
          <p className="text-4xl font-semibold">Create</p>
          <p className="text-4xl font-semibold">Account</p>
        </div>
      </div>

      <div className="pt-3">
        <form onSubmit={handleFormSubmit} className="space-y-3 w-[80%] mx-auto">
          <div className="space-y-1">
            <Input
              placeholder="Full Name"
              className="p-4 rounded-3xl h-10 w-full"
              value={watch("name")}
              onChange={handleNameChange}
            />
            {errors.name && (
              <span className="flex items-center gap-1 pt-1 mx-3 text-xs text-destructive mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.name.message}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <Input
              placeholder="Email Address"
              className="p-4 rounded-3xl h-10 w-full"
              value={watch("email")}
              onChange={handleEmailChange}
            />
            {errors.email && (
              <span className="flex items-center gap-1 pt-1 mx-3 text-xs text-destructive mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <Input
              value={watch("password")}
              type="password"
              placeholder="Enter your password"
              className="w-full p-4 rounded-3xl h-10"
              onChange={handlePasswordChange}
            />
            {errors.password && (
              <span className="flex items-center gap-1 pt-1 mx-3 text-xs text-destructive mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.password.message}
              </span>
            )}
          </div>

          <Button
            {...buttonElement.attributes}
            type="submit"
            className="w-full h-10 rounded-3xl"
          >
            {buttonElement?.text}
          </Button>
        </form>
      </div>

      {showAuthButtons && (
        <div>
          <div className="relative">
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-inherit px-2 text-muted-foreground">
                or sign up with
              </span>
            </div>
          </div>

          <div className="flex w-full justify-center pt-4">
            <div className="flex gap-4">
              {enableGoogle && (
                <Button
                  onClick={handleGoogleClick}
                  variant="outline"
                  className="w-[1/2]"
                >
                  <FcGoogle className="h-10 w-10" />
                </Button>
              )}

              {gitHubEnable && (
                <Button
                  onClick={handleGitHubBtn}
                  variant="outline"
                  className="w-[1/2]"
                >
                  <FaGithub className="h-4 w-4" />
                </Button>
              )}

              {appleEnable && (
                <Button
                  onClick={handleAppleBtn}
                  variant="outline"
                  className="w-[1/2]"
                >
                  <FaApple className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {showTermsAgrement && (
        <p className="text-xs text-center text-gray-500">
          By creating an account you agree to {appName}s{" "}
          <a
            href={urls.termsOfService}
            className="underline cursor-pointer select-none"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href={urls.privacyOfPolicy}
            className="underline cursor-pointer select-none"
          >
            Privacy Policy
          </a>
          .
        </p>
      )}

      <p className="text-[12px] text-center text-gray-600">
        Already have an account?{" "}
        <a
          href={urls.signInFooterLink}
          className="font-medium text-primary hover:underline select-none cursor-pointer"
        >
          Log in
        </a>
      </p>
    </div>
  );
}

// Sign In Form Component
function SignInForm({
  buttonElement = { text: "Access account" },
  urls = {
    privacyOfPolicy: "",
    signInFooterLink: "",
    signUpFooterLink: "",
    termsOfService: "",
  },
  showTermsAgrement = true,
  className = "",
  email = "",
  iconApp = <MdBolt className="text-primary text-2xl" />,
  appName = "Bolt Stack",
  password = "",
  onEmailChange,
  onPasswordChange,
  onSubmit,
  authButtons,
}: SignInFormProps) {
  const {
    handleSubmit,
    setValue,
    watch,
    clearErrors,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: { email: "", password: "" },
  });

  const {
    enable: enableGoogle = true,
    onGoogleClickedButton: handleGoogleClick = () => {
      console.log("google clicked");
    },
  } = authButtons?.google || {};

  const {
    enable: gitHubEnable = true,
    onGitHubClickedButton: handleGitHubBtn = () => {
      console.log("git hub clicked");
    },
  } = authButtons?.gitHub || {};

  const {
    enable: appleEnable = true,
    onAppleClickedButton: handleAppleBtn = () => {
      console.log("apple clicked");
    },
  } = authButtons?.apple || {};

  const showAuthButtons = enableGoogle || gitHubEnable || appleEnable;

  useEffect(() => {
    setValue("email", email);
  }, [email, setValue]);

  useEffect(() => {
    setValue("password", password);
  }, [password, setValue]);

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setValue("email", value);
    clearErrors("email");
    onEmailChange?.(value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    clearErrors("password");
    setValue("password", value);
    onPasswordChange?.(value);
  };

  const handleFormSubmit = handleSubmit((values) => {
    onSubmit?.(values);
  });

  return (
    <div
      className={`max-w-lg w-full dark:bg-neutral-900 space-y-8 max-sm:border-none border max-sm:rounded-none shadow-md max-sm:w-full bg-white p-10 rounded-2xl ${className}`}
    >
      <div className="text-center">
        <Link href={"/"}>
          <div className="flex items-center justify-center">
            <div className="bg-inherit text-white rounded-md flex items-center justify-center">
              {iconApp}
            </div>
            <h1 className="text-xl font-medium">{appName}</h1>
          </div>
        </Link>

        <div className="flex flex-col mt-8">
          <p className="text-4xl font-semibold">Welcome</p>
          <p className="text-4xl font-semibold">Back</p>
        </div>
      </div>

      <div className="pt-3">
        <form onSubmit={handleFormSubmit} className="space-y-3 w-[80%] mx-auto">
          <div className="space-y-1">
            <Input
              placeholder="Email Address"
              className="p-4 rounded-3xl h-10 w-full"
              value={watch("email")}
              onChange={handleEmailChange}
            />
            {errors.email && (
              <span className="flex items-center gap-1 pt-1 mx-3 text-xs text-destructive mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.email.message}
              </span>
            )}
          </div>

          <div className="space-y-1">
            <Input
              value={watch("password")}
              type="password"
              placeholder="Enter your password"
              className="w-full p-4 rounded-3xl h-10"
              onChange={handlePasswordChange}
            />
            {errors.password && (
              <span className="flex items-center gap-1 pt-1 mx-3 text-xs text-destructive mt-1">
                <AlertCircle className="h-3 w-3" />
                {errors.password.message}
              </span>
            )}
          </div>

          <Button
            {...buttonElement.attributes}
            type="submit"
            className="w-full h-10 rounded-3xl"
          >
            {buttonElement?.text}
          </Button>
        </form>
      </div>

      {showAuthButtons && (
        <div>
          <div className="relative">
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-inherit px-2 text-muted-foreground">
                or continue with
              </span>
            </div>
          </div>

          <div className="flex w-full justify-center pt-4">
            <div className="flex gap-4">
              {enableGoogle && (
                <Button
                  onClick={handleGoogleClick}
                  variant="outline"
                  className="w-[1/2]"
                >
                  <FcGoogle className="h-10 w-10" />
                </Button>
              )}

              {gitHubEnable && (
                <Button
                  onClick={handleGitHubBtn}
                  variant="outline"
                  className="w-[1/2]"
                >
                  <FaGithub className="h-4 w-4" />
                </Button>
              )}

              {appleEnable && (
                <Button
                  onClick={handleAppleBtn}
                  variant="outline"
                  className="w-[1/2]"
                >
                  <FaApple className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {showTermsAgrement && (
        <p className="text-xs text-center text-gray-500">
          By signing in to an account you agree to {appName}s{" "}
          <a
            href={urls.termsOfService}
            className="underline cursor-pointer select-none"
          >
            Terms of Service
          </a>{" "}
          and{" "}
          <a
            href={urls.privacyOfPolicy}
            className="underline cursor-pointer select-none"
          >
            Privacy Policy
          </a>
          .
        </p>
      )}

      <p className="text-[12px] text-center text-gray-600">
        Dont have an account?{" "}
        <a
          href={urls.signUpFooterLink}
          className="font-medium text-primary hover:underline select-none cursor-pointer"
        >
          Sign up
        </a>
      </p>
    </div>
  );
}

export { AuthForm };
