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
            res.status(200)
            res.send(result.rows);
            return;
        }).catch(error => {
            res.status(400);
            res.send("error: " + error);
            return;
        });
    
        }).catch(function(error){
            res.status(500);
            res.send("error: unable to determine next req_num"); 
            return;
        });
    } else {
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
        client.query("SELECT * FROM SHIPPING_REQUEST WHERE ID = $1", [user_id]).then(function(result) {
            res.send(result.rows);
            return;
        }).catch(function(error) {
            console.log("error, unable to retrieve orders for UID:" + user_id);
            res.status(500);
            res.send("error: 500");
            return;
        });
    } else {
        res.status(400);
        res.send("No ID specified; unable to retrieve orders");
        return;
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
        return;
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
        return;
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
            // retrieve the maximum i_id to determine the next one
            if(result.rowCount === 1) {
                next_i_id = result.rows[0].max + 1;

                // check if the warehouse exists
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

                // check if the company exists
                client.query("SELECT * FROM COMPANY WHERE ID = $1", [body.ID]).then(result => {
                    if (result.rowCount < 1) {
                        res.status(400);
                        res.send("Unable to find a company with id: " + body.ID);
                        return;
                    }

                    // console.log("" + [
                        // next_i_id,
                        // body.weight, body.quantity, body.cost, body.volume,
                        // body.lat, body.lon, body.ID
                    // ]);
                    
                    // Insert the item into the table
                    client.query("INSERT INTO ITEM VALUES($1, $2, $3, $4, $5, $6, $7, $8)", [
                        next_i_id,
                        body.weight, body.quantity, body.cost, body.volume,
                        body.lat, body.lon, body.ID
                    ]).then(result => {
                        res.send(result.rows);
                        return;
                    }).catch(error => {
                        res.status(400);
                        res.send("Error inserting: " + error);
                        return;
                    });

                
                }).catch(error => {
                    res.status(500);
                    res.send("Database error");
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

// Returns all orders that have not been shipped for a given customer
exports.getCustomerPendingOrders = function(req, res, client) {
    if(!checkExists(req.query, "id", "string")) {
        res.status(400);
        res.send("error: must specify id");
        return;
    }
    let id = parseInt(req.query.id)
    client.query("SELECT * FROM SHIPPING_REQUEST WHERE ID = $1 AND shipped = 0", [id]).then(function (result) {
        res.status(200)
        res.send(result.rows)
    }).catch(function (err) {
        console.log(err)
        res.status(400)
        res.send("failed to get orders for customer")
    });
};

// Returns all orders that have been shipped for a given customer
exports.getCustomerShippedOrders = function(req, res, client) {
    if(!checkExists(req.query, "id", "string")) {
        res.status(400);
        res.send("error: must specify id");
        return;
    }
    id = parseInt(req.query.id)
    client.query("SELECT * FROM SHIPPING_REQUEST WHERE ID = $1 AND shipped = 1", [id]).then(function (result) {
        res.status(200)
        res.send(result.rows)
    }).catch(function (err) {
        console.log(err)
        res.status(400)
        res.send("failed to get orders for customer")
    });
};

// Returns the item popularity, counting how many transactions occured for a given item
exports.getItemPopularity = function(req, res, client) {
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

// Deletes a user, and remove all associated information
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
};

// Retuns all customers that have purcased an item from every company
exports.getCustomersPurchasingEverywhere = function(req, res, client) {
    // This is a really long function name
    // help....
    // NOTE: There is no parameters for this api/function
    // Select customers that have purchased an item 
    // (created a shipping request) from every company
    client.query("SELECT cu.* FROM customer cu WHERE NOT EXISTS " +
        "((SELECT co.id FROM company co) EXCEPT " +
        "(SELECT i.id FROM item i, shipping_request sr WHERE " + 
        "sr.i_id = i.i_id AND cu.id = sr.id))").then(result => {
                res.send(result.rows);
                return;
            }).catch(error => {
                res.status(500);
                res.send(error);
                return;
            });
};

// Returns the warehouse with the higest average item cost
exports.getMaxAverageWarehouse = function(req, res, client) {
    // client.query("SELECT * FROM item i, ((SELECT w2.lat, w2.lon, avg(i.cost) AS avCost" +
    //     "                        FROM item i, warehouse w2" +
    //     "                        WHERE i.lat = w2.lat AND i.lon = w2.lon" +
    //     "                        GROUP BY w2.lat, w2.lon)) AS magic" +
    //     "WHERE magic.avCost >= ALL (SELECT avCost FROM (SELECT w2.lat, w2.lon, avg(i.cost) AS avCost" +
    //     "                        FROM item i, warehouse w2" +
    //     "                        WHERE i.lat = w2.lat AND i.lon = w2.lon" +
    //     "                        GROUP BY w2.lat, w2.lon) AS magic2);"
    client.query("select MAX(groups.av) from (select avg(cost) as av, item.lat, item.lon from item group by lat, lon) as groups")
    .then(result => {
        res.status(200)
        res.send(result.rows);
        return;
    }).catch(error => {
        console.log(error)
        res.status(500);
        res.send(error);
        return;
    });
};

// Returns the warehouse with the lowest average item cost
exports.getMinAverageWarehouse = function (req, res, client) {
    // client.query("SELECT * FROM item i, ((SELECT w2.lat, w2.lon, avg(i.cost) AS avCost" +
    //     "                        FROM item i, warehouse w2" +
    //     "                        WHERE i.lat = w2.lat AND i.lon = w2.lon" +
    //     "                        GROUP BY w2.lat, w2.lon)) AS magic" +
    //     "WHERE magic.avCost <= ALL (SELECT avCost FROM (SELECT w2.lat, w2.lon, avg(i.cost) AS avCost" +
    //     "                        FROM item i, warehouse w2" +
    //     "                        WHERE i.lat = w2.lat AND i.lon = w2.lon" +
    //     "                        GROUP BY w2.lat, w2.lon) AS magic2);"
    client.query("select MAX(groups.av) from (select avg(cost) as av, item.lat, item.lon from item group by lat, lon) as groups")
    .then(result => {
        res.send(result.rows);
        return;
    }).catch(error => {
        console.log(error)
        res.status(500);
        res.send(error);
        return;
    });
};

// Deletes a warehouse and moves all items at the old warehouse to the new warehouse
exports.deleteWarehouseAndMove = function(req, res, client) {
    var body = req.body;
    var promiseArr = [];
    if (
        checkExists(body, "old_lat", "number") &&
        checkExists(body, "old_lon", "number") &&
        checkExists(body, "new_lat", "number") &&
        checkExists(body, "new_lon", "number")
    ) {
        // Check if the new warehouse is the same with the old warehosue
        if ((body.old_lat === body.new_lat) && (body.old_lon) === body.new_lon) {
            res.status(400);
            res.send("error: unable to send items to a warehouse that is being deleted");
            return;
        }
        // Grabs all items associated with the old warehouse
        client.query("SELECT * FROM ITEM WHERE lat = $1 AND lon = $2", [
            body.old_lat, body.old_lon
        ]).then(result => {
            var oldItemList = result.rows;
            // For every item in the old warehouse
            for(let row of oldItemList) {
                // Move it to the new warehouse
                promiseArr.push(client.query("UPDATE ITEM SET lat = $1, lon = $2 WHERE lat = $3 AND lon = $4", [
                    body.new_lat, body.new_lon, body.old_lat, body.old_lon
                ]));
            }
            // Wait for all queries to complete, then return
            Promise.all(promiseArr).then(result => {
                client.query("DELETE FROM warehouse WHERE lat = $1 AND lon = $2", [
                    body.old_lat, body.old_lon 
                ]).then(result => {
                    res.send("deleted warehouse and move all items");
                    return;
                }).catch(error => {
                    res.status(500);
                    res.send(error);
                    return;
                });
            }).catch(error => {
                res.status(500);
                res.send(error);
                return;
            });
        }).catch(error => {
            res.status(500);
            res.send(error);
            return;
        });
    }
};



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



