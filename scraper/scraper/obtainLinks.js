const request = require('request');
const cheerio = require('cheerio');

const BASE = "https://en.wikipedia.org";

module.exports = function obtainLinks(urls, done) {
  /*  @param { Array : String } url fragments
      @param { Function } -
                @param { Error | null }
                @param { Array : String } url fragments (species pages) */

  urls.forEach(str => {

    const getOnePage = manageObtainLinks();
    getOnePage(str, done);

  });
}

function manageObtainLinks() {
  // wrapper function to recursively scrape paginated species lists
  let speciesMasterList = [];

  return function getOnePage(urlFragment, done) {
    // Scrapes one page. Calls itself on next page, or done if no next page.

    request.get(BASE + urlFragment, (err, res, body) => {

      if (err) {
        done(err);
      } else if (res.statusCode !== 200) {
        done(new Error("response status: " + res.statusCode));
      } else {

        const $ = cheerio.load(body);

        speciesMasterList = speciesMasterList.concat(speciesLinks($));

        const nextPage = getNextPage($);

        if (nextPage.length) {
          const nextUrlFrag = nextPage[0].attribs.href;
          getOnePage(nextUrlFrag, done);
        } else {
          done(null, speciesMasterList);
        }
      }
    });
  }
}

function speciesLinks($) {
  const speciesAnchors = $('#mw-pages').find('.mw-content-ltr').find('a');
  let speciesLinksList = [];

  for (let i = 0; i < speciesAnchors.length; i++) {
    speciesLinksList.push(speciesAnchors[i].attribs.href);
  }

  return speciesLinksList;
}

function getNextPage($) {
  const allLinks = $('#mw-pages').find('a');
  return Array.from(allLinks).filter(el => {
    return $(el).text() === 'next page';
  });
}
