
//******************************************************************************
//*** set up an HTTP server off port 3000
//******************************************************************************
const express = require("express");
const favicon = require('serve-favicon');
const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'))

//*** server waits indefinitely for incoming requests
app.listen(port, function () {
  console.log("NodeJS app listening on port " + port);
});

//*** create form parser
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: true }));

//******************************************************************************
//*** set up mysql connections
// ******************************************************************************
var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",  // use your own MySQL root password
  database: ""
});

//*** connect to the database
con.connect(function(err) {
  if (err)
      throw err;
  console.log("Connected to MySQL");
});



//******************************************************************************
//*** File system module used for accessing files in nodejs
//******************************************************************************

const fs = require("fs");

function readAndServe(path, res)
{
    fs.readFile(path,function(err, data) {

        res.setHeader('Content-Type', 'text/html');
        res.end(data);
    })
}

//******************************************************************************
//*** ROUTES
//******************************************************************************
// HOME PAGE
app.get("/", function (req, res) {
  readAndServe("./public/html/index.html", res)
});

// TICKETS & PASSES PAGES
app.get("/tickets", function (req, res) {
  readAndServe("./public/html/tickets.html", res)
});

app.get("/day-add-ons", function (req, res) {
  readAndServe("./public/html/day-add-ons.html", res)
});

app.get("/pass-add-ons", function (req, res) {
  readAndServe("./public/html/pass-add-ons.html", res)
});

// RIDES PAGES
app.get("/rides", function (req, res) {
  readAndServe("./public/html/rides.html",res)
});

app.get("/thrill-rides", function (req, res) {
  readAndServe("./public/html/thrill-rides.html", res);
});

app.get("/family-rides", function (req, res) {
  readAndServe("./public/html/family-rides.html", res);
});

app.get("/kids-rides", function (req, res) {
  readAndServe("./public/html/kids-rides.html", res);
});


// EXPERIENCES PAGES
app.get("/dining", function (req, res) {
  readAndServe("./public/html/dining.html", res)
});

app.get("/shops", function (req, res) {
  readAndServe("./public/html/shops.html", res)
});
// --- end routes --- 


//******************************************************************************
//*** API ENDPOINTS 
//******************************************************************************
// RIDES
app.get("/getRides", function (req, res) {
  var query = `SELECT r.name, r.description, r.type, r.height_req, l.name AS location
              FROM ride r
              JOIN location l ON r.location_id = l.location_id`;
  con.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Server Error');
      return;
    } res.json(results);
  });
});

app.get("/getThrillRides", function (req, res) {
  var query = `SELECT r.name, r.description, r.type, r.height_req, l.name AS location
              FROM ride r
              JOIN location l ON r.location_id = l.location_id
              WHERE r.type="thrill"`;
  con.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.starus(500).send('Server Error');
      return;
    } res.json(results);
  });
              
})

app.get("/getFamilyRides", function (req, res) {
  var query = `SELECT r.name, r.description, r.type, r.height_req, l.name AS location
              FROM ride r
              JOIN location l ON r.location_id = l.location_id
              WHERE r.type="family"`;
  con.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.starus(500).send('Server Error');
      return;
    } res.json(results);
  });
              
})

app.get("/getKidsRides", function (req, res) {
  var query = `SELECT r.name, r.description, r.type, r.height_req, l.name AS location
              FROM ride r
              JOIN location l ON r.location_id = l.location_id
              WHERE r.type="kids"`;
  con.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.starus(500).send('Server Error');
      return;
    } res.json(results);
  });
              
})
// --- end rides ---


//******************************************************************************
//*** receive post register data from the client
//******************************************************************************
app.post("/search", function (req, res) {
    var desc = req.body.desc;   // extract the strings received from the browser

    var sql_query = "select title, description from film where description like '%" + desc + "%'";

    con.query(sql_query, function (err, result, fields) { // execute the SQL string
		if (err)
		    throw err;                  // SQL error

	    else {

                  //*** start creating the html body for the browser
			      var html_body = "<HTML><STYLE>body{font-family:arial}</STYLE>";
			      html_body = html_body + "<BODY><TABLE BORDER=1>";

			      //*** print column headings
			      html_body = html_body + "<TR>";
                 for (var i = 0; i < fields.length; i++)
				    html_body = html_body + ("<TH>" + fields[i].name.toUpperCase() + "</TH>");
				  html_body = html_body + "</TR>";

                  //*** prints rows of table data
				  for (var i = 0; i < result.length; i++)
				       html_body = html_body + ("<TR><TD>" + result[i].title + "</TD>" + "<TD>" + result[i].description + "</TD></TR>");

                  html_body = html_body + "</TABLE>";

				  //** finish off the html body with a link back to the search page
				  html_body = html_body + "<BR><BR><BR><a href=http://localhost:3000/search>Go Back To Search</a><BR><BR><BR>";
			      html_body = html_body + "</BODY></HTML>";

                console.log(html_body);             // send query results to the console
			    res.send(html_body);                // send query results back to the browser
	         }
    });
});







