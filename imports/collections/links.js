import { Mongo } from 'meteor/mongo';
import validUrl from 'valid-url';
import { check, Match } from 'meteor/check';

// define Meteor method
Meteor.methods({
  'links.insert': function(url) {
    // validate url and communicate success or failure // to client
    check(url, Match.Where(url => validUrl.isUri(url)));

    // URL is ready to be saved
    const token = Math.random().toString(36).slice(-5);
    Links.insert({ url, token, clicks: 0 });
    console.log(token);
  }
});

export const Links = new Mongo.Collection('links');
