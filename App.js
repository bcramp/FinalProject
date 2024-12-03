//******************************************************************************
//*** set up an HTTP server off port 3000
//******************************************************************************
const express = require("express");
const favicon = require('serve-favicon');
const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(express.json());

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

// Local connection
// var con = mysql.createConnection({
//   host: "localhost",
//   user: "root",
//   password: "",  // use your own MySQL root password
//   database: ""
// });

// Server connection
// Reminder: Connect to Google Cloud instance in MySql first then it will work
var con = mysql.createConnection({
    host: "34.133.112.104",
    user: "root",
    password: "csc621pass",  // use your own MySQL root password
    database: "hello_world"
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
const exp = require("constants");

function readAndServe(path, res) {
    fs.readFile(path,function(err, data) {
        res.setHeader('Content-Type', 'text/html');
        res.end(data);
    });
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

app.get("/shop", function (req, res) {
  readAndServe("./public/html/shops.html", res)
});
// --- end routes --- 


// CHECKOUT
app.get("/checkout", function (req, res) {
  readAndServe("./public/html/checkout-form.html", res)
});

app.get("/checkout/cart", function (req, res) {
  readAndServe("./public/html/checkout.html", res)
});

// ACCOUNT
app.get("/account", function (req, res) {
  readAndServe("./public/html/account.html", res)
});

// ORDER CONFIRMATION
app.get("/confirmation", function (req, res) {
  readAndServe('./public/html/confirmation.html', res)
})

app.post("/account", (req, res) => {
  const { email, password } = req.body;

  // var query = `SELECT * FROM customer WHERE email='${email}' AND password='${password}'`;
  // var query = "SELECT c.first_name, pl.order_id, pr.name, pr.price, o.purchase_date " +
  //             "FROM customer c " + 
  //             "JOIN place pl ON c.cust_id = pl.cust_id " + 
  //             "JOIN \`order\` o ON pl.order_id = o.order_id " + 
  //             "JOIN contain ct ON o.order_id = ct.order_id " +
  //             "JOIN product pr ON ct.product_id = pr.product_id " + 
  //             "WHERE c.email =? AND c.password=?";
  var query = "SELECT c.first_name, c.last_name, pl.order_id, o.purchase_date, GROUP_CONCAT(pr.name, ct.quantity) AS products" +
              " FROM customer c" +
              "   JOIN place pl ON c.cust_id = pl.cust_id" +
              "   JOIN \`order\` o ON pl.order_id = o.order_id" +
              "   JOIN contain ct ON o.order_id = ct.order_id" +
              "   JOIN product pr ON ct.product_id = pr.product_id"+
              " WHERE c.email = ? AND c.password = ?" +
              " GROUP BY pl.order_id, c.first_name, c.last_name, o.purchase_date";
  
  // var query = `SELECT c.first_name, pl.order_id, pr.name, pr.price, o.purchase_datetime 
  //              FROM customer c JOIN place pl ON c.cust_id = pl.cust_id 
  //                JOIN order o ON pl.order_id = o.order_id 
  //                JOIN contain ct ON o.order_id = ct.order_id
  //                JOIN product pr ON ct.product_id = pr.product_id 
  //              WHERE c.email=? AND c.password=?`;
  con.query(query, [email, password], (err, results) => {
    if (err)
      throw err;
    if (results.length > 0) {
      // Creates a succesful JSON response
      res.json({
        success: true,
        data: results
      });

      // Sets the cache for the email for who is logged in
      // Email is unqiue which means this can be an effective way of loggin in to a unique account
      localStorage.setItem('email', email);
    } else {
      // Creates an invalid JSON response
      res.json({
        success: false, 
        message: 'Invalid email or password.'
      })
    }
  });
})




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
    }
    res.json(results);
  });
});

app.get("/getThrillRides", function (req, res) {
  var query = `SELECT r.name, r.description, r.type, r.height_req, l.name AS location
              FROM ride r
                JOIN location l ON r.location_id = l.location_id
              WHERE r.type="Thrill"`;
  con.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Server Error');
      return;
    }
    res.json(results);
  });           
})

app.get("/getFamilyRides", function (req, res) {
  var query = `SELECT r.name, r.description, r.type, r.height_req, l.name AS location
              FROM ride r
                JOIN location l ON r.location_id = l.location_id
              WHERE r.type="Family"`;
  con.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Server Error');
      return;
    }
    res.json(results);
  });
              
})

