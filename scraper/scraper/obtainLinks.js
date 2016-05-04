const request = require('request');
const cheerio = require('cheerio');

module.exports = function obtainLinks(done) {
  /*  done is an err data callback. Data is [ String ] of hrefs */


  const url = 'https://en.wikipedia.org/wiki/Category:Fungi_of_Antarctica';

  request.get(url, (err, res, body) => {

    if (err) {
      done(err);
    } else if (res.statusCode !== 200) {
      done(new Error('response did not return status 200'));
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
}
