const express = require('express')
const path = require('path');
const app = express()

const location = path.resolve(__dirname);
const hostname = '127.0.0.1'
const port = 3000
const htmlpath = "/public/html"

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

app.get("/api/makeShippingRequest", (req, res) => {
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

    var qMap = req.query;

    if (checkExists(qMap, "reqNum", "number") && checkExists(qMap, "vehID", "string") &&
            checkExists(qMap, "ID", "number") && checkExists(qMap, "lat", "number") &&
            checkExists(qMap, "lon", "number") && checkExists(qMap, "IID", "number")) {
        // TODO: Do something here
            res.send("got a valid request");
    } else {
        if(checkExists(qMap, "hello", "string")) {
            res.send("yay!");
        } else {
            res.send("error: did not get all specified values");
        }
    }
});



// helper function that checks if the object contains the key and is of the correct type
function checkExists(object, key, type) {
    return (key in object) && (typeof(object[key]) === type);
}

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log('Example app listening on port ' + port);
});
