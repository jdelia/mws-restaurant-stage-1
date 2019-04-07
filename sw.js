const staticCacheName = "rrapp-static-v999";

self.addEventListener("install", function(event) {
  // TODO: cache /skeleton rather than the root page

  event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        "/",
        "/index.html",
        "/restaurant.html",
        "js/dbhelper.js",
        "js/main.js",
        "js/restaurant_info.js",
        "css/styles.css",
        "data/restaurants.json",
        "img/1.jpg",
        "img/2.jpg",
        "img/3.jpg",
        "img/4.jpg",
        "img/5.jpg",
        "img/6.jpg",
        "img/7.jpg",
        "img/8.jpg",
        "img/9.jpg",
        "img/10.jpg"
      ]);
    })
  );
});

self.addEventListener("activate", function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames
          .filter(function(cacheName) {
            return (
              cacheName.startsWith("rrapp-") && cacheName != staticCacheName
            );
          })
          .map(function(cacheName) {
            return caches.delete(cacheName);
          })
      );
    })
  );
});

self.addEventListener("fetch", function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      if (response) {
        console.log("Found", event.request, " in cache");
        return response;
      } else {
        console.log("Could not find", event.request, " in cache");
        return fetch(event.request)
          .then(function(response) {
            if (
              !response ||
              response.status !== 200 ||
              response.type !== "basic"
            ) {
              return response;
            }

            const clonedResponse = response.clone();
            caches.open(staticCacheName).then(function(cache) {
              cache.put(event.request, clonedResponse);
            });
            return response;
          })
          .catch(function(err) {
            console.log("This is the error:", err);
          });
      }
    })
  );
});
