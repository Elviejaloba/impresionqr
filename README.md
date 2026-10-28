# ImpresiónQR · La Tijera

Aplicación estática para imprimir tickets promocionales desde el diálogo nativo del navegador. No utiliza backend ni base de datos.

## Ejecutar localmente

```powershell
npm install
.\node_modules\.bin\vite.cmd --host 127.0.0.1 --port 5188 --strictPort
```

Abrir `http://127.0.0.1:5188/`. Si el puerto está ocupado, elegir uno libre sin detener otros servicios.

## Formatos e impresión

- **A4:** hoja de 210 × 297 mm con tickets de 58 mm, grilla calculada a partir de la altura real del ticket y líneas de corte.
- **80 mm:** un ticket por tira; ancho útil inicial de 76 mm.
- **58 mm:** un ticket por tira; ancho útil inicial de 48 mm.

La vista previa y la impresión usan el mismo componente. La altura de las tiras y las filas A4 se recalculan si cambia el contenido. El código QR contiene `LA-TIJERA|TICKET-DE-PRUEBA|NO-VALIDO|2026-10-28`, un valor de prueba sin validez promocional.

Al imprimir, seleccionar la impresora y el papel correspondiente en Windows. Usar escala **100 %**, sin “Ajustar a página”, y desactivar encabezados y pies del navegador. El controlador de la impresora puede imponer márgenes o longitud de corte; comprobarlo con una prueba física. El formato de 58 mm requiere una impresora compatible con ese papel y no presupone compatibilidad de la 3nStar RPT008.

Los anchos útiles se ajustan en `src/styles.css` mediante `--usable-width-80` y `--usable-width-58`; el cambio se refleja en la medición y en la vista previa. No hay controles de configuración en la interfaz.

## Logotipo original

El repositorio inicial no incluía el logotipo. La aplicación muestra “La Tijera” en texto hasta que se agregue el archivo original `public/brand/logo-la-tijera.svg`. Después, crear `.env.local` con:

```text
VITE_BRAND_LOGO_URL=/brand/logo-la-tijera.svg
```

Para Railway, establecer esa variable antes de compilar. No se incluye un logotipo inventado.

## Build y Railway

```powershell
npm run build
```

`railway.json` prepara un servicio independiente. `npm run start` sirve `dist/` con un servidor estático de Node que respeta `PORT`. No se vinculó ni desplegó ningún proyecto Railway.
