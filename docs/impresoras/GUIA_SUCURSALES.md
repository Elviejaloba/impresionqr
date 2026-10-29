# IMPRESIONQR · instalación y prueba por sucursal

IMPRESIONQR se abre desde la misma URL de Railway en cada PC. La página entrega el PNG original y llama a `window.print()`; **Chrome/Edge y Windows de esa PC** eligen el destino, el formulario y el controlador. Railway no conoce impresoras ni recibe trabajos de impresión. No hay agente local ni impresión silenciosa.

La impresión física local de 58 mm fue confirmada posteriormente por el usuario con una fotografía; todavía falta medir el ancho y el avance con regla. Las instrucciones de prueba siguientes siguen siendo útiles para otras computadoras y para el modelo de 80 mm.

## Preparación sin imprimir

1. Identificar el modelo físico y el ancho del rollo. Consultar el perfil [HPRT TP585L de 58 mm](HPRT_TP585L_58mm.md) o [3nStar RPT008 de 80 mm](3NSTAR_RPT008_80mm.md). Descargar controladores solo desde los enlaces oficiales de esos perfiles si hace falta instalarlos; anotar versión y puerto.
2. Ejecutar en PowerShell de **esa PC** (solo lectura):

   ```powershell
   Get-Printer | Format-Table Name,DriverName,PortName,PrinterStatus,Shared
   Get-PrinterDriver | Format-Table Name,DriverVersion,InfPath
   Get-PrintConfiguration -PrinterName "NOMBRE_DE_LA_IMPRESORA"
   Get-Service Spooler
   ```

   Registrar el formulario original, orientación y escala. En **Preferencias de impresión** anotar además márgenes, Save Paper, Feed Paper/Feed Distance y corte; PowerShell puede no exponerlos. Guardar una captura de los ajustes antes de cambiarlos.
3. Abrir IMPRESIONQR en Chrome o Edge. Seleccionar el formato en la web: **A4** (12 copias), **58 mm** (una copia) u **80 mm** (una copia). La impresora se selecciona aparte en el diálogo nativo.
4. Seleccionar en Windows/Chrome un formulario corto compatible con la página solicitada por la web: actualmente **48 × 27 mm** para el perfil 58 o **80 × 41 mm** para el perfil 80. En esta PC HPRT, el Administrador aceptó `IMPRESIONQR_48x27` y `PrintCapabilities` lo anuncia como **48000 × 27000 µm**, pero `Get-PrintConfiguration` aún informa **48 × 297 mm** en el PrintTicket de la cola. Por eso debe comprobarse el papel seleccionado en el diálogo de Chrome/Edge. El tamaño de 80 mm **no está verificado en Windows** sin la RPT008. Elegir el ancho realmente imprimible y la longitud mínima que admita la impresora sin cortar la imagen ni impedir el rasgado/corte.
5. En el diálogo, comprobar **Destino físico correcto**, **escala explícita 100 %**, **márgenes Ninguno**, **encabezados y pies desactivados**. Evitar «Ajustar a página». Verificar una sola página, PNG completo, ancho aprovechado y eje de avance correcto. No aceptar una vista previa con hoja de 297 mm para un ticket de 27/41 mm ni un PNG girado y diminuto. En el Chrome local se vio **Comanderita → IMPRESIONQR_48x27 → 1 hoja**, pero «Márgenes: Predeterminados» y «Escala: Predeterminado» seguían sin confirmar; la vista previa se canceló sin imprimir.

## Una prueba física controlada, después de autorización

Preparar la impresora, seleccionar su perfil y hacer **una sola impresión por modelo** desde el botón de la aplicación, únicamente después de autorización. No imprimir desde esta documentación ni repetir hasta analizar el resultado.

- **TP585L:** elegir `IMPRESIONQR_48x27`; mantener **Alimentar papel al finalizar documento = 21,0 mm** y **Guardar papel = Inferior** durante la primera prueba para aislar el efecto del formulario. Confirmar en Chrome/Edge escala 100 %, márgenes Ninguno y sin encabezados/pies; imprimir **un** ticket y medir el ancho del PNG y todo el papel alimentado. Si gira o reduce, detenerse y registrar la vista previa, el formulario y las medidas antes de probar otro largo. Solo en una prueba posterior y separada evaluar la distancia de avance.
- **RPT008:** cuando exista equipo y controlador oficial en una sucursal, registrar su versión, ancho útil, formulario, orientación, avance y opción de corte. Seleccionar el formulario corto que el controlador realmente acepte, confirmar 100 %, márgenes Ninguno y sin encabezados/pies; imprimir **un** ticket y medir ancho, longitud total y distancia adicional hasta la cuchilla. Si no se ofrece corte al finalizar, registrarlo sin enviar comandos desde la web.

Registrar:

| Dato | 58 mm TP585L | 80 mm RPT008 |
| --- | --- | --- |
| Ancho del PNG esperado | 48 mm | 76 mm, sujeto al controlador |
| Alto del PNG esperado | 24,04 mm | 38,06 mm |
| Página solicitada por CSS | 48 × 27 mm | 80 × 41 mm |
| Ancho impreso medido | ___ mm | ___ mm |
| Largo total alimentado medido | ___ mm | ___ mm |
| Formulario, escala y orientación elegidos | ___ | ___ |
| Save Paper, Feed, corte/rasgado | ___ | ___ |
| ¿Imagen completa y sin texto añadido? | ___ | ___ |

Comparar el ancho impreso con el esperado. Si es mucho menor o aparece girado, revisar primero **formulario, orientación, escala y márgenes** en Chrome/Edge y en el controlador. Si el ancho es correcto pero sobra papel al final, revisar **alto del formulario, Feed Distance, Save Paper y distancia necesaria hasta la cuchilla o barra**. Si aparecen fecha, URL o número de página, desactivar encabezados y pies. Una diferencia entre el alto del PNG y el largo alimentado **no demuestra por sí sola** un error del CSS: la impresora puede avanzar papel para cortar o rasgar.

## Límites técnicos

La página solicita tamaño con `@page`, usa la imagen sin modificar y oculta la interfaz con `@media print`. Puede fijar la geometría CSS, pero las API web estándar **no enumeran impresoras, no seleccionan el formulario de Windows ni controlan avance/corte del hardware**. Si el formulario físico y la página CSS difieren, el navegador puede centrar, girar o escalar la página según [CSS Paged Media](https://www.w3.org/TR/css-page-3/#page-size-prop). Un PDF o captura digital no valida la longitud de papel alimentada. Si el controlador no permite un formulario breve o ahorro de papel desde el navegador, consultar al fabricante; cualquier alternativa local con comandos de impresión requeriría una decisión aparte.
