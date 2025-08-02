// sw.js
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', () => self.clients.claim());

let ultimoID = null;

async function verificarNuevosNiveles() {
  const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQKII4HN64OYtI6VQoWHBsgYJMOOB3A6_rLMcxb6QZJDvHeGQWRY-xbCveF1GNvh6JBUOv2F2-Ia-oP/pub?gid=0&single=true&output=csv';

  try {
    const res = await fetch(url);
    const texto = await res.text();
    const filas = texto.trim().split('\n').map(f => f.split(','));

    if (filas.length < 2) return;

    const idIndex = filas[0].map(x => x.toLowerCase()).indexOf('id');
    const nuevoID = filas[filas.length - 1][idIndex];

    if (ultimoID && nuevoID !== ultimoID) {
      self.registration.showNotification('Nuevo nivel subido', {
        body: 'Un nuevo nivel ha sido agregado',
        icon: 'https://cdn-icons-png.flaticon.com/512/748/748137.png'
      });
    }

    ultimoID = nuevoID;
  } catch (e) {
    console.error('Error verificando niveles:', e);
  }
}

setInterval(verificarNuevosNiveles, 60000); // cada 60 segundos

self.addEventListener('notificationclick', event => {
  event.notification.close();
  event.waitUntil(clients.openWindow('https://pcddlxddd.github.io/niveles-gd/'));
});
