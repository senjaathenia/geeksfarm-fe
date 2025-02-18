import { NextResponse } from "next/server"
import { auth } from "./auth"

const SuperAdminRoutes = ['users']
const AdminRoutes = ['events', 'categories', 'type', 'faqs', 'testimoni', 'items']

const checkPermissions = (pathname, role) => {
  const path = pathname.split('/')
  
  if (role === 'Super Admin') {
    return !AdminRoutes.some(route => path.includes(route)) &&
    (SuperAdminRoutes.some(route => path.includes(route)) || pathname === '/dashboard')
  } else if (role === 'Admin') {
    return !SuperAdminRoutes.some(route => path.includes(route)) &&
           (AdminRoutes.some(route => path.includes(route)) || pathname === '/dashboard')
  }
  return false
}

export default auth(async (req) => {
  const { pathname } = req.nextUrl
  const session = await auth()
  const role = session?.user?.role
  const url = req.nextUrl.clone()

  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (!session) {
    if (pathname === '/login') return NextResponse.next()
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  if (pathname.startsWith('/dashboard')) {
    const hasPermission = checkPermissions(pathname, role)
    if (!hasPermission) {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}