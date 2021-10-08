require('dotenv').config()
const express = require('express');
const productos = require('../api/productos')
const Faker = require('../models/faker');
const log4js = require("log4js");
var { graphqlHTTP } = require('express-graphql');
const schema = require('../models/productosGraphQL').schema
// const SingletonFactory = require('../persistencia/factory');
// let singletonFactory = SingletonFactory.getInstancia();
// let instanciaFactory = singletonFactory.getPersistencia('mysql') 
let DAOFactory = require('../models/DAO/DAOFactory')
let instanciaFactory = DAOFactory.getPersistencia('File') // File o Mongo


// const loggerConsola = log4js.getLogger('consola');
// const loggerWarn = log4js.getLogger('warn');
const loggerError = log4js.getLogger('error');

const routerProductos = express.Router()

// VISTA-TEST ** FAKER **
routerProductos.get('/vista-test/', (req, res) => {
    res.render('vista', { hayProductos: true, productos: Faker.generarProductos(10) })
})

routerProductos.get('/vista-test/:cant', (req, res) => {
    let cantidad = req.params.cant
    res.render('vista', { hayProductos: true, productos: Faker.generarProductos(cantidad) })
})

// LISTAR PRODUCTOS
routerProductos.get('/listar', async (req, res) => {
    try {
        let result = await instanciaFactory.listar()
        // let result = await productos.listar();
        return res.json(result);
    } catch (error) {
        loggerError.error(error)
        return res.status(500).send({ error: error.message });
    }
})

// LISTAR PRODUCTOS POR ID
routerProductos.get('/listar/:id', async (req, res) => {

    try {
        let mensajeLista = instanciaFactory.listarPorId(req.params.id)
        // let mensajeLista = await productos.listarPorId(req.params.id);
        res.json(mensajeLista)
    } catch (error) {
        loggerError.error(error)
        return res.status(500).send({ error: error.message });
    }
})

// GUARDAR PRODUCTO
routerProductos.post('/guardar', async (req, res) => {
    try {
        let nuevoProducto = {};
        nuevoProducto.title = req.body.title;
        nuevoProducto.price = req.body.price;
        nuevoProducto.thumbnail = req.body.thumbnail;
        await instanciaFactory.guardar(nuevoProducto)
        // await productos.guardar(nuevoProducto)
        res.json(nuevoProducto)
    } catch (error) {
        loggerError.error(error)
        return res.status(500).send({ error: error.message });
    }
})

//ACTUALIZAR PRODUCTO POR ID
routerProductos.put('/actualizar/:id', async (req, res) => {
    try {
        let nuevoProducto = await instanciaFactory.actualizar(req.params.id, req.body);
        // let nuevoProducto = await productos.actualizar(req.params.id, req.body);
        res.json(nuevoProducto);
    } catch (error) {
        loggerError.error(error)
        return res.status(500).send({ error: error.message });
    }
})

routerProductos.put('/actualizar', async (req, res) => {
    try {
        let productoActualizado = await instanciaFactory.actualizarPorNombre(req.body.title, req.body.nuevoProducto);
        // let productoActualizado = await productos.actualizarPorNombre(req.body.title, req.body.nuevoProducto);
        res.json(productoActualizado);
    } catch (error) {
        loggerError.error(error)
        return res.status(500).send({ error: error.message });
    }
})

// BORRAR PRODUCTO POR ID
routerProductos.delete('/borrar/:id', async (req, res) => {
    try {
        let productoBorrado = await instanciaFactory.borrar(req.params.id);
        // let productoBorrado = await productos.borrar(req.params.id);
        res.json(productoBorrado);
    } catch (error) {
        loggerError.error(error)
        return res.status(500).send({ error: error.message });
    }
})

routerProductos.delete('/borrar', async (req, res) => {
    try {
        let productoBorrado = await instanciaFactory.borrarPorNombre(req.body.title);
        // let productoBorrado = await productos.borrarPorNombre(req.body.title);
        res.json(productoBorrado);
    } catch (error) {
        loggerError.error(error)
        return res.status(500).send({ error: error.message });
    }
})


// FUNCIONES GRAPHQL
const buscar = async function () {
    // return await instanciaFactory.listar();
    return await productos.listar();
}
const guardar = async function (nuevoProducto) {
    return await productos.guardar(nuevoProducto);
    // return await instanciaFactory.guardar(nuevoProducto);
}
const actualizar = async function (nuevoProducto) {
    // console.log(JSON.stringify(nuevoProducto));    
    // return await instanciaFactory.actualizar(nuevoProducto._id, nuevoProducto);
    return await productos.actualizar(nuevoProducto._id, nuevoProducto);
}
const borrar = async function (id) {
    return await productos.borrar(id)
    // return await instanciaFactory.borrar(id);
}
var root = {
    buscar: buscar,
    guardarProducto: guardar,
    actualizarProducto: actualizar,
    borrarProducto: borrar
};

routerProductos.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true
}))


module.exports = routerProductos;