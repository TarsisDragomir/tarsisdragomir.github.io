/* Service Worker */
importScripts("./js/workbox-sw.js");

workbox.setConfig({ debug: false });

workbox.routing.registerRoute(
    /\.(?:min.js)$/,
    workbox.strategies.cacheFirst({
        cacheName : "cache-first"
    }),
);

workbox.routing.registerRoute(
    /\.(?:js|css|html)$/,
    workbox.strategies.staleWhileRevalidate({
        cacheName : "cache-but-revalidate"
    }),
);

workbox.routing.registerRoute(
    /\.(?:png|gif|jpg|jpeg|svg)$/,
    workbox.strategies.cacheFirst({
        cacheName: "images",
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 60,
                maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
            }),
        ],
    }),
); 