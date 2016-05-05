const request = require('request');
const cheerio = require('cheerio');

module.exports = function obtainContinents(done) {
  /* @param { Function } -
                @param { Error | null }
                @param { Array : String | null } url fragments */

  const url = "https://en.wikipedia.org/wiki/Category:Fungi_by_continent";

  request.get(url, (err, res, body) => {

    if (err) {
      done(err);
    } else if (res.statusCode !== 200) {
      done(new Error("Request failed with status:" + res.statusCode));
    } else {

      const $ = cheerio.load(body);
      const continentAnchors = $('.mw-category').find('a');

      const continentUrls = Array.from(continentAnchors).map(el => {
        return el.attribs.href;
      });

      done(null, continentUrls);
    }
  });
}
