"use server";

import { z } from "zod";
import { createSession, deleteSession } from "@/lib/session";
import { redirect } from "next/navigation";

type User = 'user' | 'guest';

const testUser = {
    id: "1",
    email: "contact@matternot.io",
    cpf: "15511565923",
    password: "12345678",
};

const registeredUserLoginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }).trim(),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .trim(),
});

const guestUserLoginSchema = z.object({
    cpf: z
        .string({
            required_error: 'CPF é obrigatório.',
        })
        .refine((doc) => {
            const replacedDoc = doc.replace(/\D/g, '');
            return replacedDoc.length >= 11;
        }, 'CPF deve conter no mínimo 11 caracteres.')
        .refine((doc) => {
            const replacedDoc = doc.replace(/\D/g, '');
            return replacedDoc.length <= 14;
        }, 'CPF deve conter no máximo 14 caracteres.')
        .refine((doc) => {
            const replacedDoc = doc.replace(/\D/g, '');
            return !!Number(replacedDoc);
        }, 'CPF deve conter apenas números.'),
    email: z.string().email({ message: "Invalid email address" }).trim(),
})

export async function UserLogin(formData: FormData, userType: User) {
    if (userType === 'user') {
        const result = registeredUserLoginSchema.safeParse(Object.fromEntries(formData));

        if (!result.success) {
            return {
                errors: result.error.flatten().fieldErrors,
            };
        }

        const { email, password } = result.data;

        if (email !== testUser.email || password !== testUser.password) {
            return {
                errors: {
                    email: ["Invalid email or password"],
                },
            };
        }

        await createSession(testUser.id);

        redirect("/admin");
    } else if (userType === 'guest') {
        const result = guestUserLoginSchema.safeParse(Object.fromEntries(formData));
        if (!result.success) {
            return {
                errors: result.error.flatten().fieldErrors,
            };
        }

        const { cpf, email } = result.data;

        if (email !== testUser.email || cpf !== testUser.cpf) {
            return {
                errors: {
                    email: ["Invalid email or password"],
                },
            };
        }

        await createSession(testUser.id);

        redirect("/admin");
    }
}

export async function logout() {
    await deleteSession();
    redirect("/");
}