const express = require('express');
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.Port || 5000;

// middleware
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello warehouse-management-website')
  })
  
  app.listen(port, () => {
    console.log(`warehouse-management-websit listening on port ${port}`)
  })