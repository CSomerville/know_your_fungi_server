const obtainLinks = require('./scraper/obtainLinks');
const obtainSpecies = require('./scraper/obtainSpecies');

obtainLinks((err, links) => {
  if (err) {
    console.log(err);
  } else {

    obtainSpecies(links, (err, speciesInfo) => {
      if (err) {
        console.log(err);
      } else {
        console.log(speciesInfo);
      }
    });
    
  }
});
