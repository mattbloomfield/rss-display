'use strict'

const express = require('express');
const app = express();
const cors = require('cors');
const Feed = require('rss-to-json');
const Metascraper = require('scrape-meta');
const fs = require('fs');
const path = require('path');
const glob = require('glob');

const port = 2482;

const feeds = {
    wapo: {
        url: `http://feeds.washingtonpost.com/rss/world`,
        name: 'The Washington Post'
    },
    bostonGlobe: {
        url: `https://www.bostonglobe.com/rss/bigpicture`,
        name: 'Boston Globe'
    },
    google: {
        url: `https://news.google.com/rss?hl=en-US&gl=US&ceid=US%3Aen&x=1571747254.2933`,
        name: 'Google World News'
    }
};

function checkCache(feed) {
    return new Promise((resolve, reject) => {
        const searchPath = path.join(__dirname, `./cache/${feed}.*`);
        glob(searchPath, function (err, files) {
            if (err) reject(err);
            for (let i = 0; i < files.length; i++) {
                const timestamp = files[i].split('.')[1];
                const currentTimestamp = new Date().getTime();
                if (currentTimestamp - timestamp < 1000 * 60 * 60) {
                    resolve(files[i]);
                } else {
                    fs.unlink(files[i], () => {
                    });
                }
            }
            resolve(null);
        })
    });
}

app.get('/api/', cors(), async function (req, res) {
    const feed = req.query.feed || 'wapo';
    console.log('got a request', feed);
    const rssUrl = feeds[feed].url;
    if (!rssUrl) {
        res.json({ error: 'Unknown Feed. Please use a known feed.', knownFeeds: feeds.keys() });
        return;
    }
    const cache = await checkCache(feed);
    if (cache) {
        const fileData = fs.readFileSync(cache);
        const items = JSON.parse(fileData);
        console.log(`Found ${items.length} items in cache`)
        res.json({ items });
    } else {
        Feed.load(rssUrl, async function (err, rss) {
            const items = [];
            console.log(`found ${rss.items.length} items`)
            for (let i = 0; i < rss.items.length; i++) {
                const item = rss.items[i];
                item.source = feeds[feed].name;
                const metadata = await Metascraper.scrapeUrl(item.url);
                if (feed === 'wapo') {
                    if (metadata.image)
                        metadata.image = metadata.image.split('url=')[1].split('?')[0];
                    console.log('modified image', metadata.image);
                }
                item.metadata = metadata;
                items.push(item);
            }
            const filename = `${feed}.${new Date().getTime()}.json`;
            fs.writeFile(path.join(__dirname, './cache/', filename), JSON.stringify(items), (err) => {
                if (err) throw err;
            });
            res.json({ items });
        });
    }
})

app.listen(port, () => console.log(`RSS App listening on port ${port}!`))