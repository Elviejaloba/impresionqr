# ImpresiónQR · La Tijera

Aplicación estática para imprimir exclusivamente el PNG original `QRSorteodemototicket.png` desde el diálogo nativo del navegador. No utiliza backend ni base de datos.

## Ejecutar localmente

```powershell
npm install
.\node_modules\.bin\vite.cmd --host 127.0.0.1 --port 5188 --strictPort
```

Abrir `http://127.0.0.1:5188/`. Si el puerto está ocupado, elegir uno libre sin detener otros servicios.

## Formatos e impresión

- **A4:** hoja de 210 × 297 mm; 12 copias del PNG en 3 columnas × 4 filas, a 66 mm de ancho, con 4 mm de margen y 2 mm de separación. La altura de cada copia se obtiene de la proporción real del archivo y la cantidad de filas se limita a las que caben sin cortes.
- **80 mm:** una copia del PNG por tira, con ancho útil inicial de 76 mm y altura proporcional.
- **58 mm:** una copia del mismo PNG por tira, con ancho útil inicial de 48 mm y altura proporcional.

La vista previa y la impresión usan el mismo componente `<img>` y el mismo archivo importado por Vite. No se generan códigos QR, textos, logotipos, líneas de corte ni otros elementos sobre el PNG impreso. No se aplican filtros, recortes ni deformaciones. La altura de las tiras se calcula a partir de la imagen cargada.

El botón **IMPRIMIR TICKET** llama directamente a `window.print()`. No genera archivos ni abre PDF. Abrir la aplicación en Chrome o Edge de Windows y elegir en su diálogo una impresora instalada o compartida. Si aparece “Guardar como PDF”, cambiar el destino en el navegador; JavaScript no puede enumerar ni seleccionar impresoras.

La interfaz muestra el logotipo verde original `logo-la-tijera-verde.png` en un encabezado compacto. Los controles y el botón están alineados a la izquierda; la vista previa, a la derecha en pantallas amplias. En móvil se apilan. El botón permanece visible al desplazarse y todos los controles, el encabezado y el logotipo de la interfaz se excluyen de la impresión. El formato del ticket se elige en la aplicación; la impresora se elige aparte, en el navegador de la PC que abrió la página. Railway solo entrega los archivos de la aplicación: no recibe trabajos de impresión ni necesita conocer impresoras.

Seleccionar también el papel correspondiente en el controlador de Windows. Usar escala **100 %**, sin “Ajustar a página”, y desactivar encabezados y pies del navegador. El controlador puede imponer márgenes o longitud de corte; comprobarlo con una prueba física. El formato de 58 mm requiere una impresora y un controlador compatibles con ese papel. Un controlador que solo ofrezca 48 mm de ancho no coincide automáticamente con el formato de papel de 58 mm de la aplicación.

Los anchos físicos iniciales están en `imageWidthsMm` de `src/App.tsx`; cualquier ajuste se refleja en la medición, la vista previa y la impresión. No hay controles de configuración en la interfaz.

### Verificar desde otra PC con Windows cuando esté publicada

1. En esa PC, comprobar en **Configuración de Windows → Impresoras y escáneres** que la impresora física o compartida aparezca y pueda imprimir una página de prueba.
2. Abrir la URL publicada de Railway en Chrome o Edge de esa PC; elegir A4, 80 mm o 58 mm y revisar la vista previa.
3. Pulsar **IMPRIMIR TICKET**. En **Destino**, elegir la impresora de esa PC. Si se muestra “Guardar como PDF”, cambiarlo allí; la aplicación no fija el destino.
4. En **Más ajustes** y en el controlador, seleccionar el papel que coincida con el formato elegido, escala 100 % y sin encabezados ni pies. Hacer una prueba física y comprobar cortes, márgenes y longitud de avance.

Los navegadores no permiten a una página web listar impresoras, imponer un destino ni garantizar que el controlador acepte un tamaño definido en `@page`. La disponibilidad de una impresora y sus tamaños debe verificarse en cada PC.

## Archivo original

La única imagen que se imprime es `C:\QR\QRSorteodemototicket.png` (575 × 288 px, RGBA). El archivo se importa sin modificarlo y forma parte del build para que funcione desde Railway. Su SHA-256 actual es `7994070FADAE259C4E5D425BFE9C27D67A3DCE570823F713FDB012214FEEB992`. El logotipo verde se usa solo en la interfaz.

## Build y Railway

```powershell
npm run build
```

`railway.json` prepara un servicio independiente. `npm run start` sirve `dist/` con un servidor estático de Node que respeta `PORT`. No se vinculó ni desplegó ningún proyecto Railway.
