const request = require('request');
const cheerio = require('cheerio');

module.exports = function obtainSpecies(urlList, done) {

  const base = "https://en.wikipedia.org";

  urlList.forEach(url => {

    request.get(base + url, (err, res, body) => {

      if (err) {
        done(err);
      } else if (res.statusCode !== 200) {
        done(new Error('response did not return status 200'));
      } else {

        const speciesData = parseInfoBox(body);
        done(null, speciesData);
      }
    });
  });
}

function parseInfoBox(body) {
  /* arg is html string.
     return is { String } representing species data */

  const $ = cheerio.load(body);
  const infoBox = $('.infobox');

  let values = {};
  const dataFields = [
    'kingdom', 'division', 'class', 'order', 'family', 'genus', 'species'
  ];

  dataFields.forEach(str => {
    let content = $('.' + str).text();
    if (content) values[str] = content;
  });

  const imageSrc = infoBox.find('img').attr('src');
  if (imageSrc) values['imageSource'] = imageSrc;

  return values;
}
