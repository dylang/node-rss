'use strict';

var xml         = require('xml'),
    mime        = require('mime'),
    fs          = require('fs'),
    _           = require('underscore');

function ifTruePush(bool, array, data) {
    if (bool) {
        array.push(data);
    }
}

function ifTruePushArray(bool, array, dataArray) {
  if(!bool) {
    return;
  }

  dataArray.forEach(function(item) {
    ifTruePush(item, array, item);
  });
}

function generateXML (data){
    // Field names that should not be CDATA wrapped
    var no_cdata_fields = data.no_cdata_fields || [];

    // Handle formatting of CDATA-able output
    function output(field_name, value) {
        if (!value) {
            return;
        }
        var ret_value = {};
        if (no_cdata_fields.indexOf(field_name) !== -1) {
            ret_value[field_name] = value;
        } else {
            ret_value[field_name] = { _cdata: value }; // CDATA
        }
        return ret_value;
    }

    var channel = [];
    channel.push( output('title', data.title) );
    channel.push( output('description', (data.description || data.title)) );
    channel.push({ link: data.site_url || 'http://github.com/dylang/node-rss' });
    // image_url set?
    if (data.image_url) {
        channel.push({ image:  [ {url: data.image_url}, {title: data.title},  {link: data.site_url} ] });
    }
    channel.push({ generator:       data.generator });
    channel.push({ lastBuildDate:   new Date().toGMTString() });

    ifTruePush(data.feed_url, channel, { 'atom:link': { _attr: { href: data.feed_url, rel: 'self', type: 'application/rss+xml' } } });
    ifTruePush(data.author, channel, output('author', data.author));
    ifTruePush(data.pubDate, channel, { 'pubDate': new Date(data.pubDate).toGMTString() });
    ifTruePush(data.copyright, channel, output('copyright', data.copyright) );
    ifTruePush(data.language, channel, output('language', data.language) );
    ifTruePush(data.managingEditor, channel, output('managingEditor', data.managingEditor) );
    ifTruePush(data.webMaster, channel, output('webMaster', data.webMaster) );
    ifTruePush(data.docs, channel, { 'docs': data.docs });
    ifTruePush(data.ttl, channel, { 'ttl': data.ttl });
    ifTruePush(data.hub, channel, { 'atom:link': { _attr: { href: data.hub, rel: 'hub' } } });

    if (data.categories) {
        data.categories.forEach(function(category) {
            ifTruePush(category, channel, output('category', category));
        });
    }

    ifTruePushArray(data.custom_elements, channel, data.custom_elements);

    data.items.forEach(function(item) {
        var item_values = [ output('title', item.title) ];
        ifTruePush(item.description, item_values, output('description', item.description));
        ifTruePush(item.url, item_values, { link: item.url });
        ifTruePush(item.link || item.guid || item.title, item_values, { guid:         [ { _attr: { isPermaLink: !item.guid && !!item.url } }, item.guid || item.url || item.title ]  });

        item.categories.forEach(function(category) {
            ifTruePush(category, item_values, output('category', category));
        });

        ifTruePush(item.author || data.author, item_values, output('dc:creator', (item.author || data.author)) );
        ifTruePush(item.date, item_values, { pubDate:      new Date(item.date).toGMTString() });

        //Set GeoRSS to true if lat and long are set
        data.geoRSS = data.geoRSS || (item.lat && item.long);
        ifTruePush(item.lat, item_values, {'geo:lat': item.lat});
        ifTruePush(item.long, item_values, {'geo:long': item.long});

        if( item.enclosure && item.enclosure.url ) {
            if( item.enclosure.file ) {
                item_values.push({
                    enclosure : {
                        _attr : {
                            url : item.enclosure.url,
                            length : fs.statSync(item.enclosure.file).size,
                            type : mime.lookup(item.enclosure.file)
                        }
                    }
                });
            } else {
                item_values.push({
                    enclosure : {
                        _attr : {
                            url : item.enclosure.url,
                            length : item.enclosure.size || 0,
                            type : mime.lookup(item.enclosure.url)
                        }
                    }
                });
            }
        }

        ifTruePushArray(item.custom_elements, item_values, item.custom_elements);

        channel.push({ item: item_values });

    });

    //set up the attributes for the RSS feed.
    var _attr = {
        'xmlns:dc':         'http://purl.org/dc/elements/1.1/',
        'xmlns:content':    'http://purl.org/rss/1.0/modules/content/',
        'xmlns:atom':       'http://www.w3.org/2005/Atom',
        version: '2.0'
    };

    Object.keys(data.custom_namespaces).forEach(function(name) {
      _attr['xmlns:' + name] = data.custom_namespaces[name];
    });

    //only add namespace if GeoRSS is true
    if(data.geoRSS){
        _attr['xmlns:geo'] = 'http://www.w3.org/2003/01/geo/wgs84_pos#';
    }

    return {
        rss: [
            { _attr: _attr },
            { channel: channel }
        ]
    };
}

function RSS (options, items) {
    options = options || {};

    this.title              = options.title || 'Untitled RSS Feed';
    this.description        = options.description || '';
    this.generator          = options.generator || 'RSS for Node';
    this.feed_url           = options.feed_url;
    this.site_url           = options.site_url;
    this.image_url          = options.image_url;
    this.author             = options.author;
    this.categories         = options.categories;
    this.pubDate            = options.pubDate;
    this.hub                = options.hub;
    this.docs               = options.docs;
    this.copyright          = options.copyright;
    this.language           = options.language;
    this.managingEditor     = options.managingEditor;
    this.webMaster          = options.webMaster;
    this.ttl                = options.ttl;
    //option to return feed as GeoRSS is set automatically if feed.lat/long is used
    this.geoRSS             = options.geoRSS || false;
    this.custom_namespaces  = options.custom_namespaces || {};
    this.custom_elements    = options.custom_elements || [];
    this.no_cdata_fields    = options.no_cdata_fields || [];
    this.items              = items || [];

    this.item = function (options) {
        options = options || {};
        var item = {
            title:            options.title || 'No title',
            description:      options.description || '',
            url:              options.url,
            guid:             options.guid,
            categories:       options.categories || [],
            author:           options.author,
            date:             options.date,
            lat:              options.lat,
            long:             options.long,
            enclosure:        options.enclosure || false,
            custom_elements:  options.custom_elements || []
        };

        this.items.push(item);
        return this;
    };

    // replace items
    this.replace_items = function(items) {
        items = items || [];
        if (items && items.length > 0) {
            this.items = [];
            return this.concat_items(items);
        } else {
            return this;
        }
    };

    // Concat new items to this.items
    this.concat_items = function (items) {
        var self = this;
        items = items || [];
        if (items && items.length > 0) {
            items.forEach(function(item){
                self.item(item);
            });
        }
        return this;
    };

    this.xml = function(indent) {
        return '<?xml version="1.0" encoding="UTF-8"?>\n' +
            xml(generateXML(this), indent);
    };
}

module.exports = RSS;
