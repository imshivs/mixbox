# mixbox

## get started

    npm install && bower install
    gulp # compile assets and start a watch server. **Doesn't** run backend, just static assets (email form won't work)

to run the actual server:

    MAILCHIMP_KEY=XXX MAILCHIMP_LIST=XXX node server.js

The server is now backend.openmixbox.com. Static assets are hosted by AWS CloudFront. To deploy,

    gulp aws:cdn

http://blog.mailchimp.com/opt-in-vs-confirmed-opt-in-vs-double-opt-in/