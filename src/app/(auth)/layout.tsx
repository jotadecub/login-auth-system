import React from "react";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function AuthLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Check if the user is authenticated
    const session = await getSession();

    // if the user is authenticated, redirect to the home page
    if (session) {
        redirect("/dashboard");
    }

    return (
        <div>
            {children}
        </div>
    );
}