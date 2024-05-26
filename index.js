const config = require('./config/env.config.js');
const express = require("express");
const cors = require("cors");
const session = require('express-session');
const Culqi = require('culqi-node');
const app = express();
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: "secret_key", 
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } 
}));

app.get("/", (req, res) => {
  res.send("Hola");
});
// set port, listen for requests

require("./routes/auth.routes")(app);
require("./routes/user.routes")(app);
require("./routes/producto.routes")(app);
require("./routes/carrito.routes")(app);
require("./routes/checkout.routes")(app);



const db = require("./models");
const Role = db.role;

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Expose-Headers', 'Content-Length');
    res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    } else {
        return next();
    }
});

db.mongoose
  .connect("mongodb://localhost:27017/hackatonFinal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Successfully connect to MongoDB.");
    initial();
  })
  .catch((err) => {
    console.error("Connection error", err);
    process.exit();
  });

app.listen(config.port, () => {
  console.log(`Server is running on port ${config.port}.`);
});

function initial() {
  Role.estimatedDocumentCount((err, count) => {
    if (!err && count === 0) {
      new Role({
        name: "user",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'user' to roles collection");
      });

      new Role({
        name: "moderator",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'moderator' to roles collection");
      });

      new Role({
        name: "admin",
      }).save((err) => {
        if (err) {
          console.log("error", err);
        }

        console.log("added 'admin' to roles collection");
      });
    }
  });
};


const carritoModel = require("./models/carrito.model")
const request = require('request');

const culqi = new Culqi({
  privateKey: 'tkn_test_0CjjdWhFpEAZlxlz'
});

app.post("/api/process/pay", async (req, res) =>{
    try {

        const items = await carritoModel.find({ usuario: req.session.user, estado : false });

        if (items.length === 0) {
          return res.status(400).json({ success: false, error: 'El carrito de compras está vacío' });
        }
    
        console.log(items[0].productos);
        let totalAmount = 0;
        items[0].productos.forEach(item => {
          totalAmount += item.precio * item.cantidad;
        });
    
        console.log(totalAmount);


        const options = {
          method: 'POST',
          url: 'https://api.culqi.com/v2/charges',
          headers: {
            Authorization: 'Bearer sk_test_UTCQSGcXW8bCyU59',
            'content-type': 'application/json'
          },
          body: {
            amount: totalAmount,
            currency_code: 'PEN',
            email: 'richard@piedpiper.com',
            source_id: 'tkn_test_701ug3CDNJOAt5Q6, crd_test_TWsfemI22ypplGK6',
            capture: true,
            description: 'Prueba',
            installments: 2,
            metadata: {dni: '70202170'},
            antifraud_details: {
              address: 'Avenida Lima 213',
              address_city: 'Lima',
              country_code: 'PE',
              first_name: 'Richard',
              last_name: 'Hendricks',
              phone_number: '999999987'
            },
            authentication_3DS: {
              xid: 'Y2FyZGluYWxjb21tZXJjZWF1dGg=',
              cavv: 'AAABAWFlmQAAAABjRWWZEEFgFz+=',
              directoryServerTransactionId: '88debec7-a798-46d1-bcfb-db3075fedb82',
              eci: '06',
              protocolVersion: '2.1.0'
            }
          },
          json: true
        };
        
        request(options, function (error, response, body) {
          if (error) throw new Error(error);
          console.log(body);
        });
    
      } catch (error) {
        console.error("Error en el pago:", error.message);
        res.status(500).json({ success: false, error: error.message });
      }
 });

