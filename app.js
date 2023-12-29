const express = require('express');
const config = require('./config/cred');
const {startEventListener} = require('./src/handlers/listenerController')

//Routes
const vaccinechainRoute = require('./routes/vaccinechain');
const app = express();
app.use(express.json());
app.use('/sdk/api/v2/vaccinechain', vaccinechainRoute);
app.listen(config.SDK_PORT, async() => {
    console.log(`Server running on ${config.HOST}:${config.SDK_PORT}/`);
    await startEventListener();
});

app.use((req, res, next) => {
    const error = new Error(`Not Found- ${req.originalUrl}`)
    res.status(404)
    next(error)

})

app.use((error, req, res, next) => {
    const statusCode = req.statusCode === '200' ? 500 : res.statusCode
    res.status(statusCode)
    res.json({
		success: false,
        message: error.message
    })
})

