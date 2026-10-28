import { useLayoutEffect, useRef, useState } from 'react'
import { QRCodeSVG } from 'qrcode.react'

type Format = 'a4' | '80' | '58'

const formats: { value: Format; label: string; detail: string }[] = [
  { value: 'a4', label: 'A4', detail: 'Múltiples tickets' },
  { value: '80', label: 'Comandera 80 mm', detail: 'Un ticket por tira' },
  { value: '58', label: 'Comandera 58 mm', detail: 'Un ticket por tira' },
]

const a4Width = 210
const a4Height = 297
const a4Padding = 4
const a4TicketWidth = 58

function Brand({ ticket = false, format = 'a4' }: { ticket?: boolean; format?: Format }) {
  const logoSrc = format === 'a4'
    ? '/brand/logo-la-tijera-verde.png'
    : '/brand/logo-la-tijera-termico-bn.png'
  return (
    <span className={ticket ? 'ticket-brand' : 'app-brand'}>
      <img className="brand-logo" src={logoSrc} alt="La Tijera" />
    </span>
  )
}

function Ticket({ format, qrValue }: { format: Format; qrValue?: string }) {
  const printableQr = qrValue?.trim()
  return (
    <article className={`ticket ticket--${format}`} aria-label="Ticket promocional">
      <Brand ticket format={format} />
      <div className="ticket-rule" />
      <strong className="ticket-title">TICKET PROMOCIONAL</strong>
      <p className="ticket-offer">Compras superiores a <strong>$45.000</strong></p>
      {printableQr && <div className="ticket-qr">
        <QRCodeSVG value={printableQr} size={160} marginSize={4} level="M" title="Código QR promocional" />
      </div>}
    </article>
  )
}

export default function App() {
  const [format, setFormat] = useState<Format>('a4')
  const [pxPerMm, setPxPerMm] = useState(96 / 25.4)
  const [ticketHeightMm, setTicketHeightMm] = useState(0)
  const [previewWidth, setPreviewWidth] = useState(0)
  const measurementRef = useRef<HTMLDivElement>(null)
  const rulerRef = useRef<HTMLDivElement>(null)
  const previewRef = useRef<HTMLDivElement>(null)

  useLayoutEffect(() => {
    const measure = () => {
      const calibration = (rulerRef.current?.getBoundingClientRect().width || 0) / 100
      const height = measurementRef.current?.getBoundingClientRect().height || 0
      if (calibration > 0 && height > 0) {
        setPxPerMm(calibration)
        setTicketHeightMm(height / calibration)
      }
    }
    const observer = new ResizeObserver(measure)
    if (measurementRef.current) observer.observe(measurementRef.current)
    if (rulerRef.current) observer.observe(rulerRef.current)
    measure()
    return () => observer.disconnect()
  }, [format])

  useLayoutEffect(() => {
    const element = previewRef.current
    if (!element) return
    const observer = new ResizeObserver(() => setPreviewWidth(element.clientWidth))
    observer.observe(element)
    setPreviewWidth(element.clientWidth)
    return () => observer.disconnect()
  }, [])

  const isA4 = format === 'a4'
  const paperWidth = isA4 ? a4Width : Number(format)
  const thermalPageHeight = Math.ceil(ticketHeightMm + 2.5)
  const paperHeight = isA4 ? a4Height : Math.max(thermalPageHeight, 1)
  const columns = Math.floor((a4Width - 2 * a4Padding) / a4TicketWidth)
  const rows = ticketHeightMm > 0
    ? Math.min(4, Math.max(0, Math.floor((a4Height - 2 * a4Padding - 0.5) / ticketHeightMm)))
    : 0
  const ticketCount = columns * rows
  const scale = Math.min(1, Math.max(0.1, (previewWidth - 2) / (paperWidth * pxPerMm)))
  const printPageSize = isA4 ? 'A4' : `${paperWidth}mm ${paperHeight}mm`

  return (
    <main className="app-shell">
      <style>{`@media print { @page { size: ${printPageSize}; margin: 0; } }`}</style>
      <div className="measure-ruler" ref={rulerRef} />
      <div className="measurement" key={format} ref={measurementRef}>
        {isA4 ? <div className="ticket-slot"><Ticket format="a4" /></div> : <Ticket format={format} />}
      </div>

      <aside className="controls">
        <div className="controls-top">
          <Brand />
          <span className="eyebrow">IMPRESIÓN PROMOCIONAL</span>
          <h1>Elegí el papel.<br />Imprimí el ticket.</h1>
          <p className="intro">Seleccioná un formato y revisá la vista previa antes de imprimir.</p>
        </div>

        <fieldset className="format-selector">
          <legend>Formato de impresión</legend>
          {formats.map((item) => (
            <label className={`format-option ${format === item.value ? 'is-selected' : ''}`} key={item.value}>
              <input
                type="radio"
                name="format"
                value={item.value}
                checked={format === item.value}
                onChange={() => { setTicketHeightMm(0); setFormat(item.value) }}
              />
              <span className="radio-mark" aria-hidden="true" />
              <span className="format-copy"><strong>{item.label}</strong><small>{item.detail}</small></span>
              <span className="format-size">{item.value === 'a4' ? '210 × 297' : `${item.value} mm`}</span>
            </label>
          ))}
        </fieldset>

        <div className="action-area">
          <button type="button" disabled={!ticketHeightMm || (isA4 && ticketCount === 0)} onClick={() => window.print()}>
            IMPRIMIR TICKET <span aria-hidden="true">↗</span>
          </button>
          <p>Se abrirá el diálogo de impresión del navegador.</p>
        </div>
      </aside>

      <section className="preview-section" aria-label="Vista previa de impresión">
        <div className="preview-heading">
          <div><span className="eyebrow">VISTA PREVIA</span><h2>{formats.find((item) => item.value === format)?.label}</h2></div>
          <p>{isA4 ? `${ticketCount} tickets por hoja · ${columns} columnas × ${rows} filas` : `1 ticket · papel de ${paperWidth} mm`}</p>
        </div>
        <div className="preview-canvas" ref={previewRef}>
          <div className="preview-viewport" style={{ width: paperWidth * pxPerMm * scale, height: paperHeight * pxPerMm * scale }}>
            <div
              className={`paper ${isA4 ? 'paper--a4' : 'paper--thermal'}`}
              style={{ width: `${paperWidth}mm`, height: `${paperHeight}mm`, transform: `scale(${scale})` }}
            >
              {isA4 ? (
                <div className="a4-grid" style={{ gridTemplateColumns: `repeat(${columns}, ${a4TicketWidth}mm)` }}>
                  {Array.from({ length: ticketCount }, (_, index) => <div className="ticket-slot" key={index}><Ticket format="a4" /></div>)}
                </div>
              ) : <Ticket format={format} />}
            </div>
          </div>
        </div>
        <p className="preview-note">Medidas físicas · Imprimí al 100 %, sin ajustar a página.</p>
      </section>
    </main>
  )
}
