const ProductoModel = require('../models/producto.model');
const crypto = require('crypto');

exports.createProducto = (req, res) => {
    ProductoModel.createProducto(req.body)
        .then((result) => {
            res.status(201).send({ id: result._id });
        })
        .catch((err) => {
            res.status(500).send({ message: err.message});
        });
};

exports.list = (req, res) => {
    let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
    let page = 0;
    if (req.query) {
        if (req.query.page) {
            req.query.page = parseInt(req.query.page);
            page = Number.isInteger(req.query.page) ? req.query.page : 0;
        }
    }
    ProductoModel.list(limit, page)
        .then((result) => {
            res.status(200).send(result);
        })
};

exports.getById = (req, res) => {
    ProductoModel.findById(req.params.productoId)
        .then((result) => {
            res.status(200).send(result);
        });
};

exports.updateProducto = (req, res) => {
    ProductoModel.patchProducto(req.body.productoId, req.body)
        .then((producto) => {
            if (!producto) {
                return res.status(404).send({ message: "Producto not found with id " + req.body.productoId });
            }
            res.status(200).send(producto);
        })
        .catch((err) => {
            if (err.kind === 'ObjectId') {
                return res.status(404).send({ message: "Producto not found with id " + req.body.productoId });
            }
            return res.status(500).send({ message: "Error " + req.body.productoId });
        });
};

exports.removeById = (req, res) => {
    ProductoModel.removeById(req.body.productoId)
        .then((result)=>{
            res.status(204).send({result});
        })
        .catch(err => {
            return res.send("PRODUCTO NO ENCONTRADO");
        })
};

exports.categoryProducto = (req , res) =>{

    const categoria = req.body.categoria;

    ProductoModel.findByCategory(categoria)
    .then((data) =>{
        res.send(data);
    })
    .catch(err =>{
        return res.send(err.message);
    })

}

exports.searchProducto = (req , res) =>{

    const filtro = req.body.filtro;

    ProductoModel.search(filtro)
    .then((data) =>{
        res.send(data);
    })
    .catch(err =>{
        return res.send(err.message);
    })

}

exports.mayor = (req, res) =>{

    const precio = req.body.precio;

    ProductoModel.find({precio : {$gte : precio } })
    .then(data =>{
        res.send(data);
    })
    .catch(err =>{
        return res.send(err.message);
    })
}

exports.menor = (req, res) =>{

    const precio = req.body.precio;

    ProductoModel.find({precio : {$lte : precio } })
    .then(data =>{
        res.send(data);
    })
    .catch(err =>{
        return res.send(err.message);
    })
}