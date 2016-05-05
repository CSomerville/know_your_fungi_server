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
  /*  @return { Function }
      notes: wrapper for recursion */
  let speciesMasterList = [];

  return function getOnePage(urlFragment, done) {
    /*  @param { String } url
        @param { Function } -
                  @param { Error | null }
                  @param { Array : String } url fragments (species pages)
        notes: calls itself on next page; if no next page, calls done */

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
  /*  @param { Function } parsed DOM returned by cheerio.load()
      @return { Array : String } urlFragments */

  const speciesAnchors = $('#mw-pages').find('.mw-content-ltr').find('a');
  let speciesLinksList = [];

  for (let i = 0; i < speciesAnchors.length; i++) {
    speciesLinksList.push(speciesAnchors[i].attribs.href);
  }

  return speciesLinksList;
}

function getNextPage($) {
  /*  @param { Function } parsed DOM returned by cheerio.load()
      @return { Array : DOMNode } anchor tags with text value of 'next page' */
      
  const allLinks = $('#mw-pages').find('a');
  return Array.from(allLinks).filter(el => {
    return $(el).text() === 'next page';
  });
}
