const express = require('express')
const path = require('path');
const bodyParser = require('body-parser'); // To read JSON body data
const app = express();
const pg = require('pg');
const customer = require('./customer.js');

const connectionString = 'postgres://postgres:admin@localhost:5432/kalahari';
const location = path.resolve(__dirname);
const hostname = '127.0.0.1';
const port = 3000;
const client = new pg.Client(connectionString);
const htmlpath = "/public/html";

client.connect();
app.use(bodyParser.json()); // for parsing JSON body

//FIX: this is kind of slow to look at, maybe route grouping would be good
app.get('/admin', (req, res) => {
    console.log("received get request at admin");
    res.sendFile(location + htmlpath + "/admin.html");
});

app.get('/customer', (req,res) => {
    console.log("received get request at customer");
    res.sendFile(location + htmlpath + "/customer.html");
});

app.get('/company', (req,res) => {
    console.log("received get request at company");
    res.sendFile(location + htmlpath + "/company.html");
});

app.get('/', (req, res) => {
    console.log("received get request at /");
    res.sendFile(location + htmlpath + "/index.html");
});

app.get("/api/getItems", (req, res) => {
    var filter = req.body.filter
    var rows = []
    if (filter) {
        client.query("SELECT * FROM ITEM WHERE iid = $1", [filter], (err, result) => {
            if (err) {
                res.status(400)
                console.log(err)
                res.send("failed to get items")
            } else {
                res.status(200)
                console.log("filtered:" +result.rows)
                res.send(result.rows)
            }
        })
    } else {
        client.query("SELECT * FROM ITEM", (err, result) => {
            if (err) {
                res.status(400)
                console.log(err)
                res.send("failed to get items")
            } else {
                res.status(200)
                console.log("no filter:" + result.rows)
                res.send(result.rows)
            }
        })
    }
});

app.get("/api/getWarehouses", (req, res) => {
    var rows = []
    client.query("SELECT * FROM WAREHOUSE", (err, result) => {
        if (err) {
            res.status(400)
            console.log(err)
            res.send("failed to get items")
        } else {
            res.status(200)
            console.log("sending warehouses")
            res.send(result.rows)
        }
    })
})

app.get("/api/getShippingMethods", (req, res) => {
    customer.getShippingMethods(req, res, client);
});

app.get("/api/getOrders", (req, res) => {
    customer.getOrders(req, res, client);
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log('Example app listening on port ' + port);
});