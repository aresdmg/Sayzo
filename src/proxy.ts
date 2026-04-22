import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(req: NextRequest) {
    const path = req.nextUrl.pathname
    const isPublicPath = path === '/' || path === '/auth/login' || path === '/auth/register'

    const token = req.cookies.get('sayzoAccessToken')?.value;

    if (isPublicPath && token) {
        return NextResponse.redirect(new URL('/home', req.nextUrl))
    }

    if (!isPublicPath && !token) {
        return NextResponse.redirect(new URL('/auth/login', req.nextUrl))
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/',
        '/auth/:path*',
        '/home/:path*',
        '/profile',
        '/business',
        '/review'
    ],
};