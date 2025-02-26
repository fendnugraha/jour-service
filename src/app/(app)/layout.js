"use client";

import { useAuth } from "@/libs/auth";
import Navigation from "@/app/(app)/Navigation";
import Loading from "@/app/(app)/loading";

const AppLayout = ({ children }) => {
    const { user } = useAuth({ middleware: "auth" });

    if (!user) {
        return <Loading />;
    }
    return (
        <div className="flex h-screen w-screen overflow-hidden">
            <Navigation user={user} />

            <main className="flex-1 bg-gray-100 min-h-screen overflow-auto">{children}</main>
        </div>
    );
};

export default AppLayout;
