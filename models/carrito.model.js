const mongoose = require('../common/services/mongoose.service').mongoose;
const Schema = mongoose.Schema;

const carritoSchema = new Schema({
    productos : [{
        _id: { type: Schema.Types.ObjectId, ref: 'Productos' },
        nombre: String,
        precio: Number,
        cantidad : Number
    }],
    usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    fechaCompra: { type: Date, default: null },
    estado: { type: Boolean, default: false }
});


carritoSchema.virtual('id').get(function () {
    return this._id.toHexString();
});

// Ensure virtual fields are serialised.
carritoSchema.set('toJSON', {
    virtuals: true
});

carritoSchema.findById = function (cb) {
    return this.model('Carritos').find({id: this.id}, cb);
};

const Carrito = mongoose.model('Carritos', carritoSchema);

exports.findById = (id) => {
    return Carrito.findById(id)
        .then((result) => {
            result = result.toJSON();
            delete result._id;
            delete result.__v;
            return result;
        });
};

exports.find = (data) =>{
    return Carrito.find(data)
    .then(
        result =>{
            return result.length > 0 ? result : false;
        }
    )
    .catch(err =>{
        console.log(err);
        return false;
    });
}

exports.list = (perPage, page) => {
    return new Promise((resolve, reject) => {
        Carrito.find()
            .limit(perPage)
            .skip(perPage * page)
            .exec(function (err, productos) {
                if (err) {
                    reject(err);
                } else {
                    resolve(carrito);
                }
            })
    });
};

exports.putCar = (opcion, productoData) => {
    return Carrito.findOneAndUpdate(
        opcion
    ,productoData,
    {upsert : true}
)};


