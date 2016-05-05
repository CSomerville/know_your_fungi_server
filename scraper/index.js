const obtainContinents = require('./scraper/obtainContinents');
const obtainLinks = require('./scraper/obtainLinks');
const obtainSpecies = require('./scraper/obtainSpecies');

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

          obtainSpecies(speciesList.slice(0, 10), (err, arr) => {
            if (err) {
              console.warn(err);
            } else {
              console.log(arr);
            }
          })
        }
      }
    });
  }
});

function uniq(a) {
  const encountered = {};
  return a.filter(el => {
    return encountered.hasOwnProperty(el) ? false : (encountered[el] = true);
  });
}
