// Instalador: npm run instalar
// Hace todo lo de Cloudflare: instala, inicia sesión, crea la base de datos y publica.
// Puedes volver a ejecutarlo cuando quieras (por ejemplo, para actualizar): no borra nada.
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import crypto from "node:crypto";

const say = (s = "") => console.log(s);
const title = (s) => say(`\n\x1b[1m▶ ${s}\x1b[0m`);
const fail = (s) => { say(`\n\x1b[31m✖ ${s}\x1b[0m\n`); process.exit(1); };

function sh(cmd, { quiet = false, input } = {}) {
  return spawnSync(cmd, {
    shell: true, encoding: "utf8", input,
    stdio: quiet || input !== undefined ? ["pipe", "pipe", "pipe"] : "inherit",
  });
}
const out = (r) => `${r.stdout || ""}${r.stderr || ""}`;

say("\n\x1b[1mInstalador de Autorespuestas\x1b[0m");

// 1. Dependencias
if (!fs.existsSync("node_modules/wrangler")) {
  title("Instalando las herramientas (solo la primera vez)…");
  if (sh("npm install").status !== 0) fail("No se pudo ejecutar npm install. Revisa tu conexión e inténtalo de nuevo.");
}

// 2. Sesión en Cloudflare
title("Revisando tu sesión de Cloudflare…");
const who = sh("npx wrangler whoami", { quiet: true });
if (who.status !== 0 || /not authenticated|You are not/i.test(out(who))) {
  say("Se abrirá el navegador: entra con tu cuenta de Cloudflare y pulsa «Allow».");
  if (sh("npx wrangler login").status !== 0) fail("No se pudo iniciar sesión en Cloudflare.");
} else say("Sesión activa.");

// 3. Base de datos: la crea Cloudflare sola al publicar (no hace falta ningún ID)

// 4. Publicar
title("Publicando el panel y el bot…");
say("Si Cloudflare te pregunta por un subdominio «workers.dev», escribe uno (por ejemplo, tu nombre) y pulsa Enter.");
if (sh("npx wrangler deploy").status !== 0) fail("No se pudo publicar. Lee el mensaje de arriba.");

// 5. Código de instalación (para crear tu contraseña en el panel)
let code = null;
const secrets = sh("npx wrangler secret list", { quiet: true });
if (!/SETUP_CODE/.test(out(secrets))) {
  code = crypto.randomBytes(4).toString("hex").toUpperCase().replace(/(.{4})/, "$1-");
  const r = sh("npx wrangler secret put SETUP_CODE", { input: code + "\n" });
  if (r.status !== 0) { code = null; say("Aviso: no se pudo guardar el código de instalación. Podrás crear la contraseña igual."); }
}

say("\n\x1b[32m\x1b[1m✔ Listo.\x1b[0m");
say("Abre la dirección que aparece arriba y que termina en \x1b[1m.workers.dev\x1b[0m: ese es tu panel.");
if (code) {
  say(`La primera vez te pedirá este \x1b[1mcódigo de instalación\x1b[0m para crear tu contraseña:  \x1b[1m${code}\x1b[0m`);
  say("Guárdalo hasta que entres. Después ya no hace falta.");
} else {
  say("Entra con tu contraseña de siempre.");
}
say("Todo lo demás (Meta, DeepSeek, tiendas) se configura dentro del panel.\n");
