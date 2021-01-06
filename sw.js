const CACHE_NAME = 'test'
const FILES = ['/offline.html']

self.oninstall = function(event) {
    // after the service worker gets installed 
    // before it boots up for the first time 

    // first, when the service worker loads up we want to pull the offline status page 
    // once this is done, the SW is ready to go 
    // This is pre work 
    
    // every time we add a new service worker it's going to take over from the previous one
    self.skipWaiting();

    
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache) {
            return cache.addAll(FILES)            
        })
    )

}


self.onfetch = function(event) {
    // this is where most of the work will happen   
    // all the network requests will flow through this event handler 
    // at this page, the service worker already got all the files it needs

    const request = event.request;
    // we only want to return the offline page for get requests 
    // this is the safe way 
    // if you forget it, it will cause our data to get lost on send accidentally 
    if (request.method === 'GET') {
        event.respondWith(
            fetch(request)
            .catch(function(){
                return caches.open(CACHE_NAME)
                    .then(function(cache) {
                        return cache.match('offline.html')
                    })
            })

        )
    }
}