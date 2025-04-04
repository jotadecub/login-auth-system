"use server";

import { cookies } from "next/headers";
import { z } from "zod";

const loginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
});

type LoginResult = {
    success: boolean;
    error?: string;
}

export async function login(formData: FormData): Promise<LoginResult> {
    // Validate the form data
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validationResult = loginSchema.safeParse({ email, password });

    if (!validationResult.success) {
        return {
            success: false,
            error: "Datos de inicio de sesion inválidos"
        };
    };

    try {
        // Simulate a login request
        // Replace with your database
    
        if (password !== "password123") {
            return {
                success: false,
                error: "Credenciales incorrectas",
            };
        }
    
        // Create a user session
        const session = {
            userID: "user_123",
            email,
            name: "John Doe",
        };
    
        // Store the session in cookies
        const sessionExpiry = new Date();
        sessionExpiry.setDate(sessionExpiry.getDate() + 7);
    
        const cookieStore = await cookies();
        cookieStore.set({
            name: "session",
            value: JSON.stringify(session),
            expires: sessionExpiry,
            httpOnly: true,
            path: "/",
            secure: process.env.NODE_ENV == "production",
            sameSite: "lax",
        });
    
        return { success: true };
    } catch (error) {
        console.error("Error during login:", error);
        return {
            success: false,
            error: "Error to processing login",
        };
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    return { success: true };
}