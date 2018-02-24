const express = require('express')
const app = express()

const hostname = '127.0.0.1'
const port = 3000

app.get('/', (req, res) => res.send('Hello world!'))

app.get('/admin', (req, res) => res.send('You should only be here if you are an admin'))

app.get('/customer', (req,res) => res.send('Hello valued customer!'))

app.get('/company', (req,res) => res.send('Welcome to your company page'))

app.listen(port, () => {
  console.log('Example app listening on port ' + port)
})
