
const express = require('express');
const app = express();
const port = 3000;
const { scrapeFlights } = require('./scraper');

// found at http://localhost:3000/

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/search', async (req, res) => {
    //console.log(req.query);
    
    const {from, to, departDate, returnDate} = req.query

    if (!from || !to || !departDate || !returnDate) {
        res.status(400).send('Inputs are missing');
        return;
    }

    try {
    // call the scraper, await or else parsing won't occur and empty {} returned. Thus must make async
    const data = await scrapeFlights(from, to, departDate, returnDate);

    res.send(data);
    } catch(e) {
        res.status(500).send('Failed to scrape!')
    }
});

// found at http://localhost:3000/search

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})