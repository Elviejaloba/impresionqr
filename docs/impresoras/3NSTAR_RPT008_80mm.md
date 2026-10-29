# 3nStar RPT008 · perfil de 80 mm

## Fuentes y controlador

- [Descargas oficiales 3nStar, sección RPT008](https://3nstar.com/descaragas-para-impresoras/?lang=es): enlaza el paquete compartido **RPT Drivers**, manual y especificaciones. El enlace oficial del paquete apunta a `RPT-Drivers.zip`. La página **no publica un número de versión**; leer la versión del instalador/INF antes de instalar y registrarla en la sucursal. No descargar ejecutables desde terceros.
- [Especificación oficial RPT008](https://3nstar.com/wp-content/uploads/2016/12/RPT008.pdf): rollo de 79,5 ± 0,5 mm y **76 mm de ancho efectivo** de impresión.
- [Manual oficial RPT008](https://3nstar.com/wp-content/uploads/2019/04/RPT008-User-Manual.pdf): incluye Windows 10 entre los sistemas de su lista y describe opciones de cortador; no certifica expresamente Windows 11. El sitio de producto indica compatibilidad genérica con Windows. Confirmar el paquete y modelo exactos en la PC de uso.
- [Manual oficial de programación RPT008](https://3nstar.com/wp-content/uploads/2019/04/RPT008-Programming-Manual.pdf): documenta comandos de alimentación y corte para la impresora. IMPRESIONQR usa el diálogo de Windows y no envía esos comandos desde la web.

La RPT008 **no está instalada** en la PC de desarrollo. No se pudieron consultar su controlador, versión instalada, formularios, márgenes, avance ni cortador reales. La especificación publicada describe un cortador, mientras que el manual indica variantes/opciones: verificar el equipo concreto antes de prometer corte automático.

**Longitud esperada antes de medir:** el PNG a 76 mm ocupa 38,06 mm de alto y la página CSS solicitada mide 41 mm. El avance hasta la cuchilla, si existe, y cualquier alimentación configurada en el controlador se **desconocen** hasta inspeccionar la RPT008 de la sucursal. No extrapolar los 21 mm de HPRT.

## Configuración propuesta para la sucursal

1. Descargar el **RPT Drivers** desde la página oficial, inspeccionar la versión y compatibilidad del paquete, e instalarlo en la PC Windows que conectará la RPT008. Elegir el puerto USB, serie o de red que corresponda a esa impresora; confirmar que Windows la muestre con un nombre y controlador identificables.
2. En **Preferencias de impresión** registrar el formulario original, el ancho imprimible, orientación, escala, márgenes, avance posterior y opciones de corte. Comprobar que el controlador admite un formulario corto con el ancho efectivo requerido. La aplicación solicita **80 × 41 mm** y dibuja el PNG a **76 × 38,06 mm**. Es una configuración inicial basada en la especificación, pendiente de verificación con el controlador real.
3. Seleccionar el formulario corto compatible en el controlador y en Chrome/Edge. Confirmar que el eje de **80 mm cruza el rollo** y que el eje de **41 mm sigue el avance**, sin giro ni reducción automática. La etiqueta «horizontal» puede aparecer por la geometría 80 × 41; juzgar la dirección real de alimentación en la vista previa y en la prueba física.
4. En Chrome/Edge: elegir la RPT008 como **Destino**, escala **100 %**, márgenes **Ninguno**, encabezados y pies **desactivados**. La vista previa debe contener una sola imagen completa, sin texto generado por la aplicación ni segunda página.
5. Revisar las preferencias de **avance/Feed**, ahorro de papel y **corte**. Si el controlador ofrece corte automático, escoger **corte al finalizar el documento** para este trabajo de una página; no presuponer el modo de fábrica. Verificar en el equipo si tiene cuchilla y si admite corte parcial o total. El mecanismo puede alimentar papel adicional para llevar el borde a la cuchilla; medirlo antes de reducirlo. La web usa `window.print()` y no envía comandos ESC/POS de corte. Si el controlador no ofrece esa opción, documentarlo y consultar el manual o soporte 3nStar antes de prometer un corte.

No instalar un formulario de 297 mm para este ticket corto si el controlador admite uno breve. Si la RPT008 real anuncia un ancho útil distinto de 76 mm, anotar el dato y la salida medida: el navegador no puede detectarlo automáticamente. No aplicar escala artificial para ocultar una incompatibilidad de formulario. Si el driver solo acepta páginas largas, pedir al fabricante una configuración de rollo/ahorro de papel compatible o evaluar un flujo local distinto; no atribuir la reducción o el avance al PNG.

La [guía de sucursales](GUIA_SUCURSALES.md) indica cómo registrar una prueba física única. **No existe validación física de este modelo en la PC de desarrollo.**
