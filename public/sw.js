// Service worker: muestra las notificaciones que envía el bot y abre el panel al tocarlas.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(self.clients.claim()));

self.addEventListener("push", (event) => {
  let data = {};
  try { data = event.data ? event.data.json() : {}; } catch { data = { body: event.data && event.data.text() }; }
  event.waitUntil(Promise.all([
    // Número rojo en el ícono de la app (iPhone/Android con la app instalada)
    data.badge && self.navigator.setAppBadge ? self.navigator.setAppBadge(data.badge).catch(() => {}) : null,
    // Avisa al panel abierto para que actualice la campanita
    self.clients.matchAll({ type: "window" }).then((cs) => cs.forEach((c) => c.postMessage({ type: "pending" }))),
    self.registration.showNotification(data.title || "Autorespuestas", {
    body: data.body || "Tienes un cliente por atender",
    icon: "/icon-192.png",
    badge: "/icon-192.png",
    tag: data.tag || undefined,
    renotify: !!data.tag,
    data: { url: data.url || "/#resumen" },
  }),
  ]));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = (event.notification.data && event.notification.data.url) || "/#resumen";
  event.waitUntil((async () => {
    const all = await self.clients.matchAll({ type: "window", includeUncontrolled: true });
    for (const c of all) {
      if ("focus" in c) { try { await c.navigate(url); } catch {} return c.focus(); }
    }
    return self.clients.openWindow(url);
  })());
});
