# RSS for Node

  Fast and simple Javascript-based RSS generator/builder for Node projects.

## Install

    $ npm install rss

## Tests

 Use [nodeunit](https://github.com/caolan/nodeunit) to run the tests.

    $ npm install nodeunit
    $ nodeunit test

## Usage

    var RSS = require('rss');

    /* lets create an rss feed */
    var feed = new RSS({
            title: 'title',
            description: 'description',
            feed_url: 'http://example.com/rss.xml',
            site_url: 'http://example.com',
            image_url: 'http://example.com/icon.png',
            docs: 'http://example.com/rss/docs.html',
            author: 'Dylan Greene',
            managingEditor: 'Dylan Green',
            webMaster: 'Dylan Green',
            copyright: '2013 Dylan Green',
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
        date: 'May 27, 2012' // any format that js Date can parse.
        enclosure : {url:'...', file:'path-to-file'} // optional
    });

    // cache the xml
    var xml = feed.xml();

### Feed Options

 * _title_ <string> Title of your site or feed
 * _description_ <string> Optional. Short description of the feed.
 * _feed_url_ <url> Url to the rss feed.
 * _site_url_ <url> Url to the site that the feed is for.
 * _image_url_ <url> Optional. Small image for feed readers to use.
 * _docs_ <url> Optional. Url to documentation on this feed.
 * _author_ <string> Who owns this feed.
 * _managingEditor_ <string> Optional. Who manages content in this feed.
 * _webMaster_ <string> Optional. Who manages feed availability and technical support.
 * _copyright_ <string> Optional. Copyright information for this feed.
 * _language_ <string> Optional. The language of the content of this feed.
 * _categories_ <array> Optional. One or more categories this feed belongs to.
 * _pubDate_ <Date object or date string> Optional. The publication date for content in the feed
 * _ttl_ <int> Optional. Number of minutes feed can be cached before refreshing from source.

### Item Options

In RSS an item can be used for a blog entry, project update, log entry, etc.  Your rss feed
an have any number of items. Ten to tenty is usually good.

 * _title_ <string> Title of this particular item.
 * _description_ <string> Content for the item.  Can contain html but link and image urls must include the server name.
 (Note: I might change this to content in the next release.)
 * _url_ <url> Url to the item. This could be a blog entry.
 * _guid_ <unique string> A unique string feed readers use to know if an item is new or has already been seen.
 If you use a guid never change it.  If you don't provide a guid then your item urls must
 be unique.
 * _categories_ <array> Optional. If provided, each array item will be added as a category element
 * _author_ <string> Optional.  If included it is the name of the item's creator.
 If not provided the item author will be the same as the feed author.  This is typical
 except on multi-author blogs.
 * _date_ <Date object or date string> The date and time of when the item was created.  Feed
 readers use this to determine the sort order. Some readers will also use it to determine
 if the content should be presented as unread.

### Methods

 * _item(item_options)_ - add an rss item, article, entry etc.
 * _xml([indent])_ - return the xml.  If you pass in true it will use four spaces for indenting. If you prefer
 tabs use \t instead of true.

## Notes
 * You do not need to escape anything. This module will escape characters when necessary.
 * This module is very fast but you might as well cache the output of xml() and serve
 it until something changes.

# Contributing

Contributions to the project are welcome. Feel free to fork and improve.
I accept pull requests when tests and updated docs are included.

I'm not actively adding features to this module. If you would like to take over maintaining it
just let me know.

# License

(The MIT License)

Copyright (c) 2011-2013 Dylan Greene <dylang@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.