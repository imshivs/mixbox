# mixbox

## get started

    npm install && bower install
    gulp # compile assets and start a watch server.

`gulp serve` **doesn't** run backend, just static assets (email form won't work)

to run the actual server:

    MAILCHIMP_KEY=XXX MAILCHIMP_LIST=XXX node server.js

## Deploy

    git push heroku master

The server is now http://backend.openmixbox.com. Static assets are hosted by AWS CloudFront. To deploy those,

    grunt deploy

but you'll need `aws.json` which has the keys in it. It will take about 5 minutes for the CloudFront cache to invalidate.

**IMPORTANT** Don't run this too often, as AWS charges for it

http://blog.mailchimp.com/opt-in-vs-confirmed-opt-in-vs-double-opt-in/