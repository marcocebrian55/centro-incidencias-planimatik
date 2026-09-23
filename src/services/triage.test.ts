import { describe, expect, it } from 'vitest'
import { extractEnvioId, localTriage } from './triage'

describe('extractEnvioId', () => {
  it('detecta formato con almohadilla', () => {
    expect(extractEnvioId('llevo el envío #4821 hoy')).toBe('#4821')
  })
  it('detecta "pedido 3390"', () => {
    expect(extractEnvioId('el pedido 3390 en Vecindario')).toBe('#3390')
  })
  it('devuelve null si no hay id', () => {
    expect(extractEnvioId('no hay nadie en casa')).toBeNull()
  })
})

describe('localTriage — clasificación de fallback', () => {
  it('clasifica un pinchazo como avería (alta)', () => {
    const r = localTriage('Se me ha pinchado una rueda en la GC-1, envío #4821')
    expect(r.tipo).toBe('averia')
    expect(r.gravedad).toBe('alta')
    expect(r.envioId).toBe('#4821')
    expect(r.fuente).toBe('local')
  })

  it('clasifica cliente ausente', () => {
    const r = localTriage('He llegado y no hay nadie en casa, no contesta')
    expect(r.tipo).toBe('cliente_ausente')
  })

  it('clasifica dirección errónea', () => {
    const r = localTriage('La dirección no cuadra, el GPS me lleva a una calle que no existe')
    expect(r.tipo).toBe('direccion_erronea')
  })

  it('clasifica mercancía dañada', () => {
    const r = localTriage('Dos cajas vienen aplastadas y una mojada, mercancía dañada')
    expect(r.tipo).toBe('mercancia_danada')
  })

  it('escala a crítica ante un accidente con heridos', () => {
    const r = localTriage('Ha habido un accidente, hay heridos y la vía está cortada, urgente')
    expect(r.gravedad).toBe('critica')
  })

  it('cae en "otro" con baja confianza si no reconoce nada', () => {
    const r = localTriage('Buenos días, ¿cómo va todo por la oficina?')
    expect(r.tipo).toBe('otro')
    expect(r.confianza).toBeLessThan(0.5)
  })

  it('siempre devuelve una acción sugerida no vacía', () => {
    const r = localTriage('Voy con retraso por un atasco, llego tarde')
    expect(r.tipo).toBe('retraso')
    expect(r.accionSugerida.length).toBeGreaterThan(0)
  })
})
