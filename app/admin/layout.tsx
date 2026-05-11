'use client'

import { usePathname } from 'next/navigation'
import AdminNav from '@/components/admin/AdminNav'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLogin = pathname === '/admin'

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <AdminNav />
      <div className={isLogin ? '' : 'md:pl-[220px] pb-20 md:pb-0'}>
        {children}
      </div>
    </div>
  )
}
