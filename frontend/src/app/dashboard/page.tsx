'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'

interface Stats {
  totalUsers: number
  newToday: number
  revenue: string
  growth: string
  orders: string
  conversion: string
}

interface User {
  id: number
  name: string
  email: string
  role: string
  is_active: number
  last_login: string | null
  created_at: string
}

const STAT_CARDS = (stats: Stats) => [
  {
    label: 'Total Pengguna',
    value: stats.totalUsers,
    icon: '👥',
    trend: '+8.2%',
    up: true,
    color: '#6c63ff',
    bg: 'rgba(108,99,255,0.12)',
  },
  {
    label: 'Pendapatan (jt)',
    value: `Rp ${stats.revenue}`,
    icon: '💰',
    trend: `${stats.growth}%`,
    up: true,
    color: '#2ecc71',
    bg: 'rgba(46,204,113,0.12)',
  },
  {
    label: 'Total Pesanan',
    value: stats.orders,
    icon: '📦',
    trend: '-1.4%',
    up: false,
    color: '#f39c12',
    bg: 'rgba(243,156,18,0.12)',
  },
  {
    label: 'Konversi (%)',
    value: `${stats.conversion}%`,
    icon: '📈',
    trend: '+0.3%',
    up: true,
    color: '#ff6584',
    bg: 'rgba(255,101,132,0.12)',
  },
]

const CHART_DATA = [
  { month: 'Jan', val: 45 },
  { month: 'Feb', val: 62 },
  { month: 'Mar', val: 55 },
  { month: 'Apr', val: 78 },
  { month: 'Mei', val: 90 },
  { month: 'Jun', val: 72 },
  { month: 'Jul', val: 95 },
]

const ACTIVITIES = [
  { text: 'User baru mendaftar',         time: '2 mnt lalu',  color: '#6c63ff' },
  { text: 'Pesanan #1842 dikonfirmasi',   time: '15 mnt lalu', color: '#2ecc71' },
  { text: 'Laporan bulanan digenerate',   time: '1 jam lalu',  color: '#f39c12' },
  { text: 'Produk "Kaos Premium" diedit', time: '2 jam lalu',  color: '#ff6584' },
  { text: 'Backup database selesai',      time: '5 jam lalu',  color: '#6c63ff' },
]

