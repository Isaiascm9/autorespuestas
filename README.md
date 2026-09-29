# Autorespuestas de Instagram y Facebook

Tu propio sistema tipo ManyChat. Responde **mensajes privados y comentarios** de Instagram y Facebook de todas tus tiendas con **IA (DeepSeek)**.

Funciona en **Cloudflare**, gratis y sin tarjeta. Se instala desde el navegador con **GitHub + Cloudflare**, sin terminal y sin editar archivos. Todo lo demás se hace **dentro del panel**.

---

## 1. Instalar (una sola vez, unos 15 minutos)

### A. Subir los archivos a GitHub
1. Crea una cuenta gratis en **github.com**.
2. Arriba a la derecha pulsa **+** → **New repository**.
   - **Repository name:** `autorespuestas`
   - Marca **Private**.
   - Pulsa **Create repository**.
3. En la página que aparece, haz clic en el enlace **uploading an existing file**.
4. Descomprime el zip. Abre la carpeta `autorespuestas` y **arrastra todo lo que hay dentro**: las carpetas `src` y `public` y los archivos `wrangler.jsonc`, `package.json`, `README.md`, `instalar.mjs` y `.gitignore`.
5. Abajo, pulsa **Commit changes**.
6. Comprueba que en la página principal del repositorio ves `src`, `public`, `wrangler.jsonc` y `package.json` sueltos, y **no** dentro de otra carpeta.

### B. Publicarlo con Cloudflare
1. Crea una cuenta gratis en **dash.cloudflare.com** y entra.
2. En el menú: **Compute (Workers)** → **Workers & Pages** → **Create**.
3. Elige **Import a repository** (o **Continue with GitHub**).
4. Autoriza a Cloudflare en GitHub. Puedes darle acceso solo al repositorio `autorespuestas`.
5. Selecciona `autorespuestas` y revisa la configuración:
   - **Project name / Worker name:** `autorespuestas`. Tiene que ser exactamente este nombre.
   - **Build command:** vacío.
   - **Deploy command:** `npx wrangler deploy`
   - **Root directory:** vacío (o `/`).
6. Pulsa **Create and deploy** (o **Deploy**) y espera 2 o 3 minutos hasta que diga **Success**.
   - Cloudflare crea la base de datos sola.
   - Si te pide elegir un subdominio **workers.dev**, escribe uno (por ejemplo, tu nombre).
7. Copia la dirección de tu panel. Termina en **.workers.dev** (ej. `https://autorespuestas.isabel.workers.dev`). Está en la página del Worker, arriba, o en **Settings → Domains & Routes**.

### C. Proteger la primera entrada (1 minuto)
1. En la página del Worker: **Settings** → **Variables and Secrets** → **Add**.
   - **Type:** Secret
   - **Variable name:** `SETUP_CODE`
   - **Value:** un código que inventes (ej. `ISA-2026-PANEL`).
2. Pulsa **Deploy** (o **Save**).

### D. Entrar
Abre la dirección de tu panel, escribe el código `SETUP_CODE` y **crea tu contraseña**.

Listo. A partir de aquí todo se hace en el panel.

---

## 2. En el panel

### Configuración (una sola vez)
1. **Conexión con Meta:** pega el ID y la clave secreta de tu app de Meta (ver sección 3).
2. **Datos para pegar en Meta:** la URL del webhook, el token de verificación y las direcciones de redireccionamiento. Haz clic en cada uno para copiarlo.
3. **DeepSeek:** pega tu API key (platform.deepseek.com → API keys) → **Guardar y probar**. Te muestra el saldo.
4. **Contraseña del panel:** para cambiarla cuando quieras.

### Tiendas
- **Nueva tienda** → nombre.
- Cada tarjeta tiene los interruptores **Bot AI Redes (IG/FB)** y **Modo Prueba**, además del proveedor y el modelo de IA.
- **Configurar** abre:
  - **Prompt personalizado:** cómo habla el bot.
  - **Base de conocimiento:** precios, horarios, direcciones, envíos, pagos y garantía.
  - **Modelo y API key propia** (opcional).
  - Mensaje al pasar a una persona y respuesta por defecto.
  - **Usuarios permitidos** del modo prueba.

### Redes sociales
- **Cuentas conectadas:** **Conectar con Meta** → Instagram o Facebook (páginas), o **Manual** (ID de cuenta, nombre, access token, fecha de vencimiento y tienda; si el ID ya existe, se actualiza). Luego asigna cada cuenta a su tienda en la columna **Tienda**. Una cuenta sin tienda no responde. El lápiz de cada fila abre la misma ventana para cambiar el token, el nombre, la fecha o la tienda.
- **Posts de catálogo:** escribe junto a cada publicación qué producto es y su precio. Cuando comenten ahí, el bot lo sabe.
- **Prompts:**
  - Prompt de comentarios y prompt de DMs.
  - Interruptor del bot.
  - **Comentarios ofensivos:** Apagado, Solo avisarme u Ocultarlos.
  - Chat para **Probar la IA**.
  - Si escribes datos (precios, direcciones, teléfonos, horarios) en un prompt, te avisa que van en la base de conocimiento.
