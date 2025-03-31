// middleware.ts
import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Definir rotas públicas que não requerem autenticação
    const publicPaths = [
        '/',
        '/login',
        '/register',
        '/forgot-password',
        '/reset-password',
    ];

    // Rotas de restaurante que não precisam de autenticação
    // ou podem usar autenticação de convidado
    const restaurantPublicPaths = /^\/([\w-]+)\/(menu|scan|qrcode)/;

    // Rotas que exigem autenticação de admin/manager
    const adminPaths = [
        '/dashboard',
        '/admin',
        '/settings',
        '/restaurant-management',
    ];

    // Verificar tokens nos cookies
    const authToken = request.cookies.get('auth_token')?.value;
    const guestToken = request.cookies.get('guest_token')?.value;

    // Verificar se há algum token válido
    const hasToken = !!authToken || !!guestToken;

    // Verificar se o caminho é uma rota de admin
    const isAdminPath = adminPaths.some(adminPath =>
        path === adminPath || path.startsWith(`${adminPath}/`)
    );

    // Verificar se o caminho é uma rota pública
    const isPublicPath = publicPaths.some(publicPath =>
        path === publicPath || path.startsWith(`${publicPath}/`)
    );

    // Verificar se o caminho é uma rota de restaurante pública
    const isRestaurantPublicPath = restaurantPublicPaths.test(path);

    // Rotas de mesa que exigem pelo menos autenticação de convidado
    const tablePattern = /^\/([\w-]+)\/table\/([\w-]+)/;
    const isTablePath = tablePattern.test(path);

    // Rotas de pedido que exigem pelo menos autenticação de convidado
    const orderPattern = /^\/([\w-]+)\/(cart|order)/;
    const isOrderPath = orderPattern.test(path);

    // Se for uma rota de admin e não tiver token
    if (isAdminPath && !authToken) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // Se for uma rota de mesa ou pedido e não tiver nenhum token
    if ((isTablePath || isOrderPath) && !hasToken) {
        // Extrair o nome do restaurante da URL
        const restaurantName = path.split('/')[1];
        return NextResponse.redirect(new URL(`/${restaurantName}/scan`, request.url));
    }

    // Para rotas públicas ou rotas com autenticação adequada, continuar normalmente
    if (isPublicPath || isRestaurantPublicPath || hasToken) {
        return NextResponse.next();
    }

    // Se chegou aqui, redirecionar para a página inicial
    return NextResponse.redirect(new URL('/', request.url));
}

// Configurar quais rotas devem passar pelo middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except:
         * 1. /api routes
         * 2. /_next (Next.js internals)
         * 3. /fonts, /images (static files)
         * 4. /favicon.ico, /sitemap.xml (static files)
         */
        '/((?!api|_next|fonts|images|favicon.ico|sitemap.xml).*)',
    ],
};