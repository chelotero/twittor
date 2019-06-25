// imports de las funciones
importScripts('js/sw-utils.js');

const STATIC_CACHE      = 'static-v2';
const DYNAMIC_CACHE     = 'dynamic-v1';
const INMUTABLE_CACHE   = 'inmutable-v1';    

 //esto mi app shell que significa lo mas importante es decir lo que deberia estar crgado al instante
const APP_SHELL  = [ 
    
   // para produccion  se debe comentar la linea de la raiz porque no me servira por el momento 
    //  '/',
    '/index.html', 
    '/css/style.css', 
    '/img/favicon.ico', 
    '/img/avatars/spiderman.jpg', 
    '/img/avatars/hulk.jpg', 
    '/img/avatars/ironman.jpg', 
    '/img/avatars/thor.jpg', 
    '/img/avatars/wolverine.jpg',
    '/js/app.js', 
    'js/sw-utils.js'
];

// todo lo que no va a sufrir ninguna  modificacion debe ir agrupado en el app shell inmutable
const APP_SHELL_INMUTABLE   = [ 
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://use.fontawesome.com/releases/v5.3.1/css/all.css', 
    'css/animate.css', 
    'js/libs/jquery.js'
];

self.addEventListener('install', e => {

    const cacheStatic = caches.open( STATIC_CACHE ).then (cache => 
        cache.addAll(  APP_SHELL )); 
    // abrimos para la escritura al cache estatico
    // cache.addAll nos pide un arreglo que va a ser el que declaramos anteriormente 
    //como APP_SHELL
    const cacheInmutable = caches.open( INMUTABLE_CACHE ).then (cache => 
        cache.addAll(  APP_SHELL_INMUTABLE )); 
    // hacemos lo mismo con el imutable 
    //hasta aca ya tenemos 2 promesas  debemos esperar a que terminen ambas
    // debemos entonces indicarlas en el wait until

    e.waitUntil( Promise.all([cacheStatic, cacheInmutable]));

    //con esto terminamos el proceso de instalacion
    
});

//necesitamos  ahora un proceso para que  cada vez que cambie el SW me borre los caches
//anteriores

self.addEventListener('activate', e => {
     
    const respuesta = caches.keys().then( keys => {

        keys.forEach( key => {

            // static-v4
            if (  key !== STATIC_CACHE && key.includes('static') ) {
                return caches.delete(key);
            }

        });

    });

    e.waitUntil( respuesta );

});


self.addEventListener( 'fetch', e => {

   const respuesta = caches.match( e.request ).then(res =>  {

        if(res) {
            return res
        }else {
             
            return  fetch ( e.request ).then( newRes =>  {


                return actualizaCacheDinamico( DYNAMIC_CACHE, e.request, newRes);

            });
            //console.log( e.request.url ); // hago un console log de la erspuesta si es que no existe
        }

        
    }); 
    e.respondWith( respuesta );

});