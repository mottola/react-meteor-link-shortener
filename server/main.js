import { Meteor } from 'meteor/meteor';
import { Links } from '../imports/collections/links';
import { WebApp } from 'meteor/webapp';
import ConnectRoute from 'connect-route';

Meteor.startup(() => {
  // Meteor publish
  Meteor.publish('links', function () {
    return Links.find({});
  });
});

// figure out if token matches one in our collection
function onRoute(req, res, next) {
  // take token out of url and try to find matching link
  // in the links collection
  const link = Links.findOne({ token: req.params.token });


  if (link) {

    // Increment the link clicks using MongoModifiers
    Links.update(link, { $inc: { clicks: 1 }});

    // If we find a link object, redirect the user to the
    // long url
    res.writeHead(307, { 'Location': link.url });
    res.end();
  } else {
    // If we don't find a link object, redirect the user
    // to the long URL
    next();
  }
}

// Add middleware
const middleware = ConnectRoute(function(router) {
  router.get('/:token', onRoute);
});


WebApp.connectHandlers.use(middleware);
