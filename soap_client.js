var soap = require('soap');
var url = 'http://127.0.0.1:3000/wsdl?wsdl';
var args1 = { old_movie_name: "The Dark Knight", new_movie_name: "The Dark Knight2" };
var args2 = { movie_name: "The Dark Knight", director: "Christopher Nolan" };
var args3 = { movie_name: "Immortals", director: "Christopher Nolan" };
var args4 = { movie_name: "MOVIENAME", director: "DIRECTOR", year: "2016", genre: "GERNE", star: "STAR" };

  soap.createClient(url, function (err, client) {
      /*client.updateMovie(args1, function (err, result) { //change
          console.log(result.xml);
      });*/
      var args2 = { };
      client.deleteMovie(args2, function (err, result) { //remove
          console.log(result.xml);
      });
      /*client.queryMovie(args3, function (err, result) { //query
          console.log(result.xml);
      });
      client.addMovie(args4, function (err, result) { //add
         console.log(result.xml);
      });*/
  });
