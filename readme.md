## rss [![NPM version](https://badge.fury.io/js/rss.svg)](http://badge.fury.io/js/rss)  [![Build Status](https://travis-ci.org/dylang/node-rss.svg)](https://travis-ci.org/dylang/node-rss) 

> RSS feed generator. Add RSS feeds to any project. Supports enclosures and GeoRSS.

[![rss](https://nodei.co/npm/rss.png?downloads=true "rss")](https://nodei.co/npm/rss)







### Usage

#### Create a new feed

```js
var RSS = require('rss');

var feed = new RSS(feedOptions);
```

##### `feedOptions`

 * `title` **string** Title of your site or feed
 * `description` _optional_ **string** A short description of the feed.
 * `generator` _optional_  **string** Feed generator.
 * `feed_url` **url string** Url to the rss feed.
 * `site_url` **url string** Url to the site that the feed is for.
 * `image_url` _optional_  **url string* Small image for feed readers to use.
 * `docs` _optional_ **url string** Url to documentation on this feed.
 * `managingEditor` _optional_ **string** Who manages content in this feed.
 * `webMaster` _optional_ **string** Who manages feed availability and technical support.
 * `copyright` _optional_ **string** Copyright information for this feed.
 * `language` _optional_ **string**  The language of the content of this feed.
 * `categories` _optional_ **array of strings**  One or more categories this feed belongs to.
 * `pubDate` _optional_ **Date object or date string** The publication date for content in the feed
 * `ttl` _optional_ **integer** Number of minutes feed can be cached before refreshing from source.
 * `hub` _optional_ **PubSubHubbub hub url** Where is the PubSubHub hub located.

#### Add items to a feed

An item can be used for a blog entry, project update, log entry, etc.  Your RSS feed
can have any number of items. Most feeds use 20 or fewer items.

```js
feed.item(itemOptions);
```

##### itemOptions

 * `title` **string** Title of this particular item.
 * `description` **string** Content for the item.  Can contain html but link and image urls must be absolute path including hostname.
 * `url` **url string** Url to the item. This could be a blog entry.
 * `guid` **unique string** A unique string feed readers use to know if an item is new or has already been seen.
 If you use a guid never change it.  If you don't provide a guid then your item urls must
 be unique.
 * `categories` _optional_ **array of strings** If provided, each array item will be added as a category element
 * `author` _optional_  **string**  If included it is the name of the item's creator.
 If not provided the item author will be the same as the feed author.  This is typical
 except on multi-author blogs.
 * `date` **Date object or date string** The date and time of when the item was created.  Feed
 readers use this to determine the sort order. Some readers will also use it to determine
 if the content should be presented as unread.
 * `lat` _optional_ **number** The latitude coordinate of the item.
 * `long` _optional_ **number** The longitude coordinate of the item.

##### Feed XML

```js
var xml = feed.xml(indent);
```

This returns the XML as a string.

`indent` _optional_ **string** What to use as a tab. Defaults to no tabs (compressed).
 For example you can use `'\t'` for tab character, or `'  '` for two-space tabs.


### Example Usage

```js
var RSS = require('rss');

/* lets create an rss feed */
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
    ttl: '60'
});

/* loop over data and add to feed */
feed.item({
    title:  'item title',
    description: 'use this for the content. It can include html.',
    url: 'http://example.com/article4?this&that', // link to the item
    guid: '1123', // optional - defaults to url
    categories: ['Category 1','Category 2','Category 3','Category 4'], // optional - array of item categories
    author: 'Guest Author', // optional - defaults to feed author property
    date: 'May 27, 2012', // any format that js Date can parse.
    lat: 33.417974, //optional latitude field for GeoRSS
    long: -111.933231, //optional longitude field for GeoRSS
    enclosure: {url:'...', file:'path-to-file'} // optional enclosure
});

// cache the xml to send to clients
var xml = feed.xml();
```





### Notes

 * You do not need to escape anything. This module will escape characters when necessary.
 * This module is very fast but you might as well cache the output of xml() and serve
 it until something changes.



### Inspiration

I started this module *years* ago (April 2011) because there weren't any Node modules
for creating RSS. [Nearly 50 modules](https://npmjs.org/browse/depended/rss)
use RSS, as well as many web sites and the popular [Ghost publishing platform](https://ghost.org/).



### Contributing

Contributions to the project are welcome. Feel free to fork and improve.
I do my best accept pull requests in a timely manor, especially when tests and updated docs
are included.



### About the Author

Hello fellow developer! My name is [Dylan Greene](https://github.com/dylang). When
not overwhelmed with my two kids I enjoy contributing to the open source community.
I'm a tech lead at [Opower](http://opower.com). I lead a team using Grunt and Angular to build software that
successfully helps people like us use less power.
Not too long ago I co-created [Doodle or Die](http://doodleordie.com), a hilarious web game with millions of
doodles that won us Node Knockout for the "most fun" category.
I'm [dylang](https://twitter.com/dylang) on Twitter and other places.

Some of my other Node projects:

| Name | Description | Github Stars | Npm Installs |
|---|---|--:|--:|
| [`grunt-notify`](https://github.com/dylang/grunt-notify) | Automatic desktop notifications for Grunt errors and warnings using Growl for OS X or Windows, Mountain Lion and Mavericks Notification Center, and Notify-Send. | 810 | 41,939 |
| [`grunt-prompt`](https://github.com/dylang/grunt-prompt) | Interactive prompt for your Grunt config using console checkboxes, text input with filtering, password fields. | 249 | 7,144 |
| [`shortid`](https://github.com/dylang/shortid) | Amazingly short non-sequential url-friendly unique id generator. | 268 | 11,035 |
| [`xml`](https://github.com/dylang/node-xml) | Fast and simple xml generator. Supports attributes, CDATA, etc. Includes tests and examples. | 57 | 22,645 |
| [`changelog`](https://github.com/dylang/changelog) | Command line tool (and Node module) that generates a changelog in color output, markdown, or json for modules in npmjs.org's registry as well as any public github.com repo. | 61 | 297 |
| [`npm-check`](https://github.com/dylang/npm-check) | Check for outdated, incorrect, and unused dependencies. | _New!_ | 237 |
| [`grunt-attention`](https://github.com/dylang/grunt-attention) | Display attention-grabbing messages in the terminal | _New!_ | 7,906 |
| [`logging`](https://github.com/dylang/logging) | Super sexy color console logging with cluster support. | 24 | 239 |
| [`observatory`](https://github.com/dylang/observatory) | Beautiful UI for showing tasks running on the command line. | 31 | 6,624 |
| [`flowdock-refined`](https://github.com/dylang/flowdock-refined) | Flowdock desktop app custom UI | _New!_ | 49 |
| [`anthology`](https://github.com/dylang/anthology) | Module information and stats for any @npmjs user | _New!_ | 244 |
| [`grunt-cat`](https://github.com/dylang/grunt-cat) | Echo a file to the terminal. Works with text, figlets, ascii art, and full-color ansi. | _New!_ | 235 |

_This list was generated using [anthology](https://github.com/dylang/anthology)._


### License
Copyright (c) 2014 Dylan Greene, contributors.

Released under the [MIT license](https://tldrlegal.com/license/mit-license).

Screenshots are [CC BY-SA](http://creativecommons.org/licenses/by-sa/4.0/) (Attribution-ShareAlike).

***
_Generated using [grunt-readme](https://github.com/assemble/grunt-readme) with [grunt-templates-dylang](https://github.com/dylang/grunt-templates-dylang) on Tuesday, October 21, 2014._ [![Bitdeli Badge](https://d2weczhvl823v0.cloudfront.net/dylang/rss/trend.png)](https://bitdeli.com/free "Bitdeli Badge") [![Google Analytics](https://ga-beacon.appspot.com/UA-4820261-3/dylang/rss)](https://github.com/igrigorik/ga-beacon)

