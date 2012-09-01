
//
// Module Dependencies
var XML = require('xml');

/*
 * Module Constructor
 *
 * @param {Object} options
 * @param {Object} items
 *
 */
function RSS (options, items) {
    appendKeysToObject(options, this);
    if (!this.title)           this.title       = 'Untitled RSS Feed';
    if (!this.description)     this.description = '';
    if (!this.items)           this.items       = [];

    // Adds a item to the feed
    this.item = function (itemOptions) {
        var newItem = {};
        appendKeysToObject(itemOptions, newItem);
        if (!newItem.title)           newItem.title       = 'No title';
        if (!newItem.description)     newItem.description = '';
        if (!newItem.categories)      newItem.categories  = [];

        this.items.push(newItem);
        return this;
    };

    // Adds an Attribute to XML RSS Header
    this.xmlAddAttr = function (attrKey, attrValue) {
        if (!this._xmlAttr) this._xmlAttr = {};
        this._xmlAttr[attrKey] = attrValue;
    };

    // Generates XML File
    this.xml = function(indent) {
        return '<?xml version="1.0" encoding="UTF-8"?>\n'
                + XML(generateXML(this), indent);
    };

};

// If the field exists, then its data is pushed into array
function ifTruePush (bool, array, data) {
    if (bool) {
        array.push(data);
    }
};

// Removes elements belonging to array subSetArr from array arr
function removeFromArray (arr, subSetArr) {
    subSetArr.forEach(function(element){
        var idx = arr.indexOf(element);
        if (idx!=-1) arr.splice(idx, 1);
    });
};

// Append the keys from srcObj object to dstObj object
function appendKeysToObject (srcObj, dstObj) {
    var keys = srcObj ? Object.keys(srcObj) : [];
    keys.forEach(function(key){
        dstObj[key] = srcObj[key];
    });
};

// Generates XML file from RSS Object
function generateXML (data) {
    // todo: xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"

    var channel = [];
    channel.push({ title       : { _cdata: data.title } });
    channel.push({ description : { _cdata: data.description || data.title } });
    channel.push({ link        :  data.site_url
                               || 'http://github.com/dylan/node-rss' });
    // image_url set?
    if (data.image_url) {
        channel.push( { image:  [ { url   : data.image_url }
                                , { title : data.title }
                                , { link  : data.site_url }
                                ]
                      });
    }
    channel.push({ generator:       'NodeJS RSS Module' });
    channel.push({ lastBuildDate:   new Date().toGMTString() });

    ifTruePush( data.feed_url
              , channel
              , { 'atom:link' : { _attr: { href: data.feed_url
                                         , rel: 'self'
                                         , type: 'application/rss+xml'
                                         }
                                }
                 }
    );
    // { updated: new Date().toGMTString() }

    data.items.forEach(function(item) {
        var item_values = []
          , itemKeys    = Object.keys(item);

        // We process certain keys first (order matters here)
        item_values.push({ title : { _cdata : item.title } });
        ifTruePush( item.description
                  , item_values
                  , { description: { _cdata: item.description } });
        ifTruePush( item.url, item_values, { link: item.url });
        ifTruePush( item.link || item.guid || item.title
                  , item_values
                  , { guid :  [ { _attr: { isPermaLink: !item.guid && !!item.url } }
                               , item.guid || item.url || item.title
                              ]
                    }
        );
        ifTruePush( item.author || data.author
                  , item_values
                  , { 'dc:creator': { _cdata: item.author || data.author } });
        ifTruePush( item.date
                  , item_values
                  , { pubDate:      new Date(item.date).toGMTString() });

        var keysToRemove =  [ 'title', 'description', 'url', 'link', 'guid'
                            , 'author', 'date', 'categories'];

        removeFromArray(itemKeys, keysToRemove);

        // Now, we are left with the other keys
        itemKeys.forEach(function(key){
            var obj = {};
            obj[key] = item[key];
            item_values.push(obj);
        });

        channel.push({ item: item_values });
    });

    var xmlAttr = { 'xmlns:dc'      : 'http://purl.org/dc/elements/1.1/'
                  , 'xmlns:content' : 'http://purl.org/rss/1.0/modules/content/'
                  , 'xmlns:atom'    : 'http://www.w3.org/2005/Atom'
                  };

    if (data._xmlAttr) appendKeysToObject(data._xmlAttr, xmlAttr);

    xmlAttr['version'] = '2.0';

    return  { rss: [ { _attr   : xmlAttr }
                   , { channel : channel }
                   ]
            };
};

module.exports = RSS;
