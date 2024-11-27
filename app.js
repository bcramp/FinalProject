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
app.get("/", function (req, res) {
    readAndServe("./public/html/index.html", res)
});

app.get("/navtest", function (req, res) {
    readAndServe("./public/html/index2.html", res)
});

app.get("/rides", function (req, res) {
    readAndServe("./public/html/rides.html",res)
});

app.get("/tickets", function (req, res) {
    readAndServe("./public/html/tickets.html", res)
});

app.get("/day-add-ons", function (req, res) {
    readAndServe("./public/html/day-add-ons.html", res)
});

app.get("/pass-add-ons", function (req, res) {
    readAndServe("./public/html/pass-add-ons.html", res)
});


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

//******************************************************************************
//*** Queries
//******************************************************************************
/*
Signing in

SELECT password
FROM customers
WHERE email = ${email};

Then check password validity
*/

/*
Creating an account

INSERT INTO customers 
(first_name, last_name, email, phone_number, address, city, country, zip_code, password) 
VALUES (${first}, ${last}, ${email}, ${phone}, ${address}, ${city}, ${country}, ${zip_code}, ${pass});
*/

/*
Updating account's phone number

UPDATE customers 
SET phone_number = "${phone}"
WHERE email = "${email}";
*/

/*
Updating account's address

UPDATE customers 
SET address = "${address}", city = "${city}", country = "${country}", zip_code = "${zip_code}"
WHERE email = "${email}";
*/

/*
Updating account's password

UPDATE customers 
SET password = "${pass}"
WHERE email = "${email}";
*/

/*
Deleting user account

DELETE FROM customers
WHERE email = "${email}";
*/

/*
Adding a user's order

Note, I will utilize a random UUID to fill in the order_id and current datatime

SELECT cust_id
FROM customers
WHERE email = "${email}";  = var custId

SELECT pay_id
FROM payment_info
WHERE cust_id = "${custId}";  = var payId

SELECT product_id
FROM product
WHERE type = "${prodType}";  = var productId (variable that the customer buys)

INSERT INTO orders
(order_id, purchase_datetime, pay_id, base_price, total_price)
VALUES (${orderId}, ${purchDate}, ${payId}, ${basePrice}, ${totalPrice});

INSERT INTO place_order
VALUES cust_id = "${custId}", order_id = "${orderId}";

INSERT INTO contain
VALUES order_id = ${orderId}, product_id = ${productId}, valid_start_date = ${purchDate}, expire_date = ${expr_date}; (expr_date CAN BE NULL)
*/

/*
Viewing a user's order history

SELECT order_id, purchase_datetime, total_price, valid_start_date, expire_date, p.name AS productName, p.description AS productDesc
FROM customers AS c JOIN orders AS o ON c.pay_id = o.pay_id
        JOIN contain AS cn ON o.order_id = cn.order_id
        JOIN product AS p ON o.product_id = p.product_id             // TODO: THIS WILL ONLY SHOW 1 PRODUCT EACH LINE INSTEAD OF GROUPING ALL PRODUCTS INTO 1 ORDER
WHERE email = "${email}"
ORDER BY purchase_datetime DESC;
*/

/*
Searching for all rides

SELECT *
FROM rides;
*/

/*
Searching for specific rides

SELECT *
FROM rides
WHERE name IS LIKE '%${searchQuery}%' OR type LIKE '%${searchQuery}%' OR description LIKE '%${searchQuery}%';
*/

/*
Searching for specific types of rides via the clicked link

SELECT *
FROM rides
WHERE type = '%${searchQuery}%';
*/

/*
Searching for all restaurants

SELECT *
FROM restaurant;
*/

/*
Searching for specific restaurants

SELECT *
FROM restaurant
WHERE name IS LIKE '%${searchQuery}%' OR cuisine LIKE '%${searchQuery}%' 
    OR dietary_options LIKE '%${searchQuery}%' OR description LIKE '%${searchQuery}%';
*/

/*
Searching for all shops

SELECT *
FROM shop;
*/

/*
Searching for specific shops

SELECT *
FROM shop
WHERE name IS LIKE '%${searchQuery}%' OR type LIKE '%${searchQuery}%' OR description LIKE '%${searchQuery}%';
*/





SELECT r.name, r.description, r.type, r.height_req, l.name AS location
              FROM ride r
              JOIN location l ON r.location_id = l.location_id
              WHERE r.type="kids
