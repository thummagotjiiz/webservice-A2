var http = require('http');
var soap = require('soap');
var xpath = require('xpath')
  , dom = require('xmldom').DOMParser;
var fs = require('fs');
var serializer = new (require('xmldom')).XMLSerializer;

var movieService = {
    Movie_Service: {
        Movie_Port: {
            updateMovie: function (args) {  //change
                  var xml = require('fs').readFileSync('movieG5.xml', 'utf8')
                  xml = xml.replace(/(\r\n|\n|\r|\t)/gm, "");
                  var doc = new dom().parseFromString(xml)
                  var nodes = xpath.select("/movielist", doc);
                  for (var i = 0; i < nodes[0].getElementsByTagName("movie").length; i++) {
                      if (nodes[0].getElementsByTagName("movie")[i].getElementsByTagName("name")[0].childNodes[0].nodeValue == args.old_movie_name) {
                          nodes[0].getElementsByTagName("movie")[i].getElementsByTagName("name")[0].childNodes[0].data = args.new_movie_name;
                      }
                  }
                  console.log(nodes[0].getElementsByTagName("movie")[0].getElementsByTagName("name")[0].toString());
                  return { xml: nodes.toString() };
            },
            deleteMovie: function (args) {  //remove
                var xml = require('fs').readFileSync('timestamp.xml', 'utf8')
                xml = xml.replace(/(\r\n|\n|\r|\t)/gm, "");
                var doc = new dom().parseFromString(xml)
                var nodes = xpath.select("/timestamp", doc);

               /* console.log(nodes[0].getElementsByTagName("movie").length);
             //-------------------------------------------- remove by id ----------------------------------------------------------
                //nodes[0].removeChild(nodes[0].getElementsByTagName("movie")[args.movie_id]);
             //--------------------------------------------------------------------------------------------------------------------
             //-------------------------------------------- remove by movie name --------------------------------------------------
                for (var i = 0; i < nodes[0].getElementsByTagName("movie").length; i++) {
                    if (nodes[0].getElementsByTagName("movie")[i].getElementsByTagName("name")[0].childNodes[0].data == args.movie_name) {
                        if (nodes[0].getElementsByTagName("movie")[i].getElementsByTagName("director")[0].childNodes[0].data == args.director) {
                            nodes[0].removeChild(nodes[0].getElementsByTagName("movie")[i]);
                            i++;
                        }
                    }
                }
             //--------------------------------------------------------------------------------------------------------------------
                console.log(nodes[0].getElementsByTagName("movie")[0].getElementsByTagName("name")[0].toString());*/
                return { xml: nodes.toString() };
            },
            queryMovie: function (args) {  //query
                var xml = require('fs').readFileSync('movieG5.xml', 'utf8')
                xml = xml.replace(/(\r\n|\n|\r|\t)/gm, "");
                var doc = new dom().parseFromString(xml)
                var nodes = xpath.select("/movielist", doc);
                console.log(nodes[0].getElementsByTagName("movie").length);
                var i = 0; 
                while (i < nodes[0].getElementsByTagName("movie").length) {       //remove tuples that none of argumnet is equal
                    if (nodes[0].getElementsByTagName("movie")[i].getElementsByTagName("name")[0].childNodes[0].nodeValue == args.movie_name ||
                        nodes[0].getElementsByTagName("movie")[i].getElementsByTagName("director")[0].childNodes[0].nodeValue == args.director) {
                        console.log(nodes[0].getElementsByTagName("movie")[i].getElementsByTagName("name")[0].childNodes[0].nodeValue);
                        console.log(nodes[0].getElementsByTagName("movie")[i].getElementsByTagName("director")[0].childNodes[0].nodeValue);
                        i++;
                    } else {
                        nodes[0].removeChild(nodes[0].getElementsByTagName("movie")[i]);
                    }
                }
                //console.log(nodes[0].getElementsByTagName("movie")[0].getElementsByTagName("name")[0].toString());
                return { xml: nodes.toString() };
            },
            addMovie: function (args) {  //add
                console.log(args);
                var xml = require('fs').readFileSync('timestamp.xml', 'utf8')
                xml = xml.replace(/(\r\n|\n|\r|\t)/gm, "");
                var doc = new dom().parseFromString(xml)
                var nodes = xpath.select("/timestamp", doc);
                var newMovie = doc.createElement("stamp")

                name = doc.createElement("date");
                txtName = doc.createTextNode(args.date)
                name.appendChild(txtName);

                director = doc.createElement("time");
                txtDir = doc.createTextNode(args.time)
                director.appendChild(txtDir);

                count = doc.createElement("count");
                txtCount = doc.createTextNode(args.count)
                count.appendChild(txtCount);

                newMovie = doc.createElement("stamp");
                newMovie.appendChild(name);
                newMovie.appendChild(director);
                newMovie.appendChild(count);

                doc.getElementsByTagName("timestamp")[0].appendChild(newMovie);

                fs.writeFile(
                  "timestamp.xml",
                  serializer.serializeToString(doc),
                  function (error) {
                      if (error) {
                          console.log(error);
                      } else {
                          console.log("The file was saved!");
                      }
                  }
                );
                //var result = nodes.toString();
                //return { xml: result };
                return { xml: "OK" };
            }
        }
    }
}
var xml = require('fs').readFileSync('MovieService.wsdl', 'utf8'),
      server = http.createServer(function (request, response) {
          response.end("404: Not Found: " + request.url)
      });

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
  var addr = server.address();
  console.log("server listening at", addr.address + ":" + addr.port);
  });

soap.listen(server, '/wsdl', movieService, xml);
