import { useLayoutEffect, useRef, useState, type CSSProperties } from 'react'
import originalTicket from '../QRSorteodemototicket.png'
import greenLogo from '../logo-la-tijera-verde.png'

type Format = 'a4' | '80' | '58'

const formats: { value: Format; label: string; detail: string }[] = [
  { value: 'a4', label: 'A4', detail: 'Múltiples copias' },
  { value: '80', label: 'Comandera 80 mm', detail: 'Una copia por tira' },
  { value: '58', label: 'Comandera 58 mm', detail: 'Una copia por tira' },
]

const a4WidthMm = 210
const a4HeightMm = 297
const a4PaddingMm = 4
const a4GapMm = 2
const a4Columns = 3
const a4MaxRows = 4
const imageWidthsMm: Record<Format, number> = {
  a4: (a4WidthMm - 2 * a4PaddingMm - (a4Columns - 1) * a4GapMm) / a4Columns,
  '80': 76,
  '58': 48,
}

function TicketImage({ widthMm, onLoad, onError }: { widthMm: number; onLoad?: () => void; onError?: () => void }) {
  return (
    <img
      className="ticket-image"
      src={originalTicket}
      alt="Ticket original"
      style={{ width: `${widthMm}mm` }}
      onLoad={onLoad}
      onError={onError}
    />
  )
}

export default function App() {
  const [format, setFormat] = useState<Format>('a4')
  const [imageState, setImageState] = useState<'loading' | 'ready' | 'error'>('loading')
  const [pxPerMm, setPxPerMm] = useState(96 / 25.4)
  const [imageHeightMm, setImageHeightMm] = useState(0)
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
        setImageHeightMm(height / calibration)
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
  const imageWidthMm = imageWidthsMm[format]
  const paperWidthMm = isA4 ? a4WidthMm : Number(format)
  // Some 58 mm drivers expose the 48 mm printable area as the paper form.
  const printPaperWidthMm = format === '58' ? imageWidthMm : paperWidthMm
  const paperHeightMm = isA4 ? a4HeightMm : Math.max(1, Math.ceil(imageHeightMm + 2.5))
  const columns = Math.floor((a4WidthMm - 2 * a4PaddingMm + a4GapMm) / (imageWidthsMm.a4 + a4GapMm))
  const rows = imageHeightMm > 0
    ? Math.min(a4MaxRows, Math.max(0, Math.floor((a4HeightMm - 2 * a4PaddingMm - 0.5 + a4GapMm) / (imageHeightMm + a4GapMm))))
    : 0
  const copies = columns * rows
  const scale = Math.min(isA4 ? 1 : 1.8, Math.max(0.1, (previewWidth - 48) / (paperWidthMm * pxPerMm)))
  const printPageSize = isA4 ? 'A4' : `${printPaperWidthMm}mm ${paperHeightMm}mm`
  const ready = imageState === 'ready' && imageHeightMm > 0 && (!isA4 || copies > 0)
  const selectedFormat = formats.find((item) => item.value === format)!

  return (
    <main className="app-shell">
      <style>{`@media print { @page { size: ${printPageSize}; margin: 0; } }`}</style>
      <div className="measure-ruler" ref={rulerRef} />
      <div className="measurement" key={format} ref={measurementRef}>
        <TicketImage widthMm={imageWidthMm} onLoad={() => setImageState('ready')} onError={() => setImageState('error')} />
      </div>

      <header className="app-header">
        <div className="header-inner">
          <img className="header-logo" src={greenLogo} alt="La Tijera" />
          <h1>Impresión de tickets</h1>
        </div>
      </header>

      <div className="workspace">
        <aside className="controls">
          <h2>Formato de impresión</h2>
          <fieldset className="format-selector">
            <legend className="visually-hidden">Formato de impresión</legend>
            {formats.map((item) => (
              <label className={`format-option ${format === item.value ? 'is-selected' : ''}`} key={item.value}>
                <input
                  type="radio"
                  name="format"
                  value={item.value}
                  checked={format === item.value}
                  onChange={() => { setImageHeightMm(0); setFormat(item.value) }}
                />
                <span className="radio-mark" aria-hidden="true" />
                <span className="format-copy"><strong>{item.label}</strong><small>{item.detail}</small></span>
                <span className="format-size">{item.value === 'a4' ? '210 × 297' : `${item.value} mm`}</span>
              </label>
            ))}
          </fieldset>
        </aside>

        <div className="print-action">
          <button type="button" disabled={!ready} onClick={() => window.print()}>
            IMPRIMIR TICKET <span aria-hidden="true">↗</span>
          </button>
        </div>

        <section className="preview-section" aria-label="Vista previa de impresión">
          <div className="preview-heading">
            <h2>Vista previa</h2>
            <div className="preview-meta">
              <strong>{selectedFormat.label}</strong>
              <span>{isA4 ? `${copies} copias · ${columns} × ${rows}` : `1 copia · papel de ${paperWidthMm} mm`}</span>
            </div>
          </div>
          <div className={`preview-canvas ${isA4 ? 'preview-canvas--a4' : 'preview-canvas--thermal'}`} ref={previewRef}>
            {imageState === 'error' && <p className="preview-status">No se pudo cargar QRSorteodemototicket.png.</p>}
            {imageState === 'loading' && <p className="preview-status">Cargando PNG original…</p>}
            {ready && <div className="preview-viewport" style={{ width: paperWidthMm * pxPerMm * scale, height: paperHeightMm * pxPerMm * scale }}>
              <div
                className={`paper ${isA4 ? 'paper--a4' : 'paper--thermal'}${format === '58' ? ' paper--58' : ''}`}
                style={{ width: `${paperWidthMm}mm`, height: `${paperHeightMm}mm`, transform: `scale(${scale})`, '--print-paper-width': `${printPaperWidthMm}mm` } as CSSProperties}
              >
                {isA4 ? (
                  <div className="a4-grid" style={{ gridTemplateColumns: `repeat(${columns}, ${imageWidthsMm.a4}mm)`, gap: `${a4GapMm}mm` }}>
                    {Array.from({ length: copies }, (_, index) => <TicketImage widthMm={imageWidthsMm.a4} key={index} />)}
                  </div>
                ) : <TicketImage widthMm={imageWidthMm} />}
              </div>
            </div>}
          </div>
          <p className="preview-note">Medidas físicas · Imprimí al 100 %, sin ajustar a página.</p>
        </section>
      </div>
    </main>
  )
}
