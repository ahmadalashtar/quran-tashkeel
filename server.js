const request = require('request');

const express = require("express"),
  app = express();

//setting view engine to ejs
app.set("view engine", "ejs");

const simplify = function(verse){
  return verse.replace(/[ًٌٍَُِّْ]/g, '');;
}

//route for index page
app.get("/", function (req, res) {
  res.render("index");
});

app.get("/verse", (req,res)=>{
  let verse;
  let simplifiedVerse;
  let test = request('http://api.alquran.cloud/v1/ayah/1:1/ar', (error, response, body) => {
      if (response.statusCode == 200) {
          result = JSON.parse(response.body);
          verse = result.data.text;
          simplifiedVerse = simplify(verse)
          res.render("index", {simplifiedVerse})
      } else {
        res.json(error)
      }
    }
  );
  console.log(typeof test)
})

app.listen(3000, function () {
  console.log("Server is running on port 3000 ");
});