
  const express = require('express');
  const bodyParser = require('body-parser');
  const _ = require('lodash');
  const ejs = require('ejs');


  const app=express();

  app.set('view engine', 'ejs');
  app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.use(express.static("images"));
app.use('/', require("./router"))


app.get("/",function(req,res){
  var request = require("request");
  var options = {
    method: 'GET',
    url: 'https://covid-193.p.rapidapi.com/statistics',
    headers: {
      'x-rapidapi-host': 'covid-193.p.rapidapi.com',
      'x-rapidapi-key': 'a091c6cf50msh034d39fd55b88fep1bc326jsn924ae5b0baff'
    }
  };

  request(options, function (error, response, body) {
  	if (error) throw new Error(error);
     var data=JSON.parse(body);
     var New=data.response[42].cases.new;
      var Active=data.response[42].cases.active;
       var Critical=data.response[42].cases.critical;
        var Recovered=data.response[42].cases.recovered;
         var Total=data.response[42].cases.total;
console.log(New);
     res.render("index",
     {
       New:New,
     Active:Active,
   Critical:Critical,
 Recovered:Recovered,
Total:Total
}

   );
  });
});



 app.listen(process.env.PORT||3000,function(){
 console.log("hello world!");
});