app.get("/getKidsRides", function (req, res) {
  var query = `SELECT r.name, r.description, r.type, r.height_req, l.name AS location
              FROM ride r
                JOIN location l ON r.location_id = l.location_id
              WHERE r.type="Kids"`;
  con.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Server Error');
      return;
    }
    res.json(results);
  });
              
})
// --- end rides ---

// DINING
app.get("/getRestaurants", function (req, res) {
  var query = `SELECT r.name, r.description, r.cuisine, r.dietary_options, l.name AS location
              FROM restaurant r
                JOIN location l ON r.location_id = l.location_id`;
  con.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Server Error');
      return;
    }
    res.json(results);
  });
});

// SHOPS
app.get("/getShops", function (req, res) {
  var query = `SELECT s.name, s.description, s.type, l.name AS location
              FROM shop s
                JOIN location l ON s.location_id = l.location_id`;
  con.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Server Error');
      return;
    }
    res.json(results);
  });
});

// PRODUCTS
app.get("/getProducts", function (req, res) {
  var query = `SELECT * FROM product`;
  con.query(query, (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      res.status(500).send('Server Error');
      return;
    }
    res.json(results);
  });
});

/****************************************************************************
 * SEARCH BAR FUNCTIONALITY FOR:
 * /rides (DONE), /thrill-rides (DONE), /family-rides (DONE), 
 * /kids-rides (DONE), /dining (DONE), /shops (DONE)
 ***************************************************************************/
// SEARCH BAR FOR ALL RIDES --> THIS IS WORKING!!
app.get('/getRides/search', (req, res) => {
  const { query } = req.query; // Get the search query from the request

  // If nothing was searched, show all the rides
  if (!query) {
    const searchQuery = "SELECT r.name, r.description, r.type, r.height_req, l.name AS location" +
                        " FROM ride r JOIN location l on r.location_id = l.location_id;";

    con.query(searchQuery, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Server Error');
        return;
      }
      res.json(results);
    });
  } else {
    const searchQuery = "SELECT r.name, r.description, r.type, r.height_req, l.name AS location" +
                      " FROM ride r" + 
                      "   JOIN location l on r.location_id = l.location_id" + 
                      " WHERE r.name LIKE ? OR r.description LIKE ?;";
    const searchTerm = `%${query}%`;

    con.query(searchQuery, [searchTerm, searchTerm], (err, results) => {
      if (err) {
        console.error('Error executing search query:', err);
        return res.status(500).json({ message: 'Error performing search' });
      }
  
      res.json(results);
    });
  }
});

// SEARCH BAR FOR THRILL RIDES --> THIS IS WORKING!!
app.get('/getThrillRides/search', (req, res) => {
  const { query } = req.query; // Get the search query from the request

  // If nothing was searched, show all the thrill rides
  if (!query) {
    const searchQuery = `SELECT r.name, r.description, r.type, r.height_req, l.name AS location
                          FROM ride r JOIN location l ON r.location_id = l.location_id
                          WHERE r.type="Thrill";`;

    con.query(searchQuery, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Server Error');
        return;
      }

      res.json(results);
    });
  } else {
    const searchQuery = "SELECT r.name, r.description, r.type, r.height_req, l.name AS location" +
                        " FROM ride r" + 
                        "   JOIN location l on r.location_id = l.location_id" + 
                        " WHERE r.type='Thrill' AND (r.name LIKE ? OR r.description LIKE ?);";
    const searchTerm = `%${query}%`;

    con.query(searchQuery, [searchTerm, searchTerm], (err, results) => {
      console.log(searchQuery); // for debugging purposes
      if (err) {
        console.error('Error executing search query:', err);
        return res.status(500).json({ message: 'Error performing search' });
      }
  
      res.json(results);
    });
  }
});

// SEARCH BAR FOR FAMILY RIDES --> THIS IS WORKING!!
app.get('/getFamilyRides/search', (req, res) => {
  const { query } = req.query; // Get the search query from the request

  // If nothing was searched, show all the family rides
  if (!query) {
    const searchQuery = `SELECT r.name, r.description, r.type, r.height_req, l.name AS location
                          FROM ride r JOIN location l ON r.location_id = l.location_id
                          WHERE r.type="Family";`;

    con.query(searchQuery, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Server Error');
        return;
      }

      res.json(results);
    });
  } else {
    const searchQuery = "SELECT r.name, r.description, r.type, r.height_req, l.name AS location" +
                        " FROM ride r" + 
                        "   JOIN location l on r.location_id = l.location_id" + 
                        " WHERE r.type='Family' AND (r.name LIKE ? OR r.description LIKE ?);";
    const searchTerm = `%${query}%`;

    con.query(searchQuery, [searchTerm, searchTerm], (err, results) => {
      if (err) {
        console.error('Error executing search query:', err);
        return res.status(500).json({ message: 'Error performing search' });
      }
  
      res.json(results);
    });
  }
});

