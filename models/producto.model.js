const mongoose = require('../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const productoSchema = new Schema({
    nombre : String,
    descripcion : String,
    categoria : String,
    precio : Number
});


productoSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
productoSchema.set('toJSON', {
    virtuals: true
});

productoSchema.findById = function (cb) {
    return this.model('Productos').find({id: this.id}, cb);
};

const Producto = mongoose.model('Productos', productoSchema);


exports.findByName = (nombre) => {
    return Producto.find({nombre: nombre})
    .then(data =>{;
        return data.length > 0 ? data : false;
    })
    .catch(err =>{
        console.log(err);
        return false;
    });
};

exports.findByCategory = (categoria) => {
    const regex = new RegExp(categoria, 'i'); 
    return Producto.find({categoria : regex})
    .then(data =>{
        return data.length > 0 ? data : false;
    })
    .catch(err =>{
        console.log(err);
        return false;
    });
}

exports.search = (filtro) =>{
    const regex = new RegExp(filtro, 'i'); 
    return Producto.find({ nombre: regex })
    .then(
        data =>{
            return data.length > 0 ? data : false;
        }
    )
    .catch(err =>{
        console.log(err);
        return false;
    });
}

exports.findById = (id) => {
    return Producto.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.createProducto = (productoData) => {
    const producto = new Producto(productoData);
    return producto.save();
};

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Producto.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, productos) {
                if (err) {
                    reject(err);
                } else {
                    resolve(productos);
                }
            })
    });
};

exports.patchProducto = (id, productoData) => {
    return Producto.findOneAndUpdate({
        _id: id
    }, productoData);
};

exports.removeById = (productoId) => {
    return new Promise((resolve, reject) => {
        Producto.deleteMany({_id: productoId}, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
};

exports.find = (data) =>{
    return Producto.find(data)
    .then(
        data =>{
            return data.length > 0 ? data : false;
        }
    )
    .catch(err =>{
        console.log(err);
        return false;
    });;
}