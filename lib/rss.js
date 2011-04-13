/*
 Documentation coming soon.
*/

var XML        = require('xml'),
    log        = require('logging').from(__filename);

function RSS () {

    var site = {
        title: '',
        url: '',
        description: ''
    };

    var feed = {
        url: ''
    };

    var author = {

    };


    var rss = {
        title:          '',
        description:    '',
        link:           '',
        author: {
            name:       'string',
            uri:        'uri',
            email:      'email'
        },
        image: {
            url:        'url',
            title:      'text',
            link:       'url'
        },
        items:           []
        };

    Object.defineProperty(this, "items", {
                get : function(){ return rss.items; },
                set : function(new_items){ rss.items = new_items; },
                enumerable : true
            });



    this.item = function (item) {

        item = item || {
            title:          'cdata',
            link:           'url',
            source:         'source',
            description:    'cdata',
            categories:     ['category'],
            guid:           { permaLink: true, guid: 'guid'},
            comments:       'comments',
            author:         'author',
            date:           new Date()
        };

        rss.items.push(item);
    };

    this.xml = function(indent) {
        return '<?xml version="1.0" encoding="UTF-8"?>\n' + XML(generateXML(rss), indent);
    }

}


function generateXML (rss){
    // todo: xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"

    var channel = [
            { title:        rss.title },
            { description:  rss.description },
            { generator:    'NodeJS RSS Module' },
            { 'atom:link':  { _attr: { href: rss.url, rel: 'self', type: 'application/rss+xml' } } },
            { link:         rss.link },
            { updated:      new Date().toISOString() },
            { author:       [
                            { name:     rss.author.name},
                            { uri:      rss.author.uri },
                            { email:    rss.author.email }
                            ]}
        ];
    
    rss.items.forEach(function(item) {

        //TODO: categories

        channel.push({ item: [
                    { title:        { _cdata: item.title } },
                    { link:         item.link },
                    { guid:         [ { _attr: { isPermaLink: item.guid.permaLink } }, item.guid.guid ]  },
                    { comments:     item.comments },
                    { description:  { _cdata: item.description } },
                    { 'dc:creator': { _cdata: item.author } },
                    { pubDate:      item.date.toISOString() }
                ]});
    });

    return { rss: [
        { _attr: {
            'xmlns:dc':         'http://purl.org/dc/elements/1.1/',
            'xmlns:content':    'http://purl.org/rss/1.0/modules/content/',
            'xmlns:atom':       'http://www.w3.org/2005/Atom',
            version: '2.0'
             } },
        { channel: channel }
    ] };
}



module.exports = RSS;
