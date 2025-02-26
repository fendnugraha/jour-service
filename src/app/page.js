import Image from "next/image";
import LoginLinks from "./LoginLinks";

export default function Home() {
    return (
        <div
            className={`flex h-screen justify-center items-center flex-col gap-4 p-4 relative`}
            style={{
                backgroundImage: "url('/bg.jpg')",
                backgroundColor: "rgba(222 ,222 ,222 ,.5)",
                backgroundSize: "cover",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
            }}
        >
            <div className="absolute top-4 left-4 flex justify-center items-center gap-2">
                <Image src="/jour-logo.svg" alt="Logo" width={50} height={50} className="drop-shadow-lg" />{" "}
                <h1 className="text-lg text-white drop-shadow-lg">Jour Apps Service Edition</h1>
            </div>
            <h1 className="text-6xl sm:text-7xl text-slate-400 drop-shadow-lg font-bold mb-4">
                JOUR <span className="font-normal">Service Edition</span>
            </h1>
            <LoginLinks />
        </div>
    );
}
