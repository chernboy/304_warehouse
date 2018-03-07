const express = require('express')
const path = require('path');
const app = express()

const location = path.resolve(__dirname);
const hostname = '127.0.0.1'
const port = 3000
const htmlpath = "/html"


app.get('/admin', (req, res) => res.sendFile(location + htmlpath + "/admin.html"))

app.get('/customer', (req,res) => res.sendFile(location + htmlpath + "/customer.html"))

app.get('/company', (req,res) => res.sendFile(location + htmlpath + "/company.html"))

app.get('/', (req, res) => res.sendFile(location + htmlpath + "/index.html"))

app.listen(port, () => {
  console.log('Example app listening on port ' + port)
})
