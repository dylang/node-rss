## rss  [![Build Status](http://img.shields.io/travis/dylang/node-rss.svg)](https://travis-ci.org/dylang/node-rss) [![rss](http://img.shields.io/npm/dm/rss.svg)](https://www.npmjs.org/package/rss)

> RSS feed generator. Add RSS feeds to any project. Supports enclosures and GeoRSS.








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
 * `custom_namespaces` _optional_ **object** Put additional namespaces in <rss> element (without 'xmlns:' prefix)
 * `custom_elements` _optional_ **array** Put additional elements in the feed (node-xml syntax)
 * `no_cdata_fields` _optional_ **array** Field names that shouldn't be wrapped with CDATA tag. The data will be escaped for XML. Default is to wrap with CDATA. You should only use this to work around problematic XML clients.

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
 * `custom_elements` _optional_ **array** Put additional elements in the item (node-xml syntax)

###### Add single item
```js
feed.item(itemOptions);
```
###### Concatenate an array of items
```js
feed.addItems(arrayOfItemOptions);
```
###### Delete all items
```js
feed.removeAllItems();
```

##### Feed XML
```js
var xml = feed.xml({indent: true});
```

This returns the XML as a string.

`indent` _optional_ **boolean or string** What to use as a tab. Defaults to no tabs (compressed).
For example you can use `'\t'` for tab character, or `'  '` for two-space tabs. If you set it to
`true` it will use four spaces.



### Example Usage
(examples/simple.js)
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
    enclosure: {url:'...', file:'path-to-file'}, // optional enclosure
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

Hi! Thanks for checking out this project! My name is **Dylan Greene**. When not overwhelmed with my two young kids I enjoy contributing
to the open source community. I'm also a tech lead at [Opower](http://opower.com). [![@dylang](https://img.shields.io/badge/github-dylang-green.svg)](https://github.com/dylang) [![@dylang](https://img.shields.io/badge/twitter-dylang-blue.svg)](https://twitter.com/dylang)

Here's some of my other Node projects:

| Name | Description | npm&nbsp;Downloads |
|---|---|--:|--:|
| [`grunt‑notify`](https://github.com/dylang/grunt-notify) | Automatic desktop notifications for Grunt errors and warnings using Growl for OS X or Windows, Mountain Lion and Mavericks Notification Center, and Notify-Send. | [![grunt-notify](https://img.shields.io/npm/dm/grunt-notify.svg?style=flat-square)](https://www.npmjs.org/package/grunt-notify) |
| [`grunt‑prompt`](https://github.com/dylang/grunt-prompt) | Interactive prompt for your Grunt config using console checkboxes, text input with filtering, password fields. | [![grunt-prompt](https://img.shields.io/npm/dm/grunt-prompt.svg?style=flat-square)](https://www.npmjs.org/package/grunt-prompt) |
| [`shortid`](https://github.com/dylang/shortid) | Amazingly short non-sequential url-friendly unique id generator. | [![shortid](https://img.shields.io/npm/dm/shortid.svg?style=flat-square)](https://www.npmjs.org/package/shortid) |
| [`npm‑check`](https://github.com/dylang/npm-check) | Check for outdated, incorrect, and unused dependencies. | [![npm-check](https://img.shields.io/npm/dm/npm-check.svg?style=flat-square)](https://www.npmjs.org/package/npm-check) |
| [`xml`](https://github.com/dylang/node-xml) | Fast and simple xml generator. Supports attributes, CDATA, etc. Includes tests and examples. | [![xml](https://img.shields.io/npm/dm/xml.svg?style=flat-square)](https://www.npmjs.org/package/xml) |
| [`changelog`](https://github.com/dylang/changelog) | Command line tool (and Node module) that generates a changelog in color output, markdown, or json for modules in npmjs.org's registry as well as any public github.com repo. | [![changelog](https://img.shields.io/npm/dm/changelog.svg?style=flat-square)](https://www.npmjs.org/package/changelog) |
| [`grunt‑attention`](https://github.com/dylang/grunt-attention) | Display attention-grabbing messages in the terminal | [![grunt-attention](https://img.shields.io/npm/dm/grunt-attention.svg?style=flat-square)](https://www.npmjs.org/package/grunt-attention) |
| [`observatory`](https://github.com/dylang/observatory) | Beautiful UI for showing tasks running on the command line. | [![observatory](https://img.shields.io/npm/dm/observatory.svg?style=flat-square)](https://www.npmjs.org/package/observatory) |
| [`anthology`](https://github.com/dylang/anthology) | Module information and stats for any @npmjs user | [![anthology](https://img.shields.io/npm/dm/anthology.svg?style=flat-square)](https://www.npmjs.org/package/anthology) |
| [`grunt‑cat`](https://github.com/dylang/grunt-cat) | Echo a file to the terminal. Works with text, figlets, ascii art, and full-color ansi. | [![grunt-cat](https://img.shields.io/npm/dm/grunt-cat.svg?style=flat-square)](https://www.npmjs.org/package/grunt-cat) |

_This list was generated using [anthology](https://github.com/dylang/anthology)._


### License
Copyright (c) 2015 Dylan Greene, contributors.

Released under the [MIT license](https://tldrlegal.com/license/mit-license).

Screenshots are [CC BY-SA](http://creativecommons.org/licenses/by-sa/4.0/) (Attribution-ShareAlike).

***
_Generated using [grunt-readme](https://github.com/assemble/grunt-readme) with [grunt-templates-dylang](https://github.com/dylang/grunt-templates-dylang) on Sunday, February 8, 2015._
_To make changes to this document look in `/templates/readme/`

