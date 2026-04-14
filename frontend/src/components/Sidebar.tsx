'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { clearAuth, getUser } from '@/lib/auth'

interface NavItem {
  icon: string
  label: string
  href: string
  badge?: number
}

const NAV_SECTIONS = [
  {
    title: 'Utama',
    items: [
      { icon: '⊞', label: 'Dashboard',   href: '/dashboard' },
      { icon: '◈', label: 'Analitik',    href: '/dashboard/analytics' },
      { icon: '⊙', label: 'Laporan',     href: '/dashboard/reports' },
    ],
  },
  {
    title: 'Manajemen',
    items: [
      { icon: '◎', label: 'Pengguna',    href: '/dashboard/users',    badge: 3 },
      { icon: '◇', label: 'Produk',      href: '/dashboard/products' },
      { icon: '◈', label: 'Pesanan',     href: '/dashboard/orders',   badge: 12 },
      { icon: '◉', label: 'Inventori',   href: '/dashboard/inventory' },
    ],
  },
  {
    title: 'Sistem',
    items: [
      { icon: '⊛', label: 'Pengaturan',  href: '/dashboard/settings' },
      { icon: '◌', label: 'Log Aktivitas', href: '/dashboard/logs' },
    ],
  },
]

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

export default function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const router   = useRouter()
  const pathname = usePathname()
  const user     = getUser()

  function handleLogout() {
    clearAuth()
    router.replace('/login')
  }

  function handleNav(href: string) {
    router.push(href)
  }

  const w = collapsed ? 68 : 260

  return (
    <aside style={{
      width: w,
      minWidth: w,
      height: '100vh',
      background: 'var(--surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.3s cubic-bezier(0.4,0,0.2,1), min-width 0.3s cubic-bezier(0.4,0,0.2,1)',
      overflow: 'hidden',
      position: 'relative',
      zIndex: 10,
      flexShrink: 0,
    }}>

      {/* Header */}
      <div style={{
        padding: '0 14px',
        height: 72,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          overflow: 'hidden', whiteSpace: 'nowrap',
        }}>
          <div style={{
            width: 36, height: 36, flexShrink: 0,
            background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 16,
          }}>⬡</div>
          <span style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 18,
            opacity: collapsed ? 0 : 1,
            transition: 'opacity 0.2s',
            letterSpacing: '-0.3px',
          }}>NexaPanel</span>
        </div>

        {/* Toggle button */}
        <button
          onClick={onToggle}
          title={collapsed ? 'Buka sidebar' : 'Tutup sidebar'}
          style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            color: 'var(--muted)',
            width: 30, height: 30,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', flexShrink: 0,
            fontSize: 13,
            transition: 'transform 0.3s, color 0.15s, border-color 0.15s',
            transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          ◂
        </button>
      </div>

      {/* Nav */}
      <nav style={{
        flex: 1,
        padding: '14px 10px',
        overflowY: 'auto',
        overflowX: 'hidden',
      }}>
        {NAV_SECTIONS.map(section => (
          <div key={section.title} style={{ marginBottom: 24 }}>
            {/* Section label */}
            <div style={{
              fontSize: 10, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '1px',
              color: 'var(--muted)',
              padding: '0 8px', marginBottom: 6,
              whiteSpace: 'nowrap',
              opacity: collapsed ? 0 : 1,
              transition: 'opacity 0.2s',
            }}>
              {section.title}
            </div>

            {section.items.map(item => {
              const active = pathname === item.href
              return (
                <NavLink
                  key={item.href}
                  item={item}
                  active={active}
                  collapsed={collapsed}
                  onClick={() => handleNav(item.href)}
                />
              )
            })}
          </div>
        ))}
      </nav>

      {/* User footer */}
      <div style={{
        padding: '12px 10px',
        borderTop: '1px solid var(--border)',
        flexShrink: 0,
      }}>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          padding: 10, borderRadius: 10, cursor: 'default',
          overflow: 'hidden',
          transition: 'background 0.15s',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface2)')}
        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          {/* Avatar */}
          <div style={{
            width: 36, height: 36, flexShrink: 0,
            background: 'linear-gradient(135deg, #ff6584, #6c63ff)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontWeight: 700, fontSize: 14, color: '#fff',
          }}>
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>

          <div style={{
            overflow: 'hidden',
            opacity: collapsed ? 0 : 1,
            transition: 'opacity 0.2s',
            flex: 1,
            minWidth: 0,
          }}>
            <div style={{
              fontSize: 13, fontWeight: 600,
              whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {user?.name ?? 'User'}
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'capitalize' }}>
              {user?.role ?? 'staff'}
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Logout"
            style={{
              background: 'none', border: 'none',
              color: 'var(--muted)', cursor: 'pointer',
              fontSize: 15, padding: 4, flexShrink: 0,
              opacity: collapsed ? 0 : 1,
              pointerEvents: collapsed ? 'none' : 'auto',
              transition: 'color 0.15s, opacity 0.2s',
            }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--error)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >
            ⏻
          </button>
        </div>
      </div>
    </aside>
  )
}

// ── single nav link ─────────────────────────────────────────────────────────
function NavLink({
  item, active, collapsed, onClick,
}: {
  item: NavItem
  active: boolean
  collapsed: boolean
  onClick: () => void
}) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      title={collapsed ? item.label : undefined}
      style={{
        display: 'flex', alignItems: 'center', gap: 12,
        padding: '10px 10px',
        borderRadius: 10, cursor: 'pointer',
        whiteSpace: 'nowrap', overflow: 'hidden',
        marginBottom: 2,
        position: 'relative',
        background: active
          ? 'rgba(108,99,255,0.15)'
          : hovered ? 'var(--surface2)' : 'transparent',
        color: active ? 'var(--accent)' : hovered ? 'var(--text)' : 'var(--muted)',
        transition: 'background 0.15s, color 0.15s',
        userSelect: 'none',
      }}
    >
      {/* Active indicator */}
      {active && (
        <div style={{
          position: 'absolute', left: 0, top: '20%', bottom: '20%',
          width: 3, background: 'var(--accent)',
          borderRadius: '0 4px 4px 0',
        }} />
      )}

      <span style={{ fontSize: 18, flexShrink: 0, width: 24, textAlign: 'center' }}>
        {item.icon}
      </span>

      <span style={{
        fontSize: 14, fontWeight: 500,
        opacity: collapsed ? 0 : 1,
        transition: 'opacity 0.2s',
        flex: 1,
      }}>
        {item.label}
      </span>

      {item.badge && !collapsed && (
        <span style={{
          background: 'var(--accent)',
          color: '#fff',
          borderRadius: 20,
          fontSize: 10, fontWeight: 700,
          padding: '2px 7px',
          flexShrink: 0,
        }}>
          {item.badge}
        </span>
      )}
    </div>
  )
}
