const carritoModel = require("../models/carrito.model");

exports.pay = async (req, res) =>{

    const userId = req.session.user;

    res.send("SE REALIZO EL PAGO");

    return await carritoModel.putCar(
        {usuario : userId, estado : false},
        {$set : {estado : true, fechaCompra : new Date()}})

}