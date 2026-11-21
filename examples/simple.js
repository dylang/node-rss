
// A simple RSS feed generation example

var RSS = require('../lib/index');

// Create RSS Feed Meta
var feed = new RSS({
    title: 'title',
    description: 'description',
    feed_url: 'http://example.com/rss.xml',
    site_url: 'http://example.com',
    image_url: 'http://example.com/icon.png',
    docs: 'http://example.com/rss/docs.html',
    managingEditor: 'Dylan Greene',
    webMaster: 'Dylan Greene',
    copyright: '2013 Dylan Greene',
    language: 'en',
    categories: ['Category 1','Category 2','Category 3'],
    pubDate: 'May 20, 2012 04:00:00 GMT',
    ttl: '60',
    no_cdata_fields: ['title', 'category'],
    customNamespaces: {
      'itunes': 'http://www.itunes.com/dtds/podcast-1.0.dtd'
    },
    custom_elements: [
      {'itunes:subtitle': 'A show about everything'},
      {'itunes:author': 'John Doe'},
      {'itunes:summary': 'All About Everything is a show about everything. Each week we dive into any subject known to man and talk about it as much as we can. Look for our podcast in the Podcasts app or in the iTunes Store'},
      {'itunes:owner': [
        {'itunes:name': 'John Doe'},
        {'itunes:email': 'john.doe@example.com'}
      ]},
      {'itunes:image': {
        _attr: {
          href: 'http://example.com/podcasts/everything/AllAboutEverything.jpg'
        }
      }},
      {'itunes:category': [
        {_attr: {
          text: 'Technology'
        }},
        {'itunes:category': {
          _attr: {
            text: 'Gadgets'
          }
        }}
      ]}
    ]
});

// Add an item/article to the feed
feed.item({
    title:  'Item Title & Fun',
    description: 'Use this for the content. It can include html.',
    url: 'http://example.com/article4?this&that', // link to the item
    guid: '1123', // optional - defaults to url
    categories: ['Category 1','Category 2'], // optional - array of item categories
    author: 'Guest Author', // optional - defaults to feed author property
    date: 'May 27, 2012', // any format that js Date can parse.
    lat: 33.417974, //optional latitude field for GeoRSS
    long: -111.933231, //optional longitude field for GeoRSS
    enclosure: { url: 'https://www.google.com/images/srpr/logo11w.png' },
    // enclosure: {file:'path-to-file'}, // enclosure from file
    custom_elements: [
      {'itunes:author': 'John Doe'},
      {'itunes:subtitle': 'A short primer on table spices'},
      {'itunes:image': {
        _attr: {
          href: 'http://example.com/podcasts/everything/AllAboutEverything/Episode1.jpg'
        }
      }},
      {'itunes:duration': '7:04'}
    ]
});

// generate xml with default indent (4 sp)
var xml = feed.xml({indent: true});
console.log(xml);