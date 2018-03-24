const express = require('express')
const path = require('path');
const bodyParser = require('body-parser'); // To read JSON body data
const app = express()
const pg = require('pg')

const location = path.resolve(__dirname);
const hostname = '127.0.0.1'
const port = 3000
const client = new pg.Client(connectionString);
const htmlpath = "/public/html"
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
    // THIS IS A TEST ITEM FOR NOW (should define the schema elsewhere and import that to prevent
    // repeating info)
    client.query("SELECT * FROM WAREHOUSE").then(function(results) {
        res.send(results.rows)
    }).catch(function(error) {
        console.log("failed to get items: " + error)
    });
});

app.put("/api/addItem", (req, res) => {
    var weight = req.body.weight
    var quantity = req.body.quantity
    var volume = req.body.volume
    var lat = req.body.lat
    var lon = req.body.lon
    var req_num = req.body.req_num
    var uid = req.body.ID

    // THIS IS A TEST ITEM FOR NOW (should define the schema elsewhere and import that to prevent
    // repeating info)
    client.query("INSERT INTO ITEM VALUES($1, $2, $3, $4,$5,$6,$7)", [weight, quantity, volume, lat, lon, req_num, uid]).then(function(results) {
        res.status(200)
        res.send('got items')
    }).catch(function(error) {
        res.status(400)
        res.send('error while fetching the items :(')
    });
});


app.get("/api/userlogin", (req,res) => {

})

app.post("/api/makeShippingRequest", (req, res) => {
    // TODO: Complete this    
    // Adds a shipping request based on the parameters given in the request
    // - 
    // CREATE TABLE SHIPPING_REQUEST (
    // req_num     INTEGER NOT NULL,
    // origin      VARCHAR(30),
    // dest        VARCHAR(30),
    // total_val   DOUBLE PRECISION,
    // veh_ID      VARCHAR(30) NOT NULL,
    // ID          INTEGER NOT NULL,
    // lat         DOUBLE PRECISION NOT NULL,
    // lon         DOUBLE PRECISION NOT NULL,
    // I_ID        INTEGER DEFAULT 0 NOT NULL,
    // -
    // This works for get requests, but we should use PUTs to add records
    body = req.body;
    if (checkExists(body, "reqNum", "number") && checkExists(body, "vehID", "string") &&
        checkExists(body, "ID", "number") && checkExists(body, "lat", "number") &&
        checkExists(body, "lon", "number") && checkExists(body, "IID", "number")) {
            // 
            res.send("we did it!");
            return;
        }
    res.send(req.body);
});

app.get("/api/getOrders", (req, res) =>{
    // Gets the order based on the customer ID
});

// helper function that checks if the object contains the key and is of the correct type
function checkExists(object, key, type) {
    return (key in object) && (typeof(object[key]) === type);
}

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log('Example app listening on port ' + port);
});
