# RSS Feed Display

This app is basic and used to handle RSS feed display by the A/V team. 

The Node.js backend is simple and really only in use to proxy the RSS feeds and overcome CORS issues. 

## Development

Right now, nothing set up formally. `nodemon` is great for server, `live-server` is good for the frontend. 

## Deployment

Push to github, ssh into server, pull down, `pm2 restart` on the correct instance