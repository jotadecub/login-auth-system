import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // Check if the user is authenticated
    const session = await getSession();

    // If not authenticated, redirect to login page
    if (!session) {
        redirect("/login");
    }

    return (
        <div>
            <Header user={session} />
            <main>{children}</main>
            <Footer />
        </div>
    );
}