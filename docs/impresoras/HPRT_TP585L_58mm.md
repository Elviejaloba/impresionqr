# HPRT TP585L · perfil de 58 mm

**Actualización posterior a la preparación inicial:** el usuario confirmó que la impresión física con el formulario corto funciona y adjuntó una fotografía con el contenido legible. No se midieron con regla el ancho del PNG ni el largo total alimentado; las mediciones propuestas abajo siguen pendientes.

## Fuentes y controlador

- [Producto y especificaciones oficiales HPRT](https://www.hprt.com/Product/TP585-2-inch-Thermal-Receipt-Printer-TP585-585L.html): rollo de 58 mm, ancho de impresión de 48 mm, 203 dpi y **barra de rasgado manual** en la variante TP585L.
- [Descarga oficial del controlador Windows TP585/TP585L](https://download.hprt.com/hprt/files/product_down_file/model/124/classify/42.html): el listado consultado el 29/10/2026 indica **v2.7.4.10**. Los controladores Virtual COM y OPOS publicados allí cumplen otras funciones; para imprimir desde Chrome/Edge se necesita el controlador de impresora Windows.
- [Manual oficial TP585L Rev.1.5](https://foreverfile.hprtcloud.com/hygj/annex_file/2024_07_24/rxAY0pKxlGPkQggS.pdf): describe Paper Manager y un rango genérico de 3 a 1000 mm de alto. **La interfaz del controlador instalado muestra otro rango**; para esta PC prevalece la comprobación local descrita abajo.

El sitio HPRT clasifica el paquete como **Windows**, sin una certificación separada de Windows 10 y 11 en esa ficha. Confirmar en la PC de destino la compatibilidad del paquete y que el sistema detecte la impresora. Descargar únicamente desde HPRT; no se incluyó ningún instalador en el proyecto.

## Estado original observado en esta PC

Comandos de solo lectura: `Get-Printer`, `Get-PrinterDriver -Name TP585L`, `Get-PrintConfiguration -PrinterName Comanderita` y `Get-Service Spooler`.

| Propiedad | Valor observado el 29/10/2026 |
| --- | --- |
| Cola | `Comanderita`, compartida, estado `Normal` |
| Puerto y controlador | `USB008`, `TP585L` (HPRT, x64, tipo 3) |
| Versión del paquete instalado | INF `DriverVer=06/16/2025,2.7.4.10`; las DLL internas muestran `2.7.2.0` |
| Formulario activo | `Custom(48.0mm * 297.0mm)` |
| Otros formularios anunciados | 48 × 297, 48 × 420 y 48 × 3276 mm |
| PrintTicket | Orientación `Portrait`, escala del controlador `None`, resolución 203 dpi |
| Preferencias visibles | Compensación horizontal/vertical `0,0 mm`, rotación `0°`, escala `100 %` |
| Configuración avanzada | **Guardar papel: Inferior**; **Alimentar papel: Finalizar documento**, distancia **21,0 mm** |
| Servicio | `Spooler` en ejecución |

PowerShell no expone los valores activos de **Guardar papel** o **Alimentar papel** de este controlador; se leyeron en **Preferencias de impresión → Avanzada**. En el relevamiento inicial se cerraron ambos diálogos con **Cancelar**, sin cambiar ajustes.

## Formulario corto preparado el 29/10/2026

En **Administrador/Paper Manager** del controlador instalado se leyeron estos límites: **ancho de 10,0 a 600,0 mm** y **largo de 10,0 a 3276,0 mm**. Se creó `IMPRESIONQR_48x27` con 48,0 × 27,0 mm; se conservó `Custom(48.0mm * 297.0mm)`. El formulario nuevo aparece al reabrir las preferencias y Windows `PrintCapabilities` lo anuncia como **48000 × 27000 micrómetros**. Chrome lo muestra como **Tamaño del papel: IMPRESIONQR_48x27** al elegir Comanderita y calcula **1 hoja de papel** en la vista previa de 58 mm. Esta evidencia confirma que Windows y Chrome *ofrecen* el tamaño; todavía no confirma orientación ni longitud física de salida.

`Get-PrintConfiguration -PrinterName Comanderita` sigue mostrando **48 × 297 mm en el PrintTicket de la cola**, aunque las preferencias reabiertas seleccionan `IMPRESIONQR_48x27`. Por esa diferencia entre ajustes expuestos por Windows, **comprobar el tamaño en el diálogo de Chrome/Edge antes de cada prueba**; no inferirlo únicamente del PrintTicket. En Chrome se observaron «Márgenes: Predeterminados» y «Escala: Predeterminado». No se confirmó que equivalgan a cero y 100 %, y el control de encabezados/pies no quedó verificable en esa vista. Se canceló la vista previa, sin enviar un trabajo.

Solo se preparó el **formulario**. No se tocó **Alimentar papel: Finalizar documento, 21,0 mm** ni el modo «Guardar papel: Inferior». Este aislamiento permite medir primero la influencia del formulario y luego, en una prueba separada si hiciera falta, la del avance.

**Longitud esperada antes de medir:** el contenido mide 24,04 mm de alto y la página pedida mide 27 mm. Si el controlador agrega íntegros los 21 mm al terminar, el papel alimentado podría rondar **48 mm**; Save Paper y la posición de la barra pueden alterar ese total. Es una hipótesis para contrastar con una regla, no una medida física confirmada.

## Configuración propuesta para una PC de uso

1. Instalar o mantener el controlador Windows oficial si la PC no tiene uno funcional. Identificar el puerto real y confirmar el modelo TP585L en **Configuración de Windows → Impresoras y escáneres**. Si ya funciona con v2.7.4.10, no actualizar solo por esta guía.
2. En esta PC seleccionar el formulario ya creado **IMPRESIONQR_48x27**; en otra PC crearlo solo si su Paper Manager admite 48 × 27 mm. Es la página que solicita actualmente IMPRESIONQR para este PNG: imagen de **48 × 24,04 mm**, con 1 mm arriba y abajo y reserva de redondeo. Conservar el formulario original de 48 × 297 mm para poder volver a él. La aceptación *física* del formulario sigue pendiente.
3. Seleccionar el formulario corto en el controlador **y** en Chrome/Edge. Confirmar por la orientación del contenido en la vista previa que los 48 mm cruzan el rollo y los 27 mm siguen el avance. Como 27 < 48, algunas interfaces lo etiquetan «horizontal»; esa etiqueta por sí sola no justifica rotar el PNG ni usar 297 mm.
4. En Chrome/Edge: **Destino = Comanderita**, **escala explícita 100 %**, **márgenes Ninguno**, **encabezados y pies desactivados**. Desactivar cualquier «Ajustar a página» o rotación automática en preferencias del controlador. La vista previa debe mostrar una sola imagen, entera, a casi todo el ancho útil. Si el diálogo no deja seleccionar o verificar esos ajustes, no considerar terminada la preparación física.
5. Revisar **Guardar papel** y **Alimentar papel/Distancia** en las preferencias HPRT. Actualmente se muestran ahorro «Inferior» y avance al finalizar el documento de **21,0 mm**; ese valor puede explicar parte del papel extra, además del formulario de 297 mm. Reducirlo solo después de medir una prueba: la TP585L debe sacar suficiente papel para alcanzar su barra de rasgado. No tiene cortador automático que `window.print()` pueda activar.

### Diagnóstico de la tira larga observada

En la prueba anterior Chrome usó el formulario **48 × 297 mm**, márgenes y escala predeterminados, y encabezados y pies activos. El navegador/controlador colocó el PNG pequeño y girado en una tira larga y añadió texto de cabecera/pie. A ello puede sumarse el avance HPRT configurado de **21,0 mm** al finalizar el documento; no se midió por separado. La aplicación ahora solicita 48 × 27 mm, pero **`@page` no sustituye el formulario elegido en Windows**. Si la vista previa sigue usando 297 mm, corregir primero el formulario y los ajustes del navegador; no aumentar el CSS arbitrariamente.

Si el formulario de 27 mm se imprime girado, registrar la orientación y el ancho medido **antes de modificar otra variable**. Luego evaluar con el controlador un formulario cuyo largo supere su ancho, comenzando por el menor largo que realmente ofrezca y permita la imagen completa; una página de ese tipo consumirá más papel y no se debe imponer sin ese resultado físico. Si ni un formulario corto ni Save Paper funcionan desde el navegador, la impresión web estándar no puede ordenar el largo de avance; solicitar soporte HPRT o evaluar otro flujo local de impresión antes de cambiar la aplicación.

La [guía de sucursales](GUIA_SUCURSALES.md) describe una única prueba física controlada y las mediciones que deben registrarse.