// SEARCH BAR FOR KIDS RIDES --> THIS IS WORKING!!
app.get('/getKidsRides/search', (req, res) => {
  const { query } = req.query; // Get the search query from the request

  // If nothing was searched, show all the kids rides
  if (!query) {
    const searchQuery = `SELECT r.name, r.description, r.type, r.height_req, l.name AS location
                          FROM ride r JOIN location l ON r.location_id = l.location_id
                          WHERE r.type="Kids";`;

    con.query(searchQuery, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Server Error');
        return;
      }

      res.json(results);
    });
  } else {
    const searchQuery = "SELECT r.name, r.description, r.type, r.height_req, l.name AS location" +
                        " FROM ride r" + 
                        "   JOIN location l on r.location_id = l.location_id" + 
                        " WHERE r.type='Kids' AND (r.name LIKE ? OR r.description LIKE ?);";
    const searchTerm = `%${query}%`;

    con.query(searchQuery, [searchTerm, searchTerm], (err, results) => {
      if (err) {
        console.error('Error executing search query:', err);
        return res.status(500).json({ message: 'Error performing search' });
      }
  
      res.json(results);
    });
  }
});

// SEARCH BAR FOR DINING --> THIS IS WORKING!! 
app.get('/getDining/search', (req, res) => {
  const { query } = req.query; // Get the search query from the request

  // If nothing was searched, show all the dining options
  if (!query) {
    var searchQuery = `SELECT r.name, r.description, r.cuisine, r.dietary_options, l.name AS location
                        FROM restaurant r JOIN location l ON r.location_id = l.location_id;`;
    
    con.query(searchQuery, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Server Error');
        return;
      }
      res.json(results);
    });
  } else {
    const searchQuery = "SELECT r.name, r.description, r.cuisine, r.dietary_options, l.name AS location" +
                      " FROM restaurant r" + 
                      "   JOIN location l on r.location_id = l.location_id" + 
                      " WHERE r.name LIKE ? OR r.description LIKE ? OR r.cuisine LIKE ? OR r.dietary_options LIKE ? OR l.name LIKE ?;";
    const searchTerm = `%${query}%`;

    con.query(searchQuery, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], (err, results) => {
      if (err) {
        console.error('Error executing search query:', err);
        return res.status(500).json({ message: 'Error performing search' });
      }
  
      res.json(results);
    });
  }
});

// SEARCH BAR FOR SHOPS --> THIS IS WORKING!! 
app.get('/getShops/search', (req, res) => {
  const { query } = req.query; // Get the search query from the request
  
  // If nothing was searched, show all the dining options
  if (!query) {
    var searchQuery = `SELECT s.name, s.description, s.type, l.name AS location
                        FROM shop s JOIN location l ON s.location_id = l.location_id;`;
    
    con.query(searchQuery, (err, results) => {
      if (err) {
        console.error('Error executing query:', err);
        res.status(500).send('Server Error');
        return;
      }
      res.json(results);
    });
  } else {
    const searchQuery = "SELECT s.name, s.description, s.type, l.name AS location" +
                      " FROM shop s" + 
                      "   JOIN location l on s.location_id = l.location_id" + 
                      " WHERE s.name LIKE ? OR s.description LIKE ? OR s.type LIKE ? OR l.name LIKE ?;";
    const searchTerm = `%${query}%`;

    con.query(searchQuery, [searchTerm, searchTerm, searchTerm, searchTerm], (err, results) => {
      if (err) {
        console.error('Error executing search query:', err);
        return res.status(500).json({ message: 'Error performing search' });
      }
  
      res.json(results);
    });
  }
});