export default function DashboardPage() {
  const [stats, setStats]   = useState<Stats | null>(null)
  const [users, setUsers]   = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const [sRes, uRes] = await Promise.all([
          api.get('/dashboard/stats'),
          api.get('/dashboard/users'),
        ])
        setStats(sRes.data.stats)
        setUsers(uRes.data.users)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const maxVal = Math.max(...CHART_DATA.map(d => d.val))

  return (
    <div>
      {/* Stat cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
        gap: 18, marginBottom: 28,
      }}>
        {(stats ? STAT_CARDS(stats) : STAT_CARDS({ totalUsers: 0, newToday: 0, revenue: '—', growth: '—', orders: '—', conversion: '—' })).map((card, i) => (
          <div
            key={card.label}
            className="animate-fade-up"
            style={{
              animationDelay: `${i * 0.05}s`,
              background: 'var(--surface)',
              border: '1px solid var(--border)',
              borderRadius: 16, padding: 22,
              transition: 'transform 0.2s, border-color 0.2s',
              cursor: 'default',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'rgba(108,99,255,0.3)'
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
              ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 10,
                background: card.bg,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 18,
              }}>
                {card.icon}
              </div>
              <span style={{
                fontSize: 12, fontWeight: 600,
                padding: '3px 8px', borderRadius: 20,
                background: card.up ? 'rgba(46,204,113,0.15)' : 'rgba(255,79,112,0.15)',
                color: card.up ? '#2ecc71' : '#ff4f70',
              }}>
                {loading ? '—' : card.trend}
              </span>
            </div>
            <div style={{
              fontFamily: 'Syne, sans-serif', fontWeight: 800,
              fontSize: 28, letterSpacing: '-1px',
            }}>
              {loading ? '...' : card.value}
            </div>
            <div style={{ color: 'var(--muted)', fontSize: 13, marginTop: 4 }}>
              {card.label}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 18,
      }}
        className="animate-fade-up"
      >
        {/* Bar chart */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16, padding: 22,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15 }}>
              Penjualan Bulanan
            </h3>
            <span style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Lihat semua</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 130 }}>
            {CHART_DATA.map((d, i) => (
              <div key={d.month} style={{
                flex: 1, display: 'flex', flexDirection: 'column',
                alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end',
              }}>
                <div style={{
                  width: '100%', borderRadius: '6px 6px 0 0',
                  height: `${(d.val / maxVal) * 100}%`,
                  background: i === CHART_DATA.length - 1
                    ? 'linear-gradient(180deg, #6c63ff, rgba(108,99,255,0.4))'
                    : 'linear-gradient(180deg, rgba(108,99,255,0.6), rgba(108,99,255,0.2))',
                  transition: 'height 0.6s cubic-bezier(0.16,1,0.3,1)',
                  animationDelay: `${i * 0.05}s`,
                }} />
                <span style={{ fontSize: 10, color: 'var(--muted)' }}>{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity feed */}
        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16, padding: 22,
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15 }}>
              Aktivitas Terbaru
            </h3>
            <span style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Lihat semua</span>
          </div>
          <ul style={{ listStyle: 'none' }}>
            {ACTIVITIES.map((act, i) => (
              <li key={i} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '10px 0',
                borderBottom: i < ACTIVITIES.length - 1 ? '1px solid var(--border)' : 'none',
              }}>
                <span style={{
                  width: 8, height: 8, borderRadius: '50%',
                  background: act.color, flexShrink: 0,
                }} />
                <span style={{ fontSize: 13, flex: 1 }}>{act.text}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)', flexShrink: 0 }}>{act.time}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent users table */}
      {users.length > 0 && (
        <div style={{
          marginTop: 18,
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: 16, padding: 22,
        }}
          className="animate-fade-up"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 18 }}>
            <h3 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15 }}>
              Pengguna Terbaru
            </h3>
            <span style={{ fontSize: 12, color: 'var(--accent)', cursor: 'pointer' }}>Kelola pengguna</span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
              <thead>
                <tr>
                  {['Nama', 'Email', 'Role', 'Status', 'Login Terakhir'].map(h => (
                    <th key={h} style={{
                      textAlign: 'left', padding: '8px 12px',
                      color: 'var(--muted)', fontWeight: 600,
                      fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px',
                      borderBottom: '1px solid var(--border)',
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface2)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{
                          width: 30, height: 30, borderRadius: 8, flexShrink: 0,
                          background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontWeight: 700, fontSize: 12, color: '#fff',
                        }}>
                          {u.name.charAt(0)}
                        </div>
                        {u.name}
                      </div>
                    </td>
                    <td style={{ padding: '12px 12px', color: 'var(--muted)' }}>{u.email}</td>
                    <td style={{ padding: '12px 12px' }}>
                      <span style={{
                        background: u.role === 'admin' ? 'rgba(108,99,255,0.15)' : 'rgba(255,255,255,0.05)',
                        color: u.role === 'admin' ? 'var(--accent)' : 'var(--muted)',
                        borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600,
                        textTransform: 'capitalize',
                      }}>{u.role}</span>
                    </td>
                    <td style={{ padding: '12px 12px' }}>
                      <span style={{
                        background: u.is_active ? 'rgba(46,204,113,0.15)' : 'rgba(255,79,112,0.15)',
                        color: u.is_active ? '#2ecc71' : '#ff4f70',
                        borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600,
                      }}>{u.is_active ? 'Aktif' : 'Nonaktif'}</span>
                    </td>
                    <td style={{ padding: '12px 12px', color: 'var(--muted)' }}>
                      {u.last_login
                        ? new Date(u.last_login).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
                        : '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
