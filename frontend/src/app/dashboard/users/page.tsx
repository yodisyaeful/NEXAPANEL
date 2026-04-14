'use client'

import { useEffect, useState } from 'react'
import api from '@/lib/api'

interface User {
  id: number
  name: string
  email: string
  role: string
  is_active: number
  last_login: string | null
  created_at: string
}

const ROLE_COLORS: Record<string, { bg: string; color: string }> = {
  admin:   { bg: 'rgba(108,99,255,0.15)', color: '#6c63ff' },
  manager: { bg: 'rgba(243,156,18,0.15)', color: '#f39c12' },
  staff:   { bg: 'rgba(255,255,255,0.07)', color: '#aaa' },
}

export default function UsersPage() {
  const [users, setUsers]           = useState<User[]>([])
  const [filtered, setFiltered]     = useState<User[]>([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')
  const [roleFilter, setRoleFilter] = useState('semua')

  useEffect(() => {
    api.get('/dashboard/users')
      .then(res => { setUsers(res.data.users); setFiltered(res.data.users) })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    let result = users
    if (search.trim()) {
      const q = search.toLowerCase()
      result = result.filter(u =>
        u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q)
      )
    }
    if (roleFilter !== 'semua') result = result.filter(u => u.role === roleFilter)
    setFiltered(result)
  }, [search, roleFilter, users])

  const fmt = (d: string | null) => d
    ? new Date(d).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : '—'

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 24, letterSpacing: '-0.3px', marginBottom: 4 }}>
          Manajemen Pengguna
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 14 }}>Total {users.length} pengguna terdaftar</p>
      </div>

      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: 220 }}>
          <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', opacity: 0.4, pointerEvents: 'none' }}>🔍</span>
          <input
            type="text" placeholder="Cari nama atau email..." value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%', background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 10, color: 'var(--text)', fontFamily: 'DM Sans, sans-serif',
              fontSize: 14, padding: '10px 14px 10px 38px', outline: 'none',
            }}
          />
        </div>
        {['semua', 'admin', 'manager', 'staff'].map(r => (
          <button key={r} onClick={() => setRoleFilter(r)} style={{
            padding: '9px 16px', borderRadius: 10, fontSize: 13, fontWeight: 600,
            cursor: 'pointer', textTransform: 'capitalize',
            background: roleFilter === r ? 'linear-gradient(135deg, #6c63ff, #8b5cf6)' : 'var(--surface)',
            color: roleFilter === r ? '#fff' : 'var(--muted)',
            border: roleFilter === r ? '1px solid transparent' : '1px solid var(--border)',
          } as React.CSSProperties}>{r}</button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden' }}>
        {loading ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <div style={{ width: 18, height: 18, border: '2px solid rgba(108,99,255,0.3)', borderTopColor: '#6c63ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            Memuat data...
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: 48, textAlign: 'center', color: 'var(--muted)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🔍</div>
            <p>Tidak ada pengguna ditemukan</p>
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['#', 'Pengguna', 'Role', 'Status', 'Login Terakhir', 'Terdaftar'].map(h => (
                  <th key={h} style={{ textAlign: 'left', padding: '14px 16px', color: 'var(--muted)', fontWeight: 600, fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => (
                <tr key={u.id} style={{ borderBottom: '1px solid var(--border)', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface2)')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
                  <td style={{ padding: '14px 16px', color: 'var(--muted)', width: 40 }}>{i + 1}</td>
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 34, height: 34, borderRadius: 9, flexShrink: 0, background: 'linear-gradient(135deg, #6c63ff, #ff6584)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, color: '#fff' }}>
                        {u.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600 }}>{u.name}</div>
                        <div style={{ color: 'var(--muted)', fontSize: 12 }}>{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: ROLE_COLORS[u.role]?.bg, color: ROLE_COLORS[u.role]?.color, borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600, textTransform: 'capitalize' }}>{u.role}</span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ background: u.is_active ? 'rgba(46,204,113,0.15)' : 'rgba(255,79,112,0.15)', color: u.is_active ? '#2ecc71' : '#ff4f70', borderRadius: 20, padding: '3px 10px', fontSize: 11, fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                      <span style={{ width: 6, height: 6, borderRadius: '50%', background: u.is_active ? '#2ecc71' : '#ff4f70', display: 'inline-block' }} />
                      {u.is_active ? 'Aktif' : 'Nonaktif'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px', color: 'var(--muted)' }}>{fmt(u.last_login)}</td>
                  <td style={{ padding: '14px 16px', color: 'var(--muted)' }}>{fmt(u.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        {!loading && filtered.length > 0 && (
          <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border)', color: 'var(--muted)', fontSize: 12 }}>
            Menampilkan {filtered.length} dari {users.length} pengguna
          </div>
        )}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
