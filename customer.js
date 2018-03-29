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
    if (
        checkExists(body, "qty"      , "number")  &&
        checkExists(body, "origin"   , "string")  &&
        checkExists(body, "dest"     , "string")  &&
        checkExists(body, "total_val", "number")  &&
        checkExists(body, "shipped"  , "number")  &&        
        checkExists(body, "veh_id"   , "string")  &&
        checkExists(body, "id"       , "number")  &&
        checkExists(body, "lat"      , "number")  &&
        checkExists(body, "lon"      , "number")  &&
        checkExists(body, "i_id"     , "number")) {
        // retrieve information 
        // var reqNum = body["reqNum"];
        var req_num = 0;
        client.query("SELECT max(req_num) FROM shipping_request").then(function(result) {
        if (result.rowCount === 1) {
            req_num = result.rows[0].max + 1;
        } else {
            res.status(500);
            res.send("Unable to generate next req_num, invalid data inconsistancy");
            return;
        }

        // var vehID = body["vehID"];
        // var ID = body["ID"];
        // var lat = body["lat"];
        // var lon = body["lon"];
        // var i_id = body["i_id"];

        // Verify there exists the foreign elements in the other tables first
        client.query("SELECT * FROM SHIPPING_METHOD WHERE veh_id = $1", [body.veh_id]).then(function (result) {
            if (result.rowCount == 0) {
                res.status(400);
                res.send("Error, no Vehicle associated with " + body.veh_id);
                return;
            }
        }).catch(function (error) {
            res.status(500);
            res.send("Error: " + error);
            return;
        });
        client.query("SELECT * FROM USERS WHERE id = $1", [body.id]).then(function (result) {
            if (result.rowCount == 0) {
                res.status(400);
                res.send("Error, no USER associated with " + body.id);
                return;
            }
        }).catch(function (error) {
            res.status(500);
            res.send("Error: " + error);
            return;
        });
        client.query("SELECT * FROM WAREHOUSE WHERE lat = $1 AND lon = $2", [body.lat, body.lon]).then(function (result) {
            if (result.rowCount == 0) {
                res.status(400);
                res.send("Error, no WAREHOUSE associated with " + body.lat + " " + body.lon);
                return;
            }
        }).catch(function (error) {
            res.status(500);
            res.send("Error: " + error);
            return;
        });
        client.query("SELECT * FROM ITEM WHERE i_id = $1", [body.i_id]).then(function (result) {
            if (result.rowCount == 0) {
                res.status(400);
                res.send("Error, no ITEM associated with " + body.i_id);
                return;
            }
        }).catch(function (error) {
            res.status(500);
            res.send("Error: " + error);
            return;
        });
        // res.send("We have items here, it works!");

        client.query("INSERT INTO SHIPPING_REQUEST VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)", [
            req_num, body.qty, body.origin, body.dest, body.total_val, body.shipped, body.veh_id, body.id, body.lat, body.lon, body.i_id
        ]).then(result => {
            console.log("Inserted new Shipping_request!");
            res.send(result.rows);
            return;
        }).catch(error => {
            res.status(400);
            res.send("error: " + error);
            return;
        });
    
        }).catch(function(error){
            console.log("Error: couldn't retrieve rows");
            res.status(500);
            res.send("error: unable to determine next req_num"); 
            return;
        });

        // console.log("We got here for some reason...");
        // res.status(400);
        // res.send("Error...")
        // return;
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
        client.query("SELECT * FROM SHIPPING_REQUEST WHERE ID = $1", [user_id]).then(function(result) {
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

    client.query("SELECT id FROM customer WHERE cu_name = $1", [req.query.name]).then((result) => {
        if(result.rowCount != 1) {
            res.status(500);
            res.send("Error pulling user from database; Does user exist?");
            return;
        }
        res.send(result.rows[0]);
    }).catch((e) => {
        res.status(500);
        res.send("Error fetching data")
    });
};

exports.compLogin = function (req, res, client) {
    if (!checkExists(req.query, "name", "string")) {
        res.status(400);
        res.send("Invalid use of API; must specify company name");
        return;
    }

    client.query("SELECT id FROM company WHERE co_name = $1", [req.query["name"]]).then(result => {
        if (result.rowCount != 1) {
            res.status(500);
            res.send("Error pulling user from database; Does company exist?");
            return;
        }
        res.send(result.rows[0]);
    }).catch((e) => {
        res.status(500);
        res.send("Error fetching data")
    });
};

// POST
exports.addItem = function (req, res, client) {
    body = req.body;
    if(
        checkExists(body, "lat"     , "number") &&
        checkExists(body, "lon"     , "number") &&
        checkExists(body, "ID"      , "number") &&
        checkExists(body, "cost"    , "number") &&
        checkExists(body, "weight"  , "number") &&
        checkExists(body, "quantity", "number") &&
        checkExists(body, "volume"  , "number") 
    ) {
        var next_i_id = 0;
        client.query("SELECT max(i_id) FROM ITEM").then(result => {
            if(result.rowCount === 1) {
                next_i_id = result.rows[0].max + 1;
                console.log("Next ID:" + next_i_id);

                client.query("SELECT * FROM WAREHOUSE WHERE lat = $1 AND lon = $2", [body.lat, body.lon]).then(result => {
                    if (result.rowCount < 1) {
                        res.status(400);
                        res.send("Unable to find a warehouse with lat: " + body.lat + " lon: " + body.lon);
                        return;
                    }
                }).catch(error => {
                    res.status(500);
                    res.send("Database error");
                    return;
                });

                client.query("SELECT * FROM COMPANY WHERE ID = $1", [body.ID]).then(result => {
                    if (result.rowCount < 1) {
                        res.status(400);
                        res.send("Unable to find a company with id: " + body.ID);
                        return;
                    }
                }).catch(error => {
                    res.status(500);
                    res.send("Database error");
                    return;
                });

                console.log("" + [
                    next_i_id,
                    body.weight, body.quantity, body.cost, body.volume,
                    body.lat, body.lon, body.ID]);
                client.query("INSERT INTO ITEM VALUES($1, $2, $3, $4, $5, $6, $7, $8)", [
                    next_i_id,
                    body.weight, body.quantity, body.cost, body.volume, 
                    body.lat, body.lon, body.ID]).then(result => {
                        console.log("Tada!");
                        res.send(result.rows);
                        return;
                    }).catch(error => {
                        res.status(400);
                        res.send("Error inserting: " + error);
                        return;
                    });


            } else {
                res.status(500);
                res.send("Unable to generate next I_ID, invalid data inconsistancy");
                return;
            }
        }).catch(error => {
            console.log(error);
            res.status(500);
            res.send("Server error: unable to generate next I_ID for new item");
            return;
        });

        // client.query("INSERT INTO ITEM VALUES(1, 2.0, 2, 2.4, 49.259680000000003, -123.173345, 2, 3)")


    } else {
        res.status(400);
        res.send("Missing parameters; got : " + JSON.stringify(body)); // DEBUG
        return;
    }
};

exports.getItemPopularity = function(req, res, client) {
    // TODO: Complete this
    client.query("SELECT i_id, count(req_num) FROM shipping_request" + 
    " GROUP BY i_id ORDER BY count(req_num) DESC").then(result => {
        res.send(result.rows);
        return;
    }).catch(error => {
        res.status(500);
        res.send("Error generating popularity data. " + error);
        return;
    });
}


exports.deleteUser = function(req, res, client) {
    if (checkExists(req.body, "id", "number")) {
        client.query("DELETE FROM USERS WHERE id = $1", [req.body.id]).then(response => {
            res.send(response);
            return;
        }).catch(error => {
            res.status(500);
            res.send("Error deleting user: " + error);
            return;
        });
    } else {
        res.status(400);
        res.send("Incorrect parameters: Missing 'id' value in body.");
        return;
    }
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



