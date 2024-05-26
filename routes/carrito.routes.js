const controller = require("../controllers/carrito.controller");
const { authJwt } = require("../middlewares");
module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    
    app.get("/api/cart", [authJwt.verifyToken], controller.cart);
    app.post("/api/cart/add", [authJwt.verifyToken], controller.addProduct);
    app.delete("/api/cart/delete",[authJwt.verifyToken], controller.deleteProduct);
    app.delete("/api/cart/clear",[authJwt.verifyToken], controller.clear);
    app.get("/api/cart/historial", [authJwt.verifyToken], controller.historial);

}