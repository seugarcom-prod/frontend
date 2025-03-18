import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista de restaurantes válidos
const validRestaurants = ['meu-restaurante', 'pizzaria-boa'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Verificar se o caminho começa com um nome de restaurante
    const paths = pathname.split('/').filter(Boolean);

    if (paths.length > 0) {
        const restaurantName = paths[0];

        // Se o path começa com um nome de restaurante que não é válido, redireciona para 404
        if (!validRestaurants.includes(restaurantName) && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
            return NextResponse.redirect(new URL('/404', request.url));
        }
    }

    return NextResponse.next();
}

// Configurar para executar o middleware nestas rotas
export const config = {
    matcher: [
        /*
         * Corresponde a todos os caminhos exceto:
         * 1. /api (rotas de API)
         * 2. /_next (arquivos Next.js)
         * 3. /_vercel (arquivos Vercel)
         * 4. /favicon.ico, /robots.txt, etc.
         */
        '/((?!api|_next|_vercel|favicon.ico|robots.txt).*)',
    ],
};