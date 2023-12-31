import express from 'express';
const app = express();
app.use(express.json()); //interpreta el body cuando viene un JSON.


//URI /products -- urlencode //aca identificamos el recurso que en este caso son los productos(products).

// /realstates <-- array
// /realstates/1234 <-- object
// /realstates/1234/images

// clients/55/realstates <-- array // del cliente 55 quiero traerme los realstates

// /realstates/user/1234 <-- objeto //aunque no tiene mucho sentido usarlo

//Quiero que me devuelva todos los productos:

const products = [
    {
        id: 1,
        name: "Café Espresso",
        description: "Un café concentrado y fuerte que se prepara forzando agua caliente a través de granos de café molidos finamente."
    },
    {
        id: 2,
        name: "Café Latte",
        description: "Un café suave hecho con una mezcla de café espresso y leche caliente, a menudo servido con un poco de espuma de leche en la parte superior."
    },
    {
        id: 3,
        name: "Café Americano",
        description: "Un café más suave que se hace agregando agua caliente al espresso, diluyendo así la concentración."
    }

]

// En todos los verbos(GET,POST,PTCH,PUT,DELETE) tienen que seguir una estructura similar, donde le indiquemos:
/*
- el recurso que queremos (en este caso es el '/products')
- el verbo (en este caso el get)
- el estado (en este caso el 200)
- lo que le vamos a enviar (siempre en formato json) (en este caso el array products)
*/ 

//consulta a la API de un array
app.get('/products', function(req,res){

    //para filtrar los productos que estan eliminados al llamar con get hacemos lo siguiente:

    const productsFilter = []

    for(let i = 0; i < products.length; i++){
        if(products[i].deleted != true){
            productsFilter.push(products[i])
        }
    }
    //quiero devolver el 200 (todo ok)
    res.status(200).json(productsFilter); //le digo que me envia en formato json el array 'products'
})

//consulta a la api de un objeto en particular
//Le tengo que pasar una variable para que sea dinamico, para eso uso el ":"
// query -> ? --filtrar
//params -> URI -- id recurso
//body -> cuerpo del mensaje -- recurso

app.get('/products/:idProduct', function(req,res){
    //obtengo el valor a traves de los params, puede ser de las dos siguientes formas:
    //const idProduct = req.params.idProduct;
    const {idProduct} = req.params;
    
    //ya tengo el id del producto, ahora tengo que buscarlo:
    let product = null;

    for (let i = 0; i<products.length; i++){
        if(products[i].id == idProduct){
            product = products[i];
        }
    }
    //si existe lo devuelvo, sino devuelvo un estado 404 con un mensaje
    if(product){
        res.status(200).json(product);
    }else{
        res.status(404).json({msg: `No se encuentra el producto #${idProduct}`});
    }
})

//POST

app.post('/products', function(req,res){

    const product = {
        id: products.length + 1,
        name: req.body.name,
        description: req.body.description,
    }

    products.push(product);
    // status 201 es el creado
    res.status(201).json(product);

})

//PUT (reemplaza)

app.put('/products/:idProduct', function(req,res){
    
    //obtengo el id del producto
    const {idProduct} = req.params;
    //preparo el objeto
    const product = {
        name: req.body.name,
        description: req.body.description
    }
    //busco el objeto
    let indexProduct = -1;

    for(let i = 0; i < products.length; i++){
        if(products[i].id == idProduct){
            indexProduct = i;
        }
    }
    
    if(indexProduct != -1) {
        //reemplazo el objeto
        products[indexProduct] = {
            ...product, //spread operator: se usa cuando no sabes cuantos parametros va a tener, entonces le decis aca va haber parametros(sin especificar cuantos)
            id: products[indexProduct].id

        }

        res.status(200).json(products[indexProduct]);
    }else{
        res.status(404).json({msg: `El producto #${idProduct} no existe`});
    }
})

//patch (actualiza)

app.patch('/products/:idProduct', function(req,res){
    
    //obtengo el id del producto
    const {idProduct} = req.params;

    //preparo el objeto
    const product = {};

    if(req.body.name){
        product.name = req.body.name;
    }

    if(req.body.description){
        product.description = req.body.description;
    }
    //busco el objeto
    let indexProduct = -1;

    for(let i = 0; i < products.length; i++){
        if(products[i].id == idProduct){
            indexProduct = i;
        }
    }
    
    if(indexProduct != -1) {
        //reemplazo el objeto
        products[indexProduct] = {
            ...products[indexProduct], //va aescribir todo lo que tiene el producto(nombre y descripcion)
            ...product, //reemplaza el nombre o descripcion en caso de que haya para reemplazar 
            id: products[indexProduct].id //forzar el id que tiene originalmente para que no se reemplace

        }

        res.status(200).json(products[indexProduct]);
    }else{
        res.status(404).json({msg: `El producto #${idProduct} no existe`});
    }
})


//DELETE... (eliminar)
// eliminacion logica (la mas normal de usar)
// eliminacion fisica (definitiva)

app.delete('/products/:idProduct', function(req,res){
    
    //obtengo el id del producto
    const {idProduct} = req.params;

    //busco el objeto
    let indexProduct = -1;

    for(let i = 0; i < products.length; i++){
        if(products[i].id == idProduct){
            indexProduct = i;
        }
    }
    
    if(indexProduct != -1) {
        // creamos una propiedad llamada deleted para indicar que el objeto esta eliminado 
        products[indexProduct].deleted = true; 

        res.status(200).json(products[indexProduct]);
    }else{
        res.status(404).json({msg: `El producto #${idProduct} no existe`});
    }
})


app.listen(2023, function() {
    console.log("El servidor esta levantado! http://localhost:2023");
});
