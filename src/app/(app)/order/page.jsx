"use client";
import { useAuth } from "@/libs/auth";
import Loading from "../loading";
import Header from "../Header";

const OrderPage = () => {
    const { user } = useAuth({ middleware: "auth" });
    if (!user) {
        return <Loading />;
    }
    return (
        <>
            <Header title="Service Order" />
            <div className="py-8 relative">
                <div className="max-w-7xl mx-auto sm:px-6"></div>
            </div>
        </>
    );
};

export default OrderPage;
