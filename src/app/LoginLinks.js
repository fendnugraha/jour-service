"use client";

import Link from "next/link";
import { useAuth } from "@/libs/auth";

const LoginLinks = () => {
    const { user } = useAuth({ middleware: "guest" });

    return (
        <div className="">
            {user ? (
                <Link href="/dashboard" className="bg-indigo-500 py-2 px-10 text-xl text-white">
                    Dashboard
                </Link>
            ) : (
                <>
                    <Link href="/login" className="bg-indigo-500 py-2 px-10 text-xl text-white">
                        Login
                    </Link>
                </>
            )}
        </div>
    );
};

export default LoginLinks;