- **Reglas:** respuestas fijas por palabra clave, que van antes que la IA.
- **Actividad:** todo lo que llegó y lo que respondió el bot, con el ID de la publicación. También la lista de **Contactos**, donde puedes pausar o reanudar el bot con cada persona.

### Resumen
Cifras, gráfico por día, cómo respondió el bot, reglas más usadas, lista **Por atender** y estado de cada tienda.

**Orden en que responde el bot:** reglas → IA (con prompt, base de conocimiento y catálogo) → respuesta por defecto (solo si no hay IA).

---

## 3. Crear la app en Meta (una sola vez)

1. Entra a **developers.facebook.com** → **Mis apps** → **Crear app** (tipo **Negocio**).
2. **Instagram:** agrega el caso de uso **Administrar mensajes y contenido en Instagram**.
   - En **Configuración de la API con inicio de sesión de Instagram** copia el **ID** y la **clave secreta de la app de Instagram**, y pégalos en el panel (Configuración → 1).
   - En esa misma pantalla:
     - **Configurar webhooks:** pega la URL del webhook y el token de verificación del panel, pulsa **Verificar y guardar** y suscríbete a **messages** y **comments**.
     - **Configurar el inicio de sesión de empresa:** pega el **Redireccionamiento de Instagram**.
3. **Facebook:** agrega los productos **Messenger** e **Inicio de sesión con Facebook**.
   - **Configuración → Básica:** copia el **ID de la app** y la **clave secreta** y pégalos en el panel.
   - **Inicio de sesión con Facebook → Configuración:** pega el **Redireccionamiento de Facebook**.
   - **Webhooks** (objeto **Page**): la misma URL y token; suscríbete a **messages** y **feed**.
4. **Configuración → Básica:** pon la URL de tu política de privacidad, un ícono y una categoría.
5. En la app de Instagram de cada cuenta: **Configuración → Mensajes y respuestas a historias → Herramientas conectadas → Permitir acceso a los mensajes**.

### Para que responda a todo el público
En **modo desarrollo** Meta solo envía mensajes de personas con rol en la app. Para que responda a cualquier cliente, cambia la app a **Publicada (Live)**.

Como las cuentas son tuyas, el acceso estándar debería bastar. Si Meta pide verificación del negocio o **Revisión de la app**, se solicita en ese menú.

Mientras pruebas, usa el **Modo Prueba** de la tienda con tu propio usuario.

---

## 4. Actualizar a una versión nueva
1. En GitHub, abre tu repositorio → **Add file** → **Upload files**.
2. Arrastra las carpetas `src` y `public` nuevas (y cualquier archivo que cambie) → **Commit changes**.
3. Cloudflare publica solo en 1 o 2 minutos. Lo ves en tu Worker → **Deployments**.

No se borra nada: tiendas, cuentas, prompts y registros se quedan.

---

## Límites que pone Meta
- **Mensajes privados:** solo se responde dentro de las 24 h siguientes al mensaje del cliente (el bot responde al instante).
- **Comentario → mensaje privado:** 1 por comentario (en Instagram, dentro de 7 días).
- **Tokens:**
  - Los de Instagram duran 60 días y el sistema los renueva solo.
  - Los de páginas de Facebook no vencen.
  - El estado se ve en **Cuentas conectadas**.

## Si algo falla

| Síntoma | Qué hacer |
|---|---|
| Cloudflare dice que el nombre no coincide | El nombre del Worker debe ser exactamente `autorespuestas`, igual que en `wrangler.jsonc`. |
| Cloudflare no encuentra `wrangler.jsonc` | Los archivos quedaron dentro de otra carpeta en GitHub. Súbelos sueltos, en la raíz del repositorio (paso 1-A.6). |
| El despliegue falla por otro motivo | Worker → **Deployments** → abre el último → **View build log** y copia el error. |
| No recuerdo el código de entrada | Worker → Settings → Variables and Secrets → edita `SETUP_CODE` con un código nuevo. Solo sirve mientras no hayas creado la contraseña. |
| «Conectar con Meta» dice que falta configurar | Configuración → 1: pega el ID y la clave secreta de la app. |
| Meta dice «URL de redireccionamiento no válida» | Copia el redireccionamiento exacto del panel (Configuración → 2) en tu app de Meta. |
| No aparece nada en Actividad | Revisa que la cuenta tenga **tienda asignada**, los webhooks (sección 3), el botón **↻** en Cuentas conectadas y el modo Live. |
| Token en «Error» o «Venció» | Vuelve a conectar la cuenta con **Conectar con Meta**. Conserva su tienda. |
| «IA: Insufficient Balance» | Recarga saldo en DeepSeek. En Configuración → 3, **Ver saldo**. |
| Quiero ver los registros técnicos | Worker → **Observability** → **Logs**. |
