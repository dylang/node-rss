var RSS = require('../lib/');

// Create RSS Feed Meta
var feed = new RSS({
    title: 'title',
    description: 'description',
    custom_namespaces   : {
      "content"   : "http://purl.org/rss/1.0/modules/content/"
    },
});

// Add an item/article to the feed with a custom_element
feed.item({
    title:  'Item Title ',
    description: 'The description',
    custom_elements: [
      {
        "content:encoded":
            {
                _cdata: "This is the long content. <b>This & That</b>"
            }
      }
    ]
});

// generate xml with default indent (4 sp)
var xml = feed.xml({indent: true});
console.log(xml);
