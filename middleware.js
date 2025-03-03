import { NextResponse } from "next/server"
import { auth, signOut } from "./auth"
import { redirect } from "next/dist/server/api-utils"

const SuperAdminRoutes = ['user']
const AdminRoutes = ['event', 'categories', 'type', 'faqs', 'testimoni', 'items']

const validateToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.SECRET)
    return { valid: true, expired: false, decoded }
  } catch (error) {
    return { 
      valid: false, 
      expired: error.name === 'TokenExpiredError', 
      decoded: null 
    }
  }
}


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
  const token = session?.user?.token
  const { valid, expired, decoded } = validateToken(token)


  console.log(session)

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