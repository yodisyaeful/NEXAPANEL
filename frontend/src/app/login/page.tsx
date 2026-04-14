'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import { saveAuth, isAuthenticated } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [alert, setAlert]       = useState<string | null>(null)
  const [errors, setErrors]     = useState<{ email?: string; password?: string }>({})

  // Already logged in → go to dashboard
  useEffect(() => {
    if (isAuthenticated()) router.replace('/dashboard')
  }, [router])

  // ── client-side validation ──────────────────────────────────────
  function validate(): boolean {
    const e: typeof errors = {}
    if (!email.trim()) {
      e.email = 'Email wajib diisi.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.email = 'Format email tidak valid.'
    }
    if (!password) {
      e.password = 'Password wajib diisi.'
    } else if (password.length < 6) {
      e.password = 'Password minimal 6 karakter.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  // ── submit ──────────────────────────────────────────────────────
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setAlert(null)
    if (!validate()) return

    setLoading(true)
    try {
      const { data } = await api.post('/auth/login', { email, password })
      saveAuth(data.token, data.user)
      router.replace('/dashboard')
    } catch (err: any) {
      const msg =
        err.response?.data?.message ||
        'Terjadi kesalahan. Periksa koneksi Anda.'
      setAlert(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg)',
      }}
    >
      {/* Background */}
      <div style={{
        position: 'absolute', inset: 0,
        background: `
          radial-gradient(ellipse 80% 60% at 20% 50%, rgba(108,99,255,0.15) 0%, transparent 60%),
          radial-gradient(ellipse 60% 50% at 80% 20%, rgba(255,101,132,0.10) 0%, transparent 60%)
        `,
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
          linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
        `,
        backgroundSize: '60px 60px',
        maskImage: 'radial-gradient(ellipse 70% 70% at 50% 50%, black 30%, transparent 100%)',
      }} />

      {/* Card */}
      <div className="animate-card-in" style={{
        position: 'relative', zIndex: 2,
        width: '100%', maxWidth: 420,
        margin: '24px',
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: 24,
        padding: '48px 40px',
        boxShadow: '0 40px 80px rgba(0,0,0,0.5), 0 0 0 1px rgba(108,99,255,0.1)',
      }}>

        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 36 }}>
          <div style={{
            width: 38, height: 38,
            background: 'linear-gradient(135deg, #6c63ff, #ff6584)',
            borderRadius: 10,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 18,
          }}>⬡</div>
          <span style={{
            fontFamily: 'Syne, sans-serif', fontWeight: 800,
            fontSize: 22, letterSpacing: '-0.5px',
          }}>NexaPanel</span>
        </div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 700,
          fontSize: 28, letterSpacing: '-0.5px', marginBottom: 6,
        }}>Selamat datang</h1>
        <p style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 32 }}>
          Masuk ke akun Anda untuk melanjutkan
        </p>

        {/* Alert box */}
        {alert && (
          <div className="animate-shake" style={{
            background: 'rgba(255,79,112,0.1)',
            border: '1px solid rgba(255,79,112,0.3)',
            borderRadius: 12, padding: '12px 16px',
            fontSize: 13, color: 'var(--error)',
            marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span>⚠</span><span>{alert}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Email field */}
          <div style={{ marginBottom: 18 }}>
            <label style={{
              display: 'block', fontSize: 11, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.7px',
              color: 'var(--muted)', marginBottom: 8,
            }}>Email</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%',
                transform: 'translateY(-50%)', opacity: 0.4, pointerEvents: 'none',
              }}>✉</span>
              <input
                type="email"
                value={email}
                onChange={e => { setEmail(e.target.value); setErrors(p => ({ ...p, email: undefined })) }}
                placeholder="nama@perusahaan.com"
                autoComplete="email"
                style={{
                  width: '100%',
                  background: 'var(--surface2)',
                  border: `1.5px solid ${errors.email ? 'var(--error)' : 'var(--border)'}`,
                  borderRadius: 12, color: 'var(--text)',
                  fontFamily: 'DM Sans, sans-serif', fontSize: 15,
                  padding: '13px 14px 13px 42px', outline: 'none',
                  boxShadow: errors.email ? '0 0 0 3px rgba(255,79,112,0.15)' : 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => {
                  if (!errors.email) e.target.style.borderColor = 'var(--accent)'
                  if (!errors.email) e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.15)'
                }}
                onBlur={e => {
                  if (!errors.email) e.target.style.borderColor = 'var(--border)'
                  if (!errors.email) e.target.style.boxShadow = 'none'
                }}
              />
            </div>
            {errors.email && (
              <p style={{ color: 'var(--error)', fontSize: 12, marginTop: 6 }}>⚠ {errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div style={{ marginBottom: 24 }}>
            <label style={{
              display: 'block', fontSize: 11, fontWeight: 600,
              textTransform: 'uppercase', letterSpacing: '0.7px',
              color: 'var(--muted)', marginBottom: 8,
            }}>Password</label>
            <div style={{ position: 'relative' }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%',
                transform: 'translateY(-50%)', opacity: 0.4, pointerEvents: 'none',
              }}>🔒</span>
              <input
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setErrors(p => ({ ...p, password: undefined })) }}
                placeholder="Masukkan password"
                autoComplete="current-password"
                style={{
                  width: '100%',
                  background: 'var(--surface2)',
                  border: `1.5px solid ${errors.password ? 'var(--error)' : 'var(--border)'}`,
                  borderRadius: 12, color: 'var(--text)',
                  fontFamily: 'DM Sans, sans-serif', fontSize: 15,
                  padding: '13px 44px 13px 42px', outline: 'none',
                  boxShadow: errors.password ? '0 0 0 3px rgba(255,79,112,0.15)' : 'none',
                  transition: 'border-color 0.2s, box-shadow 0.2s',
                }}
                onFocus={e => {
                  if (!errors.password) e.target.style.borderColor = 'var(--accent)'
                  if (!errors.password) e.target.style.boxShadow = '0 0 0 3px rgba(108,99,255,0.15)'
                }}
                onBlur={e => {
                  if (!errors.password) e.target.style.borderColor = 'var(--border)'
                  if (!errors.password) e.target.style.boxShadow = 'none'
                }}
              />
              <button
                type="button"
                onClick={() => setShowPass(v => !v)}
                style={{
                  position: 'absolute', right: 12, top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none', border: 'none',
                  color: 'var(--muted)', cursor: 'pointer', fontSize: 15,
                }}
              >
                {showPass ? '🙈' : '👁'}
              </button>
            </div>
            {errors.password && (
              <p style={{ color: 'var(--error)', fontSize: 12, marginTop: 6 }}>⚠ {errors.password}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #6c63ff, #8b5cf6)',
              border: 'none', borderRadius: 12,
              color: '#fff',
              fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 15,
              padding: 14, cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
              transition: 'opacity 0.2s, transform 0.15s',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {loading ? (
              <>
                <div style={{
                  width: 18, height: 18,
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#fff',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                }} />
                Memproses...
              </>
            ) : 'Masuk Sekarang'}
          </button>
        </form>

        {/* Demo hint */}
        <div style={{ marginTop: 20, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Demo akun:</p>
          <div style={{
            background: 'var(--surface2)',
            border: '1px solid var(--border)',
            borderRadius: 8, padding: '8px 14px',
            fontSize: 12, color: 'var(--muted)',
            lineHeight: 1.8,
          }}>
            📧 admin@nexapanel.com<br />🔑 admin123
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input::placeholder { color: #3a3a4a; }
      `}</style>
    </main>
  )
}
