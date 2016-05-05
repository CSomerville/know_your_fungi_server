const request = require('request');
const cheerio = require('cheerio');

module.exports = function obtainLinks(urls, done) {
  /*  @param { Array : String } url fragments
      @param { Function } -
                @param { Error | null }
                @param { Array : String } url fragments (species pages) */

  const base = "https://en.wikipedia.org";
  
  urls.forEach(str => {
    request.get(base + str, (err, res, body) => {

      if (err) {
        done(err);
      } else if (res.statusCode !== 200) {
        done(new Error("Request failed with status:" + res.statusCode));
      } else {

        const $ = cheerio.load(body);
        const speciesAnchors = $('#mw-pages').find('.mw-content-ltr').find('a');

        let speciesLinks = [];

        for (let i = 0; i < speciesAnchors.length; i++) {
          speciesLinks.push(speciesAnchors[i].attribs.href);
        }

        done(null, speciesLinks);
      }
    });
  });
}
