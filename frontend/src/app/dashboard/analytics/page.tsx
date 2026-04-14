export default function Page() {
  return (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)',
      borderRadius: 16, padding: 32, textAlign: 'center',
    }}>
      <div style={{ fontSize: 48, marginBottom: 16 }}>🚧</div>
      <h2 style={{ fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: 22, marginBottom: 8 }}>
        Halaman Analytics 
      </h2>
      <p style={{ color: 'var(--muted)', fontSize: 14 }}>
        Halaman ini sedang dalam pengembangan.
      </p>
    </div>
  )
}
