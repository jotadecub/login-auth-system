import { getSession } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function DashboardPage() {
    const session = await getSession();

    return (
        <div>
            <h1>Dashboard</h1>
            <div>
                <Card>
                    <CardHeader>
                        <CardTitle>Bienvenido, {session?.name || session?.email}</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>Has iniciado sesion correctamente.</p>
                        <Button asChild>
                            <Link href="/profile">Ver perfil</Link>
                        </Button>
                    </CardContent>
                </Card>
                {/* More cards with content */}
            </div>
        </div>
    );
}