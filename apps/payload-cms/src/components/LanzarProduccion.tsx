'use client'

import React, { useState } from 'react'

export function LanzarProduccionButton() {
  const [estado, setEstado] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const lanzar = async () => {
    const webhookUrl = process.env.NEXT_PUBLIC_NETLIFY_BUILD_HOOK

    if (!webhookUrl) {
      console.error('La variable NEXT_PUBLIC_NETLIFY_BUILD_HOOK no está definida.')
      setEstado('error')
      return
    }

    setEstado('loading')

    try {
      const res = await fetch(webhookUrl, { method: 'POST' })

      if (!res.ok) throw new Error(`Error HTTP: ${res.status}`)

      setEstado('success')
      setTimeout(() => setEstado('idle'), 4000)
    } catch (err) {
      console.error('Error al lanzar build:', err)
      setEstado('error')
      setTimeout(() => setEstado('idle'), 4000)
    }
  }

  const estilos: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    margin: '12px 16px',
    padding: '10px 18px',
    borderRadius: '6px',
    border: 'none',
    cursor: estado === 'loading' ? 'not-allowed' : 'pointer',
    fontWeight: 600,
    fontSize: '13px',
    transition: 'background 0.2s',
    background:
      estado === 'success'
        ? '#16a34a'
        : estado === 'error'
          ? '#dc2626'
          : '#0ea5e9',
    color: '#ffffff',
    opacity: estado === 'loading' ? 0.7 : 1,
  }

  const etiquetas = {
    idle: '🚀 Lanzar a producción',
    loading: '⏳ Lanzando...',
    success: '✅ Build iniciada',
    error: '❌ Error al lanzar',
  }

  return (
    <button
      style={estilos}
      onClick={lanzar}
      disabled={estado === 'loading'}
      title="Dispara el build de Netlify"
    >
      {etiquetas[estado]}
    </button>
  )
}
