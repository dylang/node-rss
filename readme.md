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

    // new feed
    var feed = new RSS(feed_options);

    // add your items/entries/articles.
    feed.item(item_options)
       .item(item_options);

    // cache the result
    var xml = feed.xml();


### feed_options

        var RSS = require('rss');

        // new feed
        var rss = new RSS({
            title: 'title',
            description: 'description',
            feed_url: 'http://example.com/rss.xml',
            site_url: 'http://example.com',
            image_url: 'http://example.com/icon.png',
            author: 'Dylan Greene'
        });


### item_options

    rss.item({
        title:  'item title',
        description: 'use this for the content. It can include html.',
        url: 'http://example.com/article4?this&that', // link to the item
        guid: '1123', // optional - defaults to url
        author: 'Guest Author', // optional - defaults to feed author property
        date: 'May 27, 2012' // any format that js Date can parse.
    });


### Methods

 * _item(item_options)_ - add an rss item, article, entry etc.
 * _xml([indent])_ - return the xml.  If you pass in true it will use four spaces for indenting. If you prefer
 tabs use \t instead of true.

## Notes
 * You do not need to escape anything. This module will escape characters when necessary.

## Upcoming features

 * Atom support
 * Feed validation
 * More customization

# Contributing

Contributions to the project are welcome. Feel free to fork and improve. I accept pull requests and issues,
especially when tests are included.

# License

(The MIT License)

Copyright (c) 2011 Dylan Greene <dylang@gmail.com>

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