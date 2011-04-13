/*
    use nodeunit to run tests.
*/

var RSS = require('../index');

var feed = new RSS();

feed.item();
feed.item();
feed.item();

console.log(feed.xml(true));
