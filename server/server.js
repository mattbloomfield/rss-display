const express = require('express');
const app = express();
const cors = require('cors');
const Feed = require('rss-to-json');

const port = 2482;

const whitelist = ['http://localhost:54567', 'http://127.0.0.1:54567']
const corsOptions = {
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            // callback(null, true);
            callback(new Error('Not allowed by CORS'))
        }
    }
}

app.get('/', cors(corsOptions), async function (req, res) {
    console.log('getting feed');
    const RSS_URL = `http://feeds.washingtonpost.com/rss/world`;
    Feed.load(RSS_URL, function (err, rss) {
        console.log('loaded RSS feed');
        res.send(rss)
    });

})

app.listen(port, () => console.log(`RSS App listening on port ${port}!`))