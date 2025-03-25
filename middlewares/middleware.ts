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

    // Verificar se a rota é pública
    const isPublicPath = publicPaths.some(publicPath =>
        path === publicPath || path.startsWith(`/${publicPath}`)
    );

    // Verificar outras rotas que podem ser acessadas sem login
    // Como rotas de restaurantes, cardápios, etc.
    const isRestaurantPath = path.match(/^\/[^\/]+\/(menu|table)/);

    // Verificar se o usuário está logado (tem um token)
    const token = request.cookies.get('auth_token')?.value;
    const guestToken = request.cookies.get('guest_token')?.value;
    const isLoggedIn = !!token || !!guestToken;

    // Verificar rotas que requerem autenticação específica
    const requiresAuth = path.includes('/dashboard') ||
        path.includes('/admin') ||
        path.includes('/profile');

    // Rotas específicas que exigem roles
    const adminOnlyPaths = ['/admin', '/dashboard/admin'];
    const managerOnlyPaths = ['/dashboard/manager'];
    const attendantOnlyPaths = ['/dashboard/attendant'];

    // Se for uma rota que requer autenticação e o usuário não está logado
    if (requiresAuth && !isLoggedIn) {
        // Redirecionar para o login
        const redirectUrl = new URL('/login', request.url);
        redirectUrl.searchParams.set('callbackUrl', path);
        return NextResponse.redirect(redirectUrl);
    }

    // Para rotas administrativas, precisamos verificar a role no lado do servidor
    // Aqui estamos apenas verificando o token, a verificação real de role 
    // deve ser feita no componente com o hook useAuth

    // Para rotas públicas, continuar normalmente
    if (isPublicPath || isRestaurantPath || isLoggedIn) {
        return NextResponse.next();
    }

    // Para qualquer outra situação, redirecionar para login
    const redirectUrl = new URL('/login', request.url);
    return NextResponse.redirect(redirectUrl);
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