import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/utils/session";

const protectedRoutes = ["/admin", "/restaurant/register", "/restaurant/unit/register"];
const publicRoutes = ["/"];

export default async function middleware(req: NextRequest) {
    const path = req.nextUrl.pathname;
    const isProtectedRoute = protectedRoutes.includes(path);
    const isPublicRoute = publicRoutes.includes(path);

    // Verifica tanto o cookie de sessão normal quanto o token do guest
    const cookie = (await cookies()).get("session")?.value;
    const session = await decrypt(cookie);

    // Verifica se é uma rota protegida e se não há autenticação
    if (isProtectedRoute && !session?.userId) {
        // Verifica se tem token de guest no localStorage
        const guestToken = req.cookies.get("guest_session")?.value;

        // Se não tiver nenhuma das autenticações, redireciona para home
        if (!guestToken) {
            return NextResponse.redirect(new URL("/", req.nextUrl));
        }
    }

    // Se estiver em rota pública mas já estiver autenticado
    if (isPublicRoute && (session?.userId)) {
        return NextResponse.redirect(new URL("/admin", req.nextUrl));
    }

    return NextResponse.next();
}

// Configurar quais rotas o middleware deve verificar
export const config = {
    matcher: [...protectedRoutes, ...publicRoutes]
}