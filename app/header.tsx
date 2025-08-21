"use client";

import { signOut } from "next-auth/react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const Header = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user;

  const handleLogout = async () => {
    await signOut({
      redirect: false,
    });
    // Force a hard redirect to clear all session state
    window.location.href = "/login?signout=true";
  };

  return (
    <header className="bg-white h-20">
      <nav className="h-full flex justify-between container items-center">
        <div>
          <Link href="/" className="text-ct-dark-600 text-2xl font-semibold">
            CodevoWeb
          </Link>
        </div>
        <ul className="flex items-center space-x-4">
          <li>
            <Link href="/" className="text-ct-dark-600">
              Home
            </Link>
          </li>
          {!user && (
            <>
              <li>
                <Link href="/register" className="text-ct-dark-600">
                  Register
                </Link>
              </li>
            </>
          )}
          {user ? (
            <>
              <li className="ml-4">
                <Link href="/dashboard">Dashboard</Link>
              </li>
              <li className="ml-4">
                <button onClick={handleLogout}>Logout</button>
              </li>
            </>
          ) : (
            <li className="ml-4">
              <Link href="/login">Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
