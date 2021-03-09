const express = require('express')
const fs = require('fs')

//Functions
const findDate = (date, callback) => {
    const calendar = loadCalendar()
    const item = calendar.bacs_calendar[date]

    if (item) {
        callback(undefined, item)
    } else {
        callback('date_not_found', undefined)
    }
}

const loadCalendar = () => {
    try {
        const dataBuffer = fs.readFileSync('data/2021.json')
        const dataJSON = dataBuffer.toString()
        return JSON.parse(dataJSON)
    } catch (e) {
        return []
    }
}

//App
const app = express()
const port = process.env.PORT || 3000

//Request Handler
app.get('/', function (req, res) {
    if (req.query.date) {
        findDate(req.query.date, (error, data) => {
            if (error) {
                return res.send({
                    date: req.query.date,
                    error
                })
            }
            res.json({
                date: req.query.date,
                data
            })
        })
    } else {
        return res.send({
            error: "date_not_defined"
        })
    }
})

app.get('*', (req, res) => {
    res.json({
        error: 'page_not_found'
    })
})

// Start Server
app.listen(port, () => {
    console.log('Server is up on port: ' + port)
})