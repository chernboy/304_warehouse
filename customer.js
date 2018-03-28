// Customers:
//  SELECT * FROM SHIPPING_REQUEST(...) ...
//  decide which shipping methods to deliver the items
//  SELECT * FROM SHIPPING_METHOD(...)
//  ORDER BY(...)

// Creates a shipping request using
// body parameterst
// "reqNum"    -  "number"
// "vehID"     -  "string" 
// "ID"        -  "number" 
// "lat"       -  "number" 
// "lon"       -  "number" 
// "IID"       -  "number" 
// app.post("/api/makeShippingRequest", (req, res) => {
exports.makeShippingRequest = function(req, res, client) {
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
    if (checkExists(body, "vehID", "string") &&
        checkExists(body, "ID", "number") && checkExists(body, "lat", "number") &&
        checkExists(body, "lon", "number") && checkExists(body, "i_id", "number")) {
        // retrieve information 
        // var reqNum = body["reqNum"];
        // TODO: Determine req_num
        var req_num = 0;
        client.query("SELECT max(req_num) FROM shipping_request").then(function(result) {
            // TODO: Remove this and debug
            console.log(result.rows);
            res.send(result.rows);
            return;
        }).catch(function(error){
            console.log("Error: couldn't retrieve rows");
            res.status(500);
            res.send("error: unable to determine next req_num"); 
            return;
        });

        var vehID  = body["vehID"];
        var ID     = body["ID"];
        var lat    = body["lat"];
        var lon    = body["lon"];
        var i_id   = body["i_id"];

        // Verify there exists the foreign elements in the other tables first
        // TODO: Verify vehID exists in SHIPPING_METHOD table
        client.query("SELECT * FROM SHIPPING_METHOD WHERE ID = " + vehID).then(function(result) {
            if(result.rowCount() == 0) {
                res.send("Error, no Vehicle associated with " + vehID);
                return;
            }
        }).catch(function(error) {
                res.send("Error: " + error);
                return;
        });
        // TODO: ID exists in USER table
        client.query("SELECT * FROM USER WHERE ID = " + ID).then(function(result) {
            if(result.rowCount() == 0) {
                res.send("Error, no USER associated with " + ID);
                return;
            }
        }).catch(function(error) {
                res.send("Error: " + error);
                return;
        });
        // TODO: lat,lon exists in WAREHOUSE table
        client.query("SELECT * FROM WAREHOUSE WHERE lat = " + lat + " AND lon " + lon).then(function(result) {
            if(result.rowCount() == 0) {
                res.send("Error, no WAREHOUSE associated with " + lat + " " + lon);
                return;
            }
        }).catch(function(error) {
                res.send("Error: " + error);
                return;
        });
        // TODO: IID exists in ITEM table
        client.query("SELECT * FROM ITEM WHERE ID = " + i_id).then(function(result) {
            if(result.rowCount() == 0) {
                res.send("Error, no ITEM associated with " + i_id);
                return;
            }
        }).catch(function(error) {
                res.send("Error: " + error);
                return;
        });
        // TODO: Add shipping request to table
        // res.send("We have items here, it works!");
        return;
    }
    // res.send(req.body);
    // return;
};


// Gets orders based on a customer id
// example: /apt/getOrders?UID=10
// will fetch all shipping requests with UID = 10
exports.getOrders = function(req, res, client) {
    // Checks if user ID exists, if it does
    if (checkExists(req.query, "UID", "string")) {
        var user_id = req.query["UID"];
        client.query("SELECT * FROM SHIPPING_REQUEST WHERE ID = " + user_id).then(function(result) {
            res.send(result.rows);
        }).catch(function(error) {
            console.log("error, unable to retrieve orders for UID:" + user_id);
            res.status(500);
            res.send("error: 500");
        });
    } else {
        res.send("400");
        res.send("No ID specified; unable to retrieve orders");
    }
};


// retrieve all shipping methods
// TODO: Test this
// app.get("/api/getShippingMethods", (req, res) => {
exports.getShippingMethods = function(req, res, client) {
    client.query("SELECT * FROM SHIPPING_METHOD").then(function(result) {
       res.send(result.rows);
        }).catch(function(error) {
            console.log("unable to fetch shipping methods");
            res.status(500);
            res.send("error: 500");
        });
};


// GET request - returns an OK with the 
exports.userLogin = function(req, res, client) {
    if(!checkExists(req.query, "name", "string")) {
        res.status(400);
        res.send("Invalid use of API; must specify user name");
        return;
    }

    client.query("SELECT * FROM customer WHERE cu_name = $1", [req.query["name"]]).then(result => {
        if(result.rowCount != 1) {
            res.status(500);
            res.send("Error pulling user from database; Does user exist?");
            return;
        }
        res.send("" + result.rows[0].id);
    }).catch(e => {
        res.status(500);
        res.send("Error fetching data")
    });
}

exports.compLogin = function (req, res, client) {
    if (!checkExists(req.query, "name", "string")) {
        res.status(400);
        res.send("Invalid use of API; must specify company name");
        return;
    }

    client.query("SELECT * FROM company WHERE co_name = $1", [req.query["name"]]).then(result => {
        if (result.rowCount != 1) {
            res.status(500);
            res.send("Error pulling user from database; Does company exist?");
            return;
        }
        res.send("" + result.rows[0].id);
    }).catch(e => {
        res.status(500);
        res.send("Error fetching data")
    });

}

// helper function that checks if the object contains the key and is of the correct type
function checkExists(object, key, type) {
    return (key in object) && (typeof(object[key]) === type);
}

// Companies:
//  companies keep records of shipping request from customers:
//  INSERT SHIPPING_REQUEST(....) ...
//  send items to the warehouses
//  INSERT ITEM(....)
//  INSERT SHIPPING_REQUEST(....) ...



