/*
 Documentation coming soon.
*/
var XML        = require('xml');

function RSS (options, items) {
    var that = this
      , keys = options ? Object.keys(options) : [];
    keys.forEach(function(key){
        that[key] = options[key];
    });
    if (!this.title)           this.title       = 'Untitled RSS Feed';
    if (!this.description)     this.description = '';
    if (!this.items)           this.items       = [];

    this.item = function (options) {
        var item = {};
        var itemKeys = options ? Object.keys(options) : [];
        itemKeys.forEach(function(key){
            item[key] = options[key];
        });
        if (!item.title)           item.title       = 'No title';
        if (!item.description)     item.description = '';
        if (!item.categories)      item.categories  = [];

        this.items.push(item);
        return this;
    };

    this.xml = function(indent) {
        return '<?xml version="1.0" encoding="UTF-8"?>\n'
                + XML(generateXML(this), indent);
    };

    this.xmlAddAttr = function (attrKey, attrValue) {
        if (!this._xmlAttr) this._xmlAttr = {};
        this._xmlAttr[attrKey] = attrValue;
    };
};

function ifTruePush(bool, array, data) {
    if (bool) {
        array.push(data);
    }
}

function removeFromArray(arr, subSetArr) {
    subSetArr.forEach(function(element){
        var idx = arr.indexOf(element);
        if (idx!=-1) arr.splice(idx, 1);
    });
};

function generateXML (data) {
    // todo: xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"

    var channel = [];
    channel.push({ title:           { _cdata: data.title } });
    channel.push({ description:     { _cdata: data.description || data.title } });
    channel.push({ link:            data.site_url || 'http://github.com/dylan/node-rss' });
    // image_url set?
    if (data.image_url) {
        channel.push({ image:  [ {url: data.image_url}, {title: data.title}, {link: data.site_url} ] });
    }
    channel.push({ generator:       'NodeJS RSS Module' });
    channel.push({ lastBuildDate:   new Date().toGMTString() });

    ifTruePush(data.feed_url, channel, { 'atom:link':  { _attr: { href: data.feed_url, rel: 'self', type: 'application/rss+xml' } } });
    //            { updated:      new Date().toGMTString() }

    data.items.forEach(function(item) {
        var item_values = []
          , itemKeys    = Object.keys(item);

        // We process certain keys first (order matters here)
        item_values.push({ title : { _cdata : item.title } });
        ifTruePush(item.description, item_values, { description:  { _cdata: item.description } });
        ifTruePush(item.url, item_values, { link: item.url });
        ifTruePush(item.link || item.guid || item.title, item_values, { guid:         [ { _attr: { isPermaLink: !item.guid && !!item.url } }, item.guid || item.url || item.title ]  });
        ifTruePush(item.author || data.author, item_values, { 'dc:creator': { _cdata: item.author || data.author } });
        ifTruePush(item.date, item_values, { pubDate:      new Date(item.date).toGMTString() });

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
                  , 'version'       : '2.0'
                  };

    if (data._xmlAttr) {
        var xmlAttrKeys = Object.keys(data._xmlAttr);
        xmlAttrKeys.forEach(function (key) {
            xmlAttr[key] = data._xmlAttr[key];
        })
    }

    return  { rss: [ { _attr   : xmlAttr }
                   , { channel : channel }
                   ]
            };
};

module.exports = RSS;