// POST ROUTE FOR WHEN CUSTOMER PLACES AN ORDER
app.post("/order-confirm", (req, res) => {
  const { customer, products } = req.body;
  const { first_name, last_name, email, password, card_number, expiry_date, cvv } = customer;
  var baseTotal = 0;

  // Filters out products to only get the ones included in the order
  for (const key in products) {
    products[key].forEach(item => {
      if (item.quantity == 0) delete products[key];
      else {
        baseTotal += parseFloat(item.quantity) * parseFloat(item.price.slice(1));
      }
    });
  }
  
  // 
  var baseTotalRounded = baseTotal.toFixed(2); // Rounds to 2 decimal places
  var tax = baseTotal * 0.06;
  var taxRounded = tax.toFixed(2);
  var total = parseFloat(baseTotalRounded) + parseFloat(taxRounded);
  var totalRounded = total.toFixed(2);
  baseTotal = parseFloat(baseTotalRounded);
  total = parseFloat(totalRounded);
  const datetime = new Date();
  const mm = datetime.getMonth() + 1;
  const dd = datetime.getDate();
  const yyyy = datetime.getFullYear();
  const purchaseDate =  yyyy + '-' + mm + '-' + dd;


  // Check for existing customer
  const checkQuery = `SELECT * FROM customer WHERE email = ?`;

  con.query(checkQuery, [email], (err, results) => {
      if (err) {
          console.error("Error checking for existing customer:", err);
          return res.status(500).send("An error occurred while checking the customer.");
      } else if (results.length > 0) { // existing customer
        // If the password does not match, return a 500 to say that the incorrect password was entered
        if (password != results[0].password)
          return res.status(500).json({ message: `You are an existing <Hello World/> customer, but you entered the incorrect password for ${email}. Please try again.` });

        const cust_id = results[0].cust_id;
        const insertOrderQuery = `INSERT INTO \`order\` (purchase_date, base_price, total_price) VALUES ('${purchaseDate}', ${baseTotal}, ${total})`;
        con.query(insertOrderQuery, (err, orderResult) => {
          if (err) {
            console.error("Error inserting order:", err);
            return res.status(500).send("Failed to add order.");
          }

          const order_id = orderResult.insertId;
          const insertPlaceQuery = `INSERT INTO place (cust_id, order_id) VALUES (${cust_id}, ${order_id})`;
          
          con.query(insertPlaceQuery, (err, placeResult) => {
            if (err) {
              console.error("Error inserting place:", err);
              return res.status(500).send("Failed to add place details.");
            }
            for (const key in products) {
              products[key].forEach(item => {
                const expireDate = [2, 3, 7, 8].includes(item.productId) ? '2025-12-31' : null;
                const insertContainQuery = `INSERT INTO contain (order_id, product_id, quantity, valid_start_date, expire_date) VALUES (${order_id}, ${item.productId}, ${[item.quantity]}, '${purchaseDate}', '${expireDate}')`;
                con.query(insertContainQuery, (err, containResult) => {
                  if (err) {
                    console.error("Error insert contain:", err);
                    return res.status(500).send("Failed to add contain details.");
                  } 
                })
              });
            }       
            res.send({ message: 'Customer and order added successfully!' });       
          })
        })
      } else { // new customer
          // Insert the new customer into the customer table
          const insertCustomerQuery = `INSERT INTO customer (first_name, last_name, email, password) VALUES ('${first_name}', '${last_name}', '${email}', '${password}')`;
      
          con.query(
              insertCustomerQuery, (err, customerResult) => {
                if (err) {
                  console.error("Error inserting customer:", err);
                  return res.status(500).send("Failed to add customer.");
                } 

                const cust_id = customerResult.insertId;
                const insertOrderQuery = `INSERT INTO \`order\` (purchase_date, base_price, total_price) VALUES ('${purchaseDate}', ${baseTotal}, ${total})`;
                con.query(insertOrderQuery, (err, orderResult) => {
                  if (err) {
                    console.error("Error inserting order:", err);
                    return res.status(500).send("Failed to add order.");
                  }

                  const order_id = orderResult.insertId;
                  const insertPlaceQuery = `INSERT INTO place (cust_id, order_id) VALUES (${cust_id}, ${order_id})`;
                  
                  con.query(insertPlaceQuery, (err, placeResult) => {
                    if (err) {
                      console.error("Error inserting place:", err);
                      res.status(500).send("Failed to add place details.");
                    }
                    for (const key in products) {
                      products[key].forEach(item => {
                        const expireDate = [2, 3, 7, 8].includes(item.productId) ? '2025-12-31' : null;
                        const insertContainQuery = `INSERT INTO contain (order_id, product_id, quantity, valid_start_date, expire_date) VALUES (${order_id}, ${item.productId}, ${[item.quantity]}, '${purchaseDate}', '${expireDate}')`;
                        con.query(insertContainQuery, (err, containResult) => {
                          if (err) {
                            console.error("Error insert contain:", err);
                            return res.status(500).send("Failed to add contain details.");
                          } 
                        })
                      });
                    }       
                    res.send({ message: 'Customer and order added successfully!' });       
                  })
              })
                
              }
          );
      }
  });
});

