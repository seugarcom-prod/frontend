import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import type { NextRequest } from 'next/server';

// Helper para verificar se a rota está em um ciclo de redirecionamento
function isRedirectLoop(request: NextRequest): boolean {
    const redirectCount = request.cookies.get('redirect_count')?.value;
    const currentCount = redirectCount ? parseInt(redirectCount) : 0;

    // Se tivermos mais de 2 redirecionamentos seguidos, consideramos um loop
    return currentCount >= 2;
}

// Helper para atualizar o contador de redirecionamentos
function updateRedirectCount(response: NextResponse, increment: boolean): NextResponse {
    const redirectCount = response.cookies.get('redirect_count')?.value;
    const currentCount = redirectCount ? parseInt(redirectCount) : 0;

    if (increment) {
        response.cookies.set('redirect_count', (currentCount + 1).toString(), {
            maxAge: 5, // Expira em 5 segundos para evitar contagem permanente
            path: '/',
        });
    } else {
        // Se não estamos redirecionando, resetamos o contador
        response.cookies.set('redirect_count', '0', {
            maxAge: 5,
            path: '/',
        });
    }

    return response;
}

export async function middleware(request: NextRequest) {
    try {
        // Verificar se estamos em um loop de redirecionamento
        if (isRedirectLoop(request)) {
            console.warn('Detectado ciclo de redirecionamento! Permitindo acesso para quebrar o ciclo.');
            // Permitir o acesso para quebrar o ciclo, mas limpar o contador
            const response = NextResponse.next();
            return updateRedirectCount(response, false);
        }

        const token = await getToken({
            req: request,
            secret: process.env.NEXTAUTH_SECRET
        });

        const path = request.nextUrl.pathname;
        const isAdminRoute = path.startsWith('/restaurant');
        const isAttendantRoute = path.startsWith('/attendant');
        const isLoginRoute = path === '/login';
        const isApiAuthRoute = path.startsWith('/api/auth');

        // Não interferir com rotas de API de autenticação
        if (isApiAuthRoute) {
            return NextResponse.next();
        }

        // Verificar e validar restaurantId nas rotas administrativas
        if (isAdminRoute) {
            if (!token || (token.role !== 'ADMIN' && token.role !== 'MANAGER')) {
                console.log('Redirecionando para login: Token ausente ou role inválida');
                const response = NextResponse.redirect(new URL('/login', request.url));
                return updateRedirectCount(response, true);
            }

            const pathParts = path.split('/');
            const restaurantId = pathParts[2];

            // Verificar se o restaurantId é válido
            if (!restaurantId || restaurantId === 'undefined') {
                // Se o usuário tem um restaurantId no token, redirecionar para ele
                if (token.restaurantId) {
                    const newPath = path.replace(/\/restaurant\/([^\/]*)/, `/restaurant/${token.restaurantId}`);
                    console.log(`Ajustando restaurantId na URL: ${newPath}`);
                    const response = NextResponse.redirect(new URL(newPath, request.url));
                    return updateRedirectCount(response, true);
                }
                // Caso contrário, redirecionar para uma página de seleção de restaurante
                console.log('Redirecionando para seleção de restaurante: restaurantId inválido');
                const response = NextResponse.redirect(new URL('/restaurant-selection', request.url));
                return updateRedirectCount(response, true);
            }
        }

        if (isAttendantRoute && (!token || !['ADMIN', 'MANAGER', 'ATTENDANT'].includes(token.role as string))) {
            console.log('Redirecionando para login: Acesso negado para rota de atendente');
            const response = NextResponse.redirect(new URL('/login', request.url));
            return updateRedirectCount(response, true);
        }

        if (isLoginRoute && token) {
            if (token.role === 'ADMIN' || token.role === 'MANAGER') {
                const restaurantId = token.restaurantId;
                if (restaurantId) {
                    console.log(`Redirecionando usuário autenticado para dashboard: ${restaurantId}`);
                    const response = NextResponse.redirect(new URL(`/restaurant/${restaurantId}/dashboard`, request.url));
                    return updateRedirectCount(response, true);
                }
            }
            if (token.role === 'ATTENDANT') {
                console.log('Redirecionando atendente autenticado para orders');
                const response = NextResponse.redirect(new URL('/attendant/orders', request.url));
                return updateRedirectCount(response, true);
            }

            console.log('Redirecionando usuário autenticado com role desconhecida para home');
            const response = NextResponse.redirect(new URL('/', request.url));
            return updateRedirectCount(response, true);
        }

        // Se não redirecionamos, resetamos o contador
        const response = NextResponse.next();
        return updateRedirectCount(response, false);

    } catch (error) {
        console.error("Erro no middleware:", error);
        const response = NextResponse.redirect(new URL('/login', request.url));
        return updateRedirectCount(response, true);
    }
}

export const config = {
    matcher: [
        '/restaurant/:path*',
        '/attendant/:path*',
        '/login',
        '/api/auth/:path*',
    ],
};