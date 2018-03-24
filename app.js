const express = require('express')
const path = require('path');
const bodyParser = require('body-parser'); // To read JSON body data
const app = express()

const location = path.resolve(__dirname);
const hostname = '127.0.0.1'
const port = 3000
const htmlpath = "/public/html"

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
    res.json({"iid":1234, "name": "itemName"});
});

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
