import { NextRequest, NextResponse } from 'next/server'
import acceptLanguage from 'accept-language'
import i18nConfig from '../next-i18next.config'

acceptLanguage.languages(i18nConfig.i18n.locales as string[])

export const config = {
    matcher: ['/((?!api|_next/static|_next/.*)'],
}

export function languageCatcher(request: NextRequest): NextResponse {
    // Verifica se já existe um cookie de idioma
    const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value

    // Se não existir cookie, tenta detectar idioma do navegador
    let locale: string = cookieLocale || ''

    if (!locale) {
        // Obtém o idioma aceito do cabeçalho
        const acceptLanguageHeader = request.headers.get('Accept-Language')
        if (acceptLanguageHeader) {
            locale = acceptLanguage.get(acceptLanguageHeader) || ''
        }

        // Se falhar, usa o idioma padrão
        if (!locale) locale = i18nConfig.i18n.defaultLocale
    }

    // Verifica se o idioma atual está na URL
    const pathname = request.nextUrl.pathname

    // URL contém um locale válido
    const pathnameHasLocale = i18nConfig.i18n.locales.some(
        (locale: string) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    )

    if (pathnameHasLocale) return NextResponse.next()

    // Redireciona para a URL com o idioma detectado
    const newUrl = new URL(`/${locale}${pathname}`, request.url)

    // Copia os parâmetros de consulta
    if (request.nextUrl.search) {
        newUrl.search = request.nextUrl.search
    }

    // Adiciona o locale como cookie
    const response = NextResponse.redirect(newUrl)
    response.cookies.set('NEXT_LOCALE', locale, {
        maxAge: 60 * 60 * 24 * 30, // 30 dias
        path: '/'
    })

    return response
}