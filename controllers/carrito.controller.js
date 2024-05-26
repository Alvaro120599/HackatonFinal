
const carritoModel = require("../models/carrito.model");
const productoModel = require("../models/producto.model");

exports.addProduct = (req, res) => {

    const producto = req.body.producto;
    const userId = req.session.user;
    const cantidad = req.body.cantidad;

    productoModel.findByName(producto)
        .then(productoEncontrado => {
            if (!productoEncontrado) {
                res.send("El producto no fue encontrado.");
                return;
            }

            const productoData = {
                _id: productoEncontrado[0]._id,
                nombre: productoEncontrado[0].nombre,
                precio: productoEncontrado[0].precio,
                cantidad : cantidad
            };
            res.send("PRODUCTO AGREGADO AL CARRITO");
            return carritoModel.putCar(
                { usuario: userId, estado : false },
                { $addToSet: { productos: productoData } }
            )

        })  
        .then(resultado => {
            if (!resultado) {
                return;
            }
            console.log("Producto agregado exitosamente.");
        })
        .catch(err => {
            console.error("Error:", err);
        });
        
};

exports.update = (req, res) =>{

        const producto = req.body.producto;
        const userId = req.session.user;
        const cantidad = req.body.cantidad;
    
        productoModel.findByName(producto)
            .then(productoEncontrado => {
                if (!productoEncontrado) {
                    res.send("El producto no fue encontrado.");
                    return;
                }
    
                const productoData = {
                    _id: productoEncontrado[0]._id,
                    nombre: productoEncontrado[0].nombre,
                    precio: productoEncontrado[0].precio,
                    cantidad : cantidad
                };
              
                carritoModel.find({usuario: userId, "productos._id": productoData._id })
                    .then(carrito => {
                        if (carrito) {
                            return carritoModel.putCar(
                                { usuario: userId, "productos._id": productoData._id, estado : false},
                                { $inc: { "productos.$.cantidad": cantidad } }
                            );
                        } else {
                            return carritoModel.putCar(
                                { usuario: userId, estado : false },
                                { $addToSet: { productos: productoData } }
                            );
                        }
                    })
                    .then(resultado => {
                        console.log("Producto agregado exitosamente.");
                        res.send(productoEncontrado);
                    })
                    .catch(err => {
                        console.error("Error:", err);
                        res.status(500).json({ success: false, error: err.message });
                    });
    
            })  
            .then(resultado => {
                if (!resultado) {
                    return;
                }
                console.log("Producto agregado exitosamente.");
            })
            .catch(err => {
                console.error("Error:", err);
            });
            
}
    


exports.cart = (req, res) =>{

    carritoModel.find({usuario : req.session.user, estado : false})
    .then(data =>{
        res.send(data);
    })
    .catch(err =>{
        res.send(err.message);
    })
}

exports.deleteProduct = (req, res) =>{

    const producto = req.body.producto;
    const userId = req.session.user;

    productoModel.findByName(producto)
        .then(productoEncontrado => {
            if (!productoEncontrado) {
                res.send("El producto no fue encontrado.");
                return;
            }

            carritoModel.find({ usuario: userId , "productos._id": productoEncontrado[0]._id, estado : false })
                .then(carrito => {
                    if (carrito) {
                        res.send("PRODUCTO SE ELIMINO DEL CARRITO");
                        return carritoModel.putCar(
                            { usuario: userId, estado: false },
                            { $pull: { productos: { _id: productoEncontrado[0]._id } } },
                            { new: true }
                        );

                    } else {
                        res.send("PRODUCTO NO ENCONTRADO EN EL CARRITO");
                    }
                })
                .catch(err => {
                    console.error("Error:", err);
                    res.status(500).json({ success: false, error: err.message });
                });

        })  
        .then(resultado => {
            if (!resultado) {
                return;
            }
            console.log("Producto Eliminado exitosamente.");
        })
        .catch(err => {
            console.error("Error:", err);
        });

}

exports.clear = (req, res) => {
    const userId = req.session.user;

    carritoModel.putCar(
        { usuario: userId, estado: false },
        { $set: { productos: [] } },
        { new: true }
    )
    .then(carritoActualizado => {
            if (!carritoActualizado) {
                res.send("No se encontró ningún carrito para vaciar.");
                return;
            }
            console.log("Carrito vaciado exitosamente.");
            res.send(carritoActualizado);
        })
        .catch(err => {
            console.error("Error:", err);
            res.status(500).json({ success: false, error: err.message });
        });
};

exports.historial = (req, res) =>{

    const userId = req.session.user;

    carritoModel.find({usuario : userId, estado : true})
    .then(data =>{
        res.send(data);
    })
    .catch(err=>{
        res.send(err.message);
    })
}