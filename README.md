# ImpresiónQR · La Tijera

Aplicación estática para imprimir exclusivamente el PNG original `QRSorteodemototicket.png` desde el diálogo nativo del navegador. No utiliza backend ni base de datos.

## Ejecutar localmente

```powershell
npm install
.\node_modules\.bin\vite.cmd --host 127.0.0.1 --port 5188 --strictPort
```

Abrir `http://127.0.0.1:5188/`. Si el puerto está ocupado, elegir uno libre sin detener otros servicios.

## Formatos e impresión

- **A4:** hoja de 210 × 297 mm; 12 copias del PNG en 3 columnas × 4 filas, a 66 mm de ancho, con 4 mm de margen y 2 mm de separación. Las guías de corte punteadas negras delimitan los 12 recuadros sin superponerse al PNG. La altura de cada copia se obtiene de la proporción real del archivo y la cantidad de filas se limita a las que caben sin cortes.
- **80 mm:** una copia del PNG por tira, con ancho útil inicial de 76 mm y altura proporcional. Con el archivo actual, la imagen mide aproximadamente 76 × 38,06 mm y la página solicitada mide 80 × 41 mm.
- **58 mm:** una copia del mismo PNG por tira, con ancho útil inicial de 48 mm y altura proporcional. La vista previa representa el rollo físico de 58 mm; con el archivo actual, la imagen mide aproximadamente 48 × 24,04 mm y la página solicitada al navegador mide 48 × 27 mm para coincidir con el ancho útil del controlador detectado.

La vista previa y la impresión usan el mismo componente `<img>` y el mismo archivo importado por Vite. No se generan códigos QR, textos, logotipos ni otros elementos sobre el PNG impreso. En A4, las guías de corte se dibujan en los espacios entre imágenes; los formatos térmicos no llevan guías. No se aplican filtros, recortes ni deformaciones. La altura de las tiras se calcula a partir de la imagen cargada.

El botón **IMPRIMIR TICKET** llama directamente a `window.print()`. No genera archivos ni abre PDF. Abrir la aplicación en Chrome o Edge de Windows y elegir en su diálogo una impresora instalada o compartida. Si aparece “Guardar como PDF”, cambiar el destino en el navegador; JavaScript no puede enumerar ni seleccionar impresoras.

La interfaz muestra el logotipo verde original `logo-la-tijera-verde.png` en un encabezado compacto. Los controles y el botón están alineados a la izquierda; la vista previa, a la derecha en pantallas amplias. En móvil se apilan. El botón permanece visible al desplazarse y todos los controles, el encabezado y el logotipo de la interfaz se excluyen de la impresión. El formato del ticket se elige en la aplicación; la impresora se elige aparte, en el navegador de la PC que abrió la página. Railway solo entrega los archivos de la aplicación: no recibe trabajos de impresión ni necesita conocer impresoras.

La longitud térmica se calcula con la altura real de la imagen más 2,5 mm: 1 mm arriba, 1 mm abajo y al menos 0,5 mm de resguardo antes de redondear hacia arriba. Es una **solicitud CSS**, no una orden de avance o corte. No se impone el mismo largo a todos los controladores ni se fuerza una página más larga solo para que su alto supere su ancho. Un formulario corto puede aparecer como «horizontal» por su geometría; lo decisivo es que el controlador lo haga avanzar por el eje del rollo, sin rotar ni reducir la imagen.

### Configurar cada PC e impresora térmica

1. Verificar en Windows el ancho **imprimible**, los formularios admitidos y la longitud mínima. En la aplicación, 48 mm para 58 mm y 76 mm para 80 mm son valores iniciales, no características universales de cada marca. Si el ancho útil real es menor, ese modelo necesita una configuración de impresión específica: la web no puede leerlo automáticamente.
2. En el controlador o Chrome/Edge, seleccionar un formulario corto compatible con la página solicitada: aproximadamente **48 × 27 mm** para 58 mm y **80 × 41 mm** para 80 mm con el PNG actual. Si la impresora usa otro ancho de formulario, confirmar que el área útil, la orientación y la escala permiten imprimir la imagen completa. No seleccionar formularios de 297 mm o más para un único ticket corto, salvo que el controlador tenga un modo comprobado de ahorrar papel.
3. En el diálogo del navegador, elegir **escala 100 %**, **márgenes Ninguno** y desactivar **encabezados y pies**. En el controlador, desactivar ajustes automáticos de escala o rotación que reduzcan la imagen. Confirmar en la vista previa que el PNG ocupa el ancho esperado y que hay una sola página.
4. Revisar **Save Paper**, **Feed Paper**, avance posterior y corte o rasgado en las preferencias de *cada* controlador. La longitud final alimentada puede superar los 27/41 mm para llegar a la cuchilla o barra de rasgado. Reducir ese avance solo hasta el mínimo que permita retirar el ticket; medirlo en una prueba física autorizada.

