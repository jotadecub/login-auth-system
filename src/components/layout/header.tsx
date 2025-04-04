"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { logout } from "@/app/actions/auth";

type HeaderProps = {
    user: {
        name?: string;
        email: string;
    };
};

export default function Header({ user }: HeaderProps) {
    const router = useRouter();

    const handleLogout = async () => {
        await logout();
        router.push("/login");
        router.refresh(); 
    };

    return (
        <header>
            <div>
                <Link rel="stylesheet" href="/">
                    Mi aplicación
                </Link>
            </div>

            <div>
                <span>
                    {user.name || user.email}
                </span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                    Cerrar sesión
                </Button>
            </div>
        </header>
    );
}