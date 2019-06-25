// me permite trasladar logica y funciones que van ser  usadas en el sw



//la proxima funcion se encargar de guardar el cache dinamico
function actualizaCacheDinamico(dynamicaCache, req, res){

      if (res.ok){  
      // si paso este  if significa que tengo informacion que tengo que guardar en el cache
      // por lo tanto debo almacenarlo en el cache dinamico
            return caches.open( dynamicaCache ).then( cache =>  { // se retona esta primera promesa

                  cache.put( req , res.clone() ); // me interesa hacer una copia dela respuesta 
                  return res.clone(); // se retona la promesa contenida 

            });
            
      }else {
            return res;  // me va a retornar un error de conexion o cualquier cosa que no se puedo registrar

      }
       
}