**Caso local TP585L («Comanderita»):** Windows la detecta por USB y declara 48 mm de ancho imprimible. La prueba física anterior usó **Custom 48 × 297 mm**, con márgenes y escala predeterminados y encabezados y pies activos: el navegador/controlador colocó el PNG girado y pequeño en una tira larga. El Administrador de papel instalado aceptó y guardó **IMPRESIONQR_48x27**; Windows lo anuncia como 48 × 27 mm y Chrome lo ofrece para Comanderita con una hoja en vista previa. El PrintTicket de la cola todavía indica 48 × 297 mm, de modo que hay que comprobar el formulario en el diálogo antes de imprimir. La TP585L tiene barra de rasgado manual y conserva **Alimentar papel al finalizar documento: 21,0 mm**. El usuario confirmó posteriormente una impresión física legible y adjuntó una foto; el ancho y el largo no se midieron con regla.

**80 mm / 3nStar RPT008:** su especificación publicada indica 76 mm de ancho efectivo, pero este equipo no está instalado en la PC de desarrollo. Verificar en la PC de uso el formulario corto admitido, el ancho efectivo y las opciones de avance y corte del controlador. No se ha comprobado físicamente el modo de 80 mm.

Si el controlador solo acepta formularios largos y no ofrece ahorro de papel, la web no puede acortar el avance mediante `@page` ni enviar comandos de corte con `window.print()`. En ese caso hay que ajustar o actualizar la configuración del controlador en esa PC; la aplicación no puede garantizar un ticket compacto por sí sola.

Los anchos físicos iniciales están en `imageWidthsMm` de `src/App.tsx`; cualquier ajuste se refleja en la medición, la vista previa y la impresión. No hay controles de configuración en la interfaz.

### Verificar desde otra PC con Windows cuando esté publicada

1. En esa PC, comprobar en **Configuración de Windows → Impresoras y escáneres** que la impresora física o compartida aparezca y pueda imprimir una página de prueba.
2. Abrir la URL publicada de Railway en Chrome o Edge de esa PC; elegir A4, 80 mm o 58 mm y revisar la vista previa.
3. Pulsar **IMPRIMIR TICKET**. En **Destino**, elegir la impresora de esa PC. Si se muestra “Guardar como PDF”, cambiarlo allí; la aplicación no fija el destino.
4. En **Más ajustes** y en el controlador, seleccionar A4 o un formulario térmico corto compatible con la longitud solicitada: aproximadamente 80 × 41 mm o 48 × 27 mm con el PNG actual. Confirmar escala 100 %, márgenes Ninguno y sin encabezados ni pies; comprobar que la salida no gire ni reduzca el PNG. Revisar avance y mecanismo de salida del equipo. Con autorización para una prueba física, medir el ancho impreso y el largo total alimentado.

Los navegadores no permiten a una página web listar impresoras, imponer un destino ni garantizar que el controlador acepte un tamaño definido en `@page`. La disponibilidad de una impresora y sus tamaños debe verificarse en cada PC.

Para la instalación y una única prueba física controlada por sucursal, ver [guía de sucursales](docs/impresoras/GUIA_SUCURSALES.md), [perfil HPRT TP585L](docs/impresoras/HPRT_TP585L_58mm.md) y [perfil 3nStar RPT008](docs/impresoras/3NSTAR_RPT008_80mm.md).

## Archivo original

La única imagen que se imprime es `C:\QR\QRSorteodemototicket.png` (575 × 288 px, RGBA). El archivo se importa sin modificarlo y forma parte del build para que funcione desde Railway. Su SHA-256 actual es `7994070FADAE259C4E5D425BFE9C27D67A3DCE570823F713FDB012214FEEB992`. El logotipo verde se usa solo en la interfaz.

## Build y Railway

```powershell
npm run build
```

`railway.json` prepara un servicio independiente. `npm run start` sirve `dist/` con un servidor estático de Node que respeta `PORT`. No se vinculó ni desplegó ningún proyecto Railway.
