const request = require('request');

const express = require("express"),
  app = express();

//setting view engine to ejs
app.set("view engine", "ejs");


const removeTashkeel = function(verse){
  return verse.replace(/[ًٌٍَُِّْ]/g, '');;
}

const keepLettersAndTashkeel = function(verse){
  return verse.replace(/[^ا-ي أإآؤئء ًٌٍَُِّْ]/g, '');
}
const removeBOM = function(verse){
  verse = verse.replace(/^\uFEFF/, '');
  verse = verse.replace(/^\ufeff/, '');
  return verse;
}

const surahsCount = 114;
let ayahsCounts = [];

//route for index page
app.get("/", function (req, res) {
  
  let test = request('http://api.alquran.cloud/v1/meta', (error, response, body) => {
  if (response.statusCode == 200) {
      result = JSON.parse(response.body);
      let surahs = result.data.surahs.references;
      ayahsCounts = surahs.map(element=>element.numberOfAyahs)
      res.render("index",{ayahsCounts});
  } else {
    res.json(error)
  }
  });
  
  
  
});

app.get("/verses/:surah::ayah", (req, res) => {
  let surah = req.params.surah;
  let ayah = req.params.ayah;
  let URI = `http://api.alquran.cloud/v1/ayah/${surah}:${ayah}/ar`
  let test = request(URI, (error, response, body) => {
      if (response.statusCode == 200) {
          result = JSON.parse(response.body);
          let originalVerse = removeBOM(result.data.text);
          let verse = keepLettersAndTashkeel(originalVerse)
          let simplifiedVerse = removeTashkeel(verse)
          let displayedVerse = removeTashkeel(originalVerse)
          res.render("index", {verse,simplifiedVerse,originalVerse,displayedVerse})
      } else {res.json(error)}
    
    }
  );
});

// app.get("/verses/random-verse", (req,res)=>{
//   let test = request('http://api.alquran.cloud/v1/ayah/1:1/ar', (error, response, body) => {
//       if (response.statusCode == 200) {
//           result = JSON.parse(response.body);
//           let originalVerse = removeBOM(result.data.text);
//           let verse = keepLettersAndTashkeel(originalVerse)
//           let simplifiedVerse = removeTashkeel(verse)
//           let displayedVerse = removeTashkeel(originalVerse)
//           res.render("index", {verse,simplifiedVerse,originalVerse,displayedVerse})
//       } else {
//         res.json(error)
//       }
      
//     }
//   );
// })



app.listen(3000, function () {
  console.log("Server is running on port 3000 ");
});