const obtainContinents = require('./scraper/obtainContinents');
const obtainLinks = require('./scraper/obtainLinks');
const obtainSpecies = require('./scraper/obtainSpecies');
const queries = require('./db/queries');

main();

function main() {
  obtainContinents((err, continentUrls) => {

    if (err) {
      console.warn(err);
    } else {

      let speciesList = [];
      const numContinents = continentUrls.length;
      let resCtr = 0;

      obtainLinks(continentUrls, (err, speciesUrls) => {
        if (err) {
          resCtr++;
          console.warn(err);
        } else {

          resCtr++;
          speciesList = speciesList.concat(speciesUrls);

          if (resCtr >= numContinents) {
            const uniqueSpecies = uniq(speciesList);
            console.log(`# of unique species: ${uniqueSpecies.length}`);
            throttleQueries(uniqueSpecies);
          }
        }
      });
    }
  });
}

function throttleQueries(speciesList) {

  const STEP_SIZE = 100;
  const len = speciesList.length;
  let ctr = 0;

  const interval = setInterval(() => {

    if (ctr >= len) {
      clearInterval(interval);
      return;
    }
    console.log(ctr);
    const urlList = speciesList.slice(ctr, ctr+STEP_SIZE);
    obtainSpecies(urlList, (err, speciesData) => {

      if (err) {
        console.warn(err);
      } else {
        queries.insertRawData(speciesData)
          .catch(err => console.warn(err));
      }
    });

    ctr += STEP_SIZE;

  }, 60*1000);

}


function uniq(a) {
  const encountered = {};
  return a.filter(el => {
    return encountered.hasOwnProperty(el) ? false : (encountered[el] = true);
  });
}
