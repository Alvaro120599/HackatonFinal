const controller = require("../controllers/producto.controller");

module.exports = function (app) {
    app.use(function (req, res, next) {
        res.header(
            "Access-Control-Allow-Headers",
            "Origin, Content-Type, Accept"
        );
        next();
    });

    app.post("/api/producto",controller.createProducto);
    app.get("/api/producto", controller.list);
    app.put("/api/producto", controller.updateProducto);
    app.delete("/api/producto", controller.removeById);

 
    app.get("/api/producto/category", controller.categoryProducto);
    app.get("/api/producto/search", controller.searchProducto);
    app.get("/api/producto/mayor", controller.mayor);
    app.get("/api/producto/menor", controller.menor);

}