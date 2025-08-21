"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";

import { AuthForm } from "../components/authForm";

export const RegisterForm = () => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  async function handleOnSubmit(values: {
    email: string;
    password: string;
    name: string;
  }) {
    try {
      setSubmitting(true);
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(values),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        if (Array.isArray(errorData.errors) && errorData.errors.length > 0) {
          errorData.errors.forEach((error: any) => {
            toast.error(error.message);
          });
          return;
        }
        toast.error(errorData.message);
        return;
      }
      signIn(undefined, { callbackUrl: "/" });
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex justify-center items-center w-full h-screen bg-neutral-50 dark:bg-neutral-950">
      <AuthForm
        className="shadow-none"
        email={email}
        onEmailChange={setEmail}
        password={password}
        onPasswordChange={setPassword}
        name={name}
        onNameChange={setName}
        onSubmit={handleOnSubmit}
        authForm="signUp"
        buttonElement={{
          text: submitting ? "Loading" : "Create Account",
          attributes: { disabled: submitting },
        }}
        urls={{ signInFooterLink: "/login" }}
        showTermsAgrement={false}
        authButtons={{
          apple: { enable: false },
          gitHub: {
            onGitHubClickedButton: () => {
              signIn("github", { callbackUrl });
            },
          },
          google: {
            onGoogleClickedButton: () => {
              signIn("google", { callbackUrl });
            },
          },
        }}
      />
    </div>
  );
};
