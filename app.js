if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

const express = require('express');
const routes = require('./routes');
const app = express();
const cors = require('cors')
const errorHandler = require("./middlewares/errorHandler")

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use(routes);

// Error Handling
app.use(errorHandler);



module.exports = app;