const axios = require('axios');
// const Productos = require('../api/productos')

const URL = 'http://localhost:8080/api/productos'

let nuevoProducto = {
    title: 'Producto Axios',
    price: 20,
    thumbnail: 'axios.jpg'
}
let productoActualizado = {
    title: 'Producto Axios Actualizado',
    price: 50,
    thumbnail: 'axios.jpg'
}
async function getProductos() {
    try {
        let listaProductos = await axios.get(URL + '/listar');
        console.log(listaProductos.data);
        let agregarProducto = await axios.post(URL + '/guardar', nuevoProducto);
        console.log(agregarProducto.data);
        let actualizarProducto = await axios.put(URL + '/actualizar', {title: nuevoProducto.title, nuevoProducto: productoActualizado});
        console.log(actualizarProducto.data);
        let borrarProducto = await axios.delete(URL + '/borrar', { title: productoActualizado.title})
        console.log(borrarProducto.data)
    } catch (error) {
        console.log(error.response.data)
    }
}
// const res = await axios.post('https://httpbin.org/post', { hello: 'world' }, {
//   headers: {
//     // 'application/json' is the modern content-type for JSON, but some
//     // older servers may use 'text/json'.
//     // See: http://bit.ly/text-json
//     'content-type': 'application/json'
//   }
// });

// res.data.headers['Content-Type']; // text/json

getProductos();




      // let listaProductos = await Productos.listar()
        // console.log(listaProductos);
        // let agregarProducto = await Productos.guardar(nuevoProducto)
        // console.log(agregarProducto);
        // let productoModificado = await Productos.actualizarPorNombre(nuevoProducto.title, productoActualizado)
        // console.log(productoModificado);
        // let productoBorrado = await Productos.borrarPorNombre(productoActualizado.title)
        // console.log(productoBorrado);