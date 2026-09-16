import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { jwtVerify } from 'jose'

export default async function AdminLayout({children}:{children:React.ReactNode}) {
  const token=(await cookies()).get('session')?.value
  if(!token) redirect('/')
  try {
    const {payload}=await jwtVerify(token,new TextEncoder().encode(process.env.JWT_SECRET??'dev-secret'))
    if(payload.isAdmin!==true) redirect('/')
  } catch { redirect('/') }
  return children
}
