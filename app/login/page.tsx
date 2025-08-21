import { LoginForm } from "./login-form";
import { Suspense } from "react";

export default async function LoginPage() {
  return (
    <>
      {/* <Header /> */}

      <section>
        <Suspense fallback={<></>}>
          <LoginForm />
        </Suspense>
      </section>
    </>
  );
}
