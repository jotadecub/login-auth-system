import LoginForm from "@/components/auth/login-form";

export default function LoginPage() {
    return (
        <div>
            <div>
                <div>
                    <h1>Iniciar sesion</h1>
                    <p>
                        Ingresa tus credenciales para acceder a tu cuenta.
                    </p>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}