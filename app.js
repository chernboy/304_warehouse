const express = require('express')
const path = require('path');
const bodyParser = require('body-parser'); // To read JSON body data
const app = express();
const pg = require('pg');
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
    // THIS IS A TEST ITEM FOR NOW (should define the schema elsewhere and import that to prevent
    // repeating info)
    res.json({"iid":1234, "name": "itemName"});
});

// helper function that checks if the object contains the key and is of the correct type
function checkExists(object, key, type) {
    return (key in object) && (typeof(object[key]) === type);
}


app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log('Example app listening on port ' + port);
});
