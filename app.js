const express = require('express')
const path = require('path');
const app = express();
const pg = require('pg');
const connectionString = 'postgres://postgres:admin@localhost:5432/kalahari';

const location = path.resolve(__dirname);
const hostname = '127.0.0.1'
const port = 3000
const client = new pg.Client(connectionString);
const htmlpath = "/public/html"
client.connect();

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
    // THIS IS A TEST ITEM FOR NOW (should define the schema elsewhere and import that to prevent
    // repeating info)
    client.query("SELECT * FROM WAREHOUSE").then(function(results) {
        res.send(results.rows)
    }).catch(function(error) {
        console.log("failed to get items: " + error)
    });
});

app.put("/api/addItem", (req, res) => {
    var weight = req.query.weight
    var quantity = req.query.quantity
    var volume = req.query.volume
    var lat = req.query.lat
    var lon = req.query.lon
    var req_num = req.query.req_num
    var uid = req.query.ID

    // THIS IS A TEST ITEM FOR NOW (should define the schema elsewhere and import that to prevent
    // repeating info)
    client.query("INSERT INTO ITEM VALUES($1, $2, $3, $4,$5,$6,$7)", [weight, quantity, volume, lat, lon, req_num, uid]).then(function(results) {
        res.status(200)
        res.send()
    }).catch(function(error) {
        res.status(400)
        res.send('error while fetching the items :(')
    });
});


app.get("/api/login", (req,res) => {

})

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log('Example app listening on port ' + port);
});
