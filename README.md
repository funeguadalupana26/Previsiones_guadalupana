# Contratos a Previsión — Funerales Guadalupana

App web instalable (PWA) para capturar contratos de previsión, generar folio
automático, calcular enganche/plazos, guardar todo en tu Google Sheet, generar
el PDF tamaño oficio y enviarlo por WhatsApp.

## ⚠️ Antes de publicar — datos pendientes de editar

En `index.html`, dentro de `CONFIG.PLANES['Inhumación']`, los 3 paquetes están
marcados con ⚠️ como **placeholders**. Reemplaza `nombre`, `precio` e
`incluye` de cada uno con los datos reales de tus 3 paquetes de inhumación.
El plan de Cremación ya viene con los datos de tu contrato ($13,500, 25% de
enganche, 18 pagos).

## Paso 1 — Prepara tu Google Sheet

Usa tu archivo `Dashboard_Prevision_Funeraria.xlsx` como base (súbelo a Google
Drive y ábrelo con Google Sheets, o crea una hoja nueva con las mismas
pestañas): `Dashboard General`, `Registro Contratos`, `Control de Pagos`. Los
encabezados de columnas se crean solos la primera vez que guardes un contrato,
pero deben coincidir con el orden que usa `Code.gs` (ya está alineado con tu
archivo actual).

## Paso 2 — Backend (Google Apps Script)

1. Abre tu Google Sheet → **Extensiones → Apps Script**.
2. Borra el contenido de `Code.gs` y pega el contenido del archivo
   `Code.gs` de este paquete.
3. En la función `configurarPinInicial`, cambia `'1234'` por tu PIN real de 4
   dígitos.
4. Ejecuta esa función una sola vez: menú **Ejecutar → configurarPinInicial**
   (te pedirá autorización, es normal — es tu propio script).
5. Publica: **Implementar → Nueva implementación → tipo: Aplicación web**
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
6. Copia la URL que termina en `/exec`.

## Paso 3 — Conecta el front-end

En `index.html`, busca:
```js
APPS_SCRIPT_URL: 'PEGA_AQUI_TU_URL_DE_APPS_SCRIPT',
```
y pega ahí la URL del paso anterior.

## Paso 4 — Publica en GitHub Pages

1. Crea un repositorio nuevo en GitHub (puede ser privado o público).
2. Sube estos archivos a la raíz del repositorio: `index.html`,
   `manifest.json`, `service-worker.js`, `icon-192.png`, `icon-512.png`.
3. Ve a **Settings → Pages**, en "Source" elige la rama `main` y carpeta `/root`.
4. GitHub te da una URL tipo `https://tuusuario.github.io/tu-repo/`.

## Paso 5 — Instalarla como app

Abre esa URL en Chrome (Android) o Safari (iPhone):
- **Android/Chrome:** menú ⋮ → "Instalar app" o "Agregar a pantalla de inicio".
- **iPhone/Safari:** botón compartir → "Agregar a pantalla de inicio".

Como todos los dispositivos apuntan al mismo `APPS_SCRIPT_URL` y a la misma
Google Sheet, los contratos y abonos se sincronizan automáticamente entre
todos los celulares/tablets donde se instale.

## Cómo funciona el envío por WhatsApp

El botón "Enviar por WhatsApp" intenta usar el menú nativo de compartir del
celular (funciona en la mayoría de navegadores Android/iOS actualizados) para
mandar el PDF real ya adjunto. Si el navegador no lo soporta, la app descarga
el PDF y abre WhatsApp con el mensaje ya redactado hacia el número del
contratante — en ese caso debes adjuntar tú el PDF descargado, porque los
enlaces de WhatsApp (`wa.me`) no permiten adjuntar archivos de forma
automática; esa es una limitación de WhatsApp, no de la app.

## Login

Por ahora hay un solo usuario/PIN, guardado en el propio Apps Script
(`configurarPinInicial`). Si más adelante necesitas varios PINs o usuarios,
se puede ampliar guardando una lista de PINs con nombre en vez de uno solo.
