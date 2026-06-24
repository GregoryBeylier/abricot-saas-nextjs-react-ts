import { NextRequest, NextResponse } from 'next/server'

export async function proxy(request: NextRequest) {
  // Récupère le cookie JWT stocké par js-cookie lors de la connexion
  const jwtToken = request.cookies.get('token')
  const token = jwtToken?.value as string
  // // Si pas de token → l'utilisateur n'est pas connecté, on le renvoie au login
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url))
  } else {
    return NextResponse.next()
  }
}

// Définit les routes protégées par le middleware
// :path* = la route et toutes ses sous-routes
export const config = {
  matcher: ['/((?!login|register|_next|favicon.ico|$).*)'],
}
