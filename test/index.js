// use npm run test:browser to run tests in a browser
var test = require('tape');

var RSS = require('..');
var xml2js = require('xml2js');
var q = require('q');

var includeFolder = require('include-folder');
var expectedOutput = includeFolder(__dirname + '/expectedOutput', /.*\.xml$/);

// Dates in XML files will always be this value.
require('mockdate').set('Wed, 10 Dec 2014 19:04:57 GMT');

test('empty feed', function(t) {
    t.plan(2);
    var feed = new RSS();
    t.equal(feed.xml(), expectedOutput.default);
    feed.item();
    t.equal(feed.xml(), expectedOutput.defaultOneItem);
});

test('indentation', function(t) {
    t.plan(4);
    var feed = new RSS({
                title: 'title',
                description: 'description',
                generator: 'Example Generator',
                feed_url: 'http://example.com/rss.xml',
                site_url: 'http://example.com',
                image_url: 'http://example.com/icon.png',
                author: 'Dylan Greene',
                categories: ['Category 1','Category 2','Category 3'],
                pubDate: 'May 20, 2012 04:00:00 GMT',
                docs: 'http://example.com/rss/docs.html',
                copyright: '2013 Dylan Green',
                language: 'en',
                managingEditor: 'Dylan Green',
                webMaster: 'Dylan Green',
                ttl: '60'
            });

    feed.item({
                title:  'item 1',
                description: 'description 1',
                url: 'http://example.com/article1',
                date: 'May 24, 2012 04:00:00 GMT'
            })
        .item({
                title:  'item 2',
                description: 'description 2',
                url: 'http://example.com/article2',
                date: 'May 25, 2012 04:00:00 GMT'
            })
        .item({
                title:  'item 3',
                description: 'description 3',
                url: 'http://example.com/article3',
                guid: 'item3',
                date: 'May 26, 2012 04:00:00 GMT'
            })
        .item({
                title:  'item 4 & html test with <strong>',
                description: 'description 4 uses some <strong>html</strong>',
                url: 'http://example.com/article4?this&that',
                author: 'Guest Author',
                date: 'May 27, 2012 04:00:00 GMT'
            })
        .item({
                title:  'item 5 & test for categories',
                description: 'description 5',
                url: 'http://example.com/article5',
                categories: ['Category 1','Category 2','Category 3','Category 4'],
                author: 'Guest Author',
                date: 'May 28, 2012 04:00:00 GMT'
            });

    var qParseXml = q.nbind(xml2js.parseString, xml2js);

    var xmlWithoutIndents = feed.xml({indent: false});
    var xmlWithIndents = feed.xml({indent: true});

    t.notEqual(xmlWithoutIndents, xmlWithIndents);
    t.equal(xmlWithoutIndents, expectedOutput.simpleFeed);
    t.equal(xmlWithIndents, expectedOutput.simpleFeedFormated);

    q.all([
            qParseXml(xmlWithoutIndents),
            qParseXml(xmlWithIndents)
        ])
        .spread(function (fromWithoutIndents, fromWithIndents){
            t.deepEqual(JSON.stringify(fromWithoutIndents), JSON.stringify(fromWithIndents));
        });
});

test('enclosure', function(t) {
    //if (typeof window) return;

    t.plan(1);

    var feed = new RSS({
        title: 'title',
        description: 'description',
        feed_url: 'http://example.com/rss.xml',
        site_url: 'http://example.com',
        author: 'Dylan Greene'
    });

    feed.item({
        title:  'item 1',
        description: 'description 1',
        url: 'http://example.com/article1',
        date: 'May 24, 2012 04:00:00 GMT',
        enclosure : 'incorrect value'
    });

    feed.item({
        title:  'item 2',
        description: 'description 2',
        url: 'http://example.com/article1',
        date: 'May 24, 2012 04:00:00 GMT',
        enclosure : {url: '/media/some-file.flv'}
    });

    feed.item({
        title:  'item 3',
        description: 'description 3',
        url: 'http://example.com/article1',
        date: 'May 24, 2012 04:00:00 GMT',
        enclosure : {
            url: '/media/image.png',
            file: __dirname + '/image.png',
            size: 16650 // this is optional
        }
    });

    t.equal(feed.xml({indent: true}), expectedOutput.enclosures);
});

test('enclosure_mimetype_override', function(t) {
    //if (typeof window) return;

    t.plan(1);

    var feed = new RSS({
        title: 'title',
        description: 'description',
        feed_url: 'http://example.com/rss.xml',
        site_url: 'http://example.com',
        author: 'Dylan Greene'
    });


    feed.item({
        title:  'item 1',
        description: 'description 1',
        url: 'http://example.com/article1',
        date: 'May 24, 2012 04:00:00 GMT',
        enclosure : {url: '/media/some-file-without-extension', type: 'custom-video/x-flv'}
    });

    feed.item({
        title:  'item 2',
        description: 'description 2',
        url: 'http://example.com/article1',
        date: 'May 24, 2012 04:00:00 GMT',
        enclosure : {
            url: '/media/image.png',
            file: __dirname + '/image.png',
            size: 16650, // this is optional
            type: 'image/jpeg' // we set this just to prove that the override works
        }
    });

    t.equal(feed.xml({indent: true}), expectedOutput.enclosure_mimetype_override);
});

test('geoRSS', function(t) {
    t.plan(1);
    var feed = new RSS({
        title: 'title',
        description: 'description',
        feed_url: 'http://example.com/rss.xml',
        site_url: 'http://example.com',
        author: 'Dylan Greene'
    });

    feed.item({
        title:  'item 1',
        description: 'description 1',
        url: 'http://example.com/article1',
        date: 'May 24, 2012 04:00:00 GMT',
        lat: 12232,
        long: 13333.23323
    });

    feed.item({
        title:  'item 2',
        description: 'description 2',
        url: 'http://example.com/article1',
        date: 'May 24, 2012 04:00:00 GMT'
    });

    t.equal(feed.xml({indent: true}), expectedOutput.latLong);
});

test('PubSubHubbub hub', function(t) {
    t.plan(1);

    var feed = new RSS({
        title: 'title',
        description: 'description',
        feed_url: 'http://example.com/rss.xml',
        site_url: 'http://example.com',
        hub: 'http://example.com/hub'
    });

    t.equal(feed.xml({indent: true}), expectedOutput.pubSubHubbub);
});


test('custom elements', function(t) {
    t.plan(1);

    var feed = new RSS({
                title: 'title',
                description: 'description',
                feed_url: 'http://example.com/rss.xml',
                site_url: 'http://example.com',
                author: 'Dylan Greene',
                pubDate: 'May 20, 2012 04:00:00 GMT',
                language: 'en',
                ttl: '60',
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

    feed.item({
        title:  'item 1',
        description: 'description 1',
        url: 'http://example.com/article1',
        date: 'May 24, 2012 04:00:00 GMT',
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

    t.equal(feed.xml({indent: true}), expectedOutput.customElements);
});

test('custom namespaces', function(t) {
    t.plan(1);

    var feed = new RSS({
                title: 'title',
                description: 'description',
                feed_url: 'http://example.com/rss.xml',
                site_url: 'http://example.com',
                author: 'Dylan Greene',
                pubDate: 'May 20, 2012 04:00:00 GMT',
                language: 'en',
                ttl: '60',
                custom_namespaces: {
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

    feed.item({
        title:  'item 1',
        description: 'description 1',
        url: 'http://example.com/article1',
        date: 'May 24, 2012 04:00:00 GMT',
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

    t.equal(feed.xml({indent: true}), expectedOutput.customNamespaces);
});
