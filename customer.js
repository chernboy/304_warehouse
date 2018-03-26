const pg = require('pg');
const connectionString = 'postgres://postgres:admin@localhost:5432/kalahari';
const client = new pg.Client(connectionString);
client.connect();


// Customers:
//  SELECT * FROM SHIPPING_REQUEST(...) ...
//  decide which shipping methods to deliver the items
//  SELECT * FROM SHIPPING_METHOD(...)
//  ORDER BY(...)

// Creates a shipping request using
// body parameters
// "reqNum"    -  "number" 
// "vehID"     -  "string" 
// "ID"        -  "number" 
// "lat"       -  "number" 
// "lon"       -  "number" 
// "IID"       -  "number" 
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
        // retrieve information 
        var reqNum = body["reqNum"];
        var vehID  = body["vehID"];
        var ID     = body["ID"];
        var lat    = body["lat"];
        var lon    = body["lon"];
        var IID    = body["IID"];

        // Verify there exists the foreign elements in the other tables first
        // TODO: Verify vehID exists in SHIPPING_METHOD table
        // TODO: ID exists in USER table
        // TODO: lat,lon exists in WAREHOUSE table
        // TODO: IID exists in ITEM table

        // TODO: Add shipping request to table
        return;
    }
    res.send(req.body);
});


// Gets orders based on a customer id
// example: /apt/getOrders?UID=10
// will fetch all shipping requests with UID = 10
app.get("/api/getOrders", (req, res) => {
    // Gets the order based on the customer ID
    if (checkExists(req.query, "UID", "string")) {
        // Checks if user ID exists, if it does
        var user_id = req.query["UID"];
        client.query("SELECT * FROM SHIPPING_REQUEST WHERE ID = " + user_id).then(function(result) {
            res.send(result.rows);
        }).catch(function(error) {
            console.log("error, unable to retrieve orders for UID:" + user_id);
            res.send("error: 500");
        });
    }
});


// retrieve all shipping methods
// TODO: Test this
app.get("/api/getShippingMethods", (req, res) => {
    client.query("SELECT * FROM SHIPPING_METHOD").then(function(result) {
       res.send(result.rows); 
    }).catch(function(error) {
        console.log("unable to fetch shipping methods");
        res.send("error: 500");
    });
});

// Companies:
//  companies keep records of shipping request from customers:
//  INSERT SHIPPING_REQUEST(....) ...
//  send items to the warehouses
//  INSERT ITEM(....)
//  INSERT SHIPPING_REQUEST(....) ...
