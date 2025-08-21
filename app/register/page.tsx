import { Suspense } from "react";
import { RegisterForm } from "./register-form";

export default async function RegisterPage() {
  return (
    <>
      {/* <Header /> */}

      <section>
        <Suspense fallback={<></>}>
          <RegisterForm />
        </Suspense>
      </section>
    </>
  );
}
