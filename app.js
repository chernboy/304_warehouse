const express = require('express')
const path = require('path');
const app = express()

const location = path.resolve(__dirname);
const hostname = '127.0.0.1'
const port = 3000
const htmlpath = "/html"
const jspath= "/js"


app.get('/admin', (req, res) => {
    console.log("received get request at admin")
    res.sendFile(location + htmlpath + "/admin.html")
})

app.get('/customer', (req,res) => {
    console.log("received get request at customer")
    res.sendFile(location + htmlpath + "/customer.html")
})

app.get('/company', (req,res) => {
    console.log("received get request at company");
    res.sendFile(location + htmlpath + "/company.html")
})

app.get('/', (req, res) => {
    console.log("received get request at /");
    res.sendFile(location + htmlpath + "/index.html")
})

app.get("/js/customer.js", (req, res) => {
    res.sendFile(location + jspath +"/customer.js")
})

app.get("/js/company.js", (req, res) => {
    res.sendFile(location + jspath +"/company.js")
})

app.get("/js/admin.js", (req, res) => {
    res.sendFile(location + jspath +"/admin.js")
})

app.listen(port, () => {
  console.log('Example app listening on port ' + port)
})
