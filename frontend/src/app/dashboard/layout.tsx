'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { isAuthenticated, getUser } from '@/lib/auth'
import Sidebar from '@/components/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [ready, setReady] = useState(false)
  const user = getUser()

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace('/login')
    } else {
      setReady(true)
    }
  }, [router])

  if (!ready) {
    return (
      <div style={{
        height: '100vh', display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg)', color: 'var(--muted)',
        gap: 12,
      }}>
        <div style={{
          width: 20, height: 20,
          border: '2px solid rgba(108,99,255,0.3)',
          borderTopColor: '#6c63ff',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite',
        }} />
        Memuat...
        <style>{`@keyframes spin { to { transform: rotate(360deg); }}`}</style>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed(v => !v)} />

      {/* Main area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        {/* Topbar */}
        <header style={{
          height: 72, flexShrink: 0,
          borderBottom: '1px solid var(--border)',
          padding: '0 28px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          background: 'var(--bg)',
        }}>
          <div>
            <h1 style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 700,
              fontSize: 20, letterSpacing: '-0.3px',
            }}>
              Selamat datang, {user?.name?.split(' ')[0]} 👋
            </h1>
            <p style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
              {new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Notification bell */}
            <button style={{
              width: 38, height: 38,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--muted)', fontSize: 16,
              position: 'relative',
            }}>
              🔔
              <span style={{
                position: 'absolute', top: 6, right: 6,
                width: 7, height: 7,
                background: '#ff6584',
                borderRadius: '50%',
                border: '2px solid var(--bg)',
              }} />
            </button>

            {/* Avatar */}
            <div style={{
              width: 38, height: 38,
              background: 'linear-gradient(135deg, #ff6584, #6c63ff)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 700, fontSize: 14, color: '#fff',
              cursor: 'pointer',
            }}>
              {user?.name?.charAt(0).toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, overflowY: 'auto', padding: 28 }}>
          {children}
        </main>
      </div>
    </div>
  )
}
