require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// access form data | custom
const bodyParser = require('body-parser'); 
app.use( bodyParser.urlencoded({extended:true}) ); 


// Basic Configuration
const port = process.env.PORT || 3000;

//---------------- boilerplate ----------------

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});

//---------------- custom code ---------------
// global variable
let stored_url = []; // index is short url

// Ref: https://www.freecodecamp.org/news/check-if-a-javascript-string-is-a-url/
function isValidUrl(urlString) {
  var urlPattern = new RegExp('^(https?:\\/\\/)?'+ // validate protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // validate domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // validate OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // validate port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // validate query string
  '(\\#[-a-z\\d_]*)?$','i'); // validate fragment locator
  return !!urlPattern.test(urlString);
}

// Store URLS into variable
app.post("/api/shorturl",  
  function (req, res) {
    console.log("submitted text");
    var url = req.body.url;
    //console.log(url);
  
    // valid input
    if( isValidUrl(url) ) {
      // compress url
      stored_url.push(url);
      var short_url = stored_url.length;
      //console.log(stored_url);

      res.json({
        original_url: url,
        short_url: short_url
      });

    // bad input
    } else {
      res.json({
        error: 'invalid url'
      });
    }
  }
);

// access url
app.get("/api/shorturl/:number",
  function( req, res ) {
    var index = req.params.number;
    var length = stored_url.length;
    //console.log(index);
    
    // check short url
    if( index >= 1 && index <= length ) {

      var url = stored_url[index-1];
      res.redirect(url);

    // bad url
    } else {
      res.json({
        error: "bad short url"
      });
    }
  }
);