// DELETE ROUTE FOR WHEN CUSTOMER REMOVES AN ORDER
app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;

  const query = 'DELETE FROM \`order\` WHERE order_id = ?';
  con.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to delete the record');
    }
    if (results.affectedRows === 0) {
      return res.status(404).send('Record not found');
    }
    res.send('Record deleted successfully');
  });
})

//******************************************************************************
//*** Queries
//******************************************************************************
/*
Signing in

SELECT password
FROM customers
WHERE email = ${email};

// app.get('/search', (req, res) => {
//   const { query } = req.query; // Get the search query from the request

//   if (!query) {
//     return res.status(400).json({ message: 'Search query is required' });
//   }

//   var sql_query = ``;
//   if (page === "rides") {
//     sql_query = `SELECT r.name, r.description, r.type, r.height_req, l.name AS location
//                 FROM ride r
//                 JOIN location l ON r.location_id = l.location_id
//                 WHERE r.description LIKE '%` + desc + `%';`;
//   }
//   else if (page === "getThrillRides") {
//     sql_query = `SELECT r.name, r.description, r.type, r.height_req, l.name AS location
//                 FROM ride r
//                   JOIN location l ON r.location_id = l.location_id
//                 WHERE r.type="thrill" AND r.description LIKE '%` + desc + `%';`;
//   }
//   else if (page === "getFamilyRides") {
//     sql_query = `SELECT r.name, r.description, r.type, r.height_req, l.name AS location
//                 FROM ride r
//                   JOIN location l ON r.location_id = l.location_id
//                 WHERE r.type="family" AND r.description LIKE '%` + desc + `%';`;
//   }
//   else if (page === "getKidsRides") {
//     sql_query = `SELECT r.name, r.description, r.type, r.height_req, l.name AS location
//                 FROM ride r
//                   JOIN location l ON r.location_id = l.location_id
//                 WHERE r.type="kids" AND r.description LIKE '%` + desc + `%';`;
//   }
//   else if (page === "getRestaurants") {
//     sql_query = `SELECT r.name, r.description, r.cuisine, r.dietary_options, l.name AS location
//                 FROM restaurant r
//                   JOIN location l ON r.location_id = l.location_id
//                 WHERE r.description LIKE '%` + desc + `%';`;
//   }
//   else if (page === "getShops") {
//     sql_query = `SELECT s.name, s.description, s.type, l.name AS location
//                 FROM shop s
//                   JOIN location l ON s.location_id = l.location_id
//                 WHERE s.description LIKE '%` + desc + `%';`;
//   }
// });



//******************************************************************************
//*** receive post register data from the client
//******************************************************************************
// app.post("/search", function (req, res) {
//     var desc = req.body.desc;   // extract the strings received from the browser

//     var sql_query = "select title, description from film where description like '%" + desc + "%'";

//     con.query(sql_query, function (err, result, fields) { // execute the SQL string
// 		if (err)
// 		    throw err;                  // SQL error

// 	    else {

//                   //*** start creating the html body for the browser
// 			      var html_body = "<HTML><STYLE>body{font-family:arial}</STYLE>";
// 			      html_body = html_body + "<BODY><TABLE BORDER=1>";

// 			      //*** print column headings
// 			      html_body = html_body + "<TR>";
//                  for (var i = 0; i < fields.length; i++)
// 				    html_body = html_body + ("<TH>" + fields[i].name.toUpperCase() + "</TH>");
// 				  html_body = html_body + "</TR>";

//                   //*** prints rows of table data
// 				  for (var i = 0; i < result.length; i++)
// 				       html_body = html_body + ("<TR><TD>" + result[i].title + "</TD>" + "<TD>" + result[i].description + "</TD></TR>");

//                   html_body = html_body + "</TABLE>";

// 				  //** finish off the html body with a link back to the search page
// 				  html_body = html_body + "<BR><BR><BR><a href=http://localhost:3000/search>Go Back To Search</a><BR><BR><BR>";
// 			      html_body = html_body + "</BODY></HTML>";

//                 console.log(html_body);             // send query results to the console
// 			    res.send(html_body);                // send query results back to the browser
// 	         }
//     });
// });




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
Searching for specific restaurants

SELECT *
FROM restaurant
WHERE name IS LIKE '%${searchQuery}%' OR cuisine LIKE '%${searchQuery}%' 
    OR dietary_options LIKE '%${searchQuery}%' OR description LIKE '%${searchQuery}%';
*/

/*
Searching for specific shops

SELECT *
FROM shop
WHERE name IS LIKE '%${searchQuery}%' OR type LIKE '%${searchQuery}%' OR description LIKE '%${searchQuery}%';
*/
