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

app.get('/customer', (req, res) => {
    console.log("received get request at customer");
    res.sendFile(location + htmlpath + "/customer.html");
});

app.get('/company', (req, res) => {
    console.log("received get request at company");
    res.sendFile(location + htmlpath + "/company.html");
});

app.get('/', (req, res) => {
    console.log("received get request at /");
    res.sendFile(location + htmlpath + "/index.html");
});

app.get("/api/getCustomerPendingOrders", (req, res) => {
    customer.getCustomerPendingOrders(req, res, client)
})

app.get("/api/getCustomerShippedOrders", (req, res) => {
    customer.getCustomerShippedOrders(req, res, client)
})

app.get("/api/getItems", (req, res) => {
    var filter
    try {
        filter = parseInt(req.query.filter)
    } catch (err) {
        console.log(err)
    }

    var rows = []
    if (filter) {
        client.query("SELECT * FROM ITEM WHERE I_ID = $1", [filter], (err, result) => {
            if (err) {
                res.status(400)
                console.log(err)
                res.send("failed to get items")
            } else {
                res.status(200)
                console.log("filtered:" + result.rows)
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

app.get("/api/getCompanyItems", (req, res) => {
    let id
    try {
        id = parseInt(req.query.id)
    } catch (e) {
        res.status(400)
        res.send("invalid id")
    }

    client.query("select * from item where ID = $1", [id])
        .then((result) => {
            res.status(200)
            res.send(result.rows)
        })
        .catch((err) => {
            res.status(400)
            res.send("Unable to get company items")
        })
})

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

app.get("/api/getUnshippedOrders", (req, res) => {
    client.query("SELECT * FROM SHIPPING_REQUEST WHERE shipped=0")
        .then((result) => {
            res.status(200)
            res.send(result.rows)
        }).catch((err) => {
            res.status(400)
            res.send("couldnt get unshipped orders")
        })
})

app.get("/api/getShippedOrders", (req, res) => {
    client.query("SELECT * FROM SHIPPING_REQUEST WHERE shipped=1")
        .then((result) => {
            res.status(200)
            res.send(result.rows)
        }).catch((err) => {
            res.status(400)
            res.send("couldnt get shipped orders")
        })
})

app.get("/api/shipOrder", (req, res) => {
    if (!("body" in req)) {
        res.status(400)
        res.send("invalid body")
    }

    let req_num = req.query.req_num

    queryPromises = []
    let iid, qty
    client.query("select I_ID, qty from shipping_request where req_num = $1", [req_num])
        .then((result) => {
            iid = result.rows[0].i_id
            qty = result.rows[0].qty
            return client.query("select quantity from item where I_ID = $1", [iid])
        })
        .then((result) => {
            let itemQty = result.rows[0].quantity
            if (itemQty < qty) {
                return Promise.reject("Not enough items left!")
            }
            queryPromises.push(client.query("update shipping_request set shipped=1 where req_num=$1", [req_num]))
            queryPromises.push(client.query("update item set quantity=$1 where I_ID=$2", [itemQty - qty, iid]))
        })

    Promise.all(queryPromises).then((results) => {
        res.status(200)
        res.send("successfully shipped order")
    })
        .catch((err) => {
            res.status(400)
            res.send("failed to ship order")
        })
})

app.get("/api/rejectOrder", (req, res) => {
    let req_num = req.query.req_num

    client.query("delete from shipping_request where req_num = $1", [req_num])
        .then((result) => {
            res.status(200)
            res.send("successfully deleted")
        })
        .catch((err) => {
            res.status(400)
            res.send("failed to delete")
        })
})

app.get("/api/getShippingMethods", (req, res) => {
    customer.getShippingMethods(req, res, client);
});

// GETs all orders associated with the specified user
// Parameters:
// UID - string - User ID to get orders of
app.get("/api/getOrders", (req, res) => {
    customer.getOrders(req, res, client);
});

// TODO: Document this
app.post("/api/makeShippingRequest", (req, res) => {
    customer.makeShippingRequest(req, res, client);
});

// GETs the UserID associated with the given customer
// Parameters: name - string - name of user
app.get("/api/userLogin", (req, res) => {
    customer.userLogin(req, res, client);
});

// GETs the UserID associated with the given company
// Parameters: name - string - name of company
app.get("/api/companyLogin", (req, res) => {
    customer.compLogin(req, res, client);
});

app.get("/api/adminLogin", (req, res) => {
    let name = req.query.name
    if (name === "admin") {
        res.status(200)
        res.send({ log: 1 })
    } else {
        res.status(400)
        res.send()
    }
})

app.post("/api/addItem", (req, res) => {
    customer.addItem(req, res, client);
});

app.get("/api/getItemPopularity", (req, res) => {
    customer.getItemPopularity(req, res, client);
});

app.get("/api/getCustomersPurchasingEverywhere", (req, res) => {
    customer.getCustomersPurchasingEverywhere(req, res, client);
});

app.get("/api/getMaxAverageWarehouse", (req, res) => {
    customer.getMaxAverageWarehouse(req, res, client);
});

app.get("/api/getMinAverageWarehouse", (req, res) => {
    customer.getMinAverageWarehouse(req, res, client);
});

app.post("/api/deleteWarehouseAndMove", (req, res) => {
    customer.deleteWarehouseAndMove(req, res, client);
});

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
    console.log('Example app listening on port ' + port);
});