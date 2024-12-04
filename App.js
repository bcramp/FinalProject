
//******************************************************************************
//*** set up an HTTP server off port 3000
//******************************************************************************
const express = require("express");
const favicon = require('serve-favicon');
// const cors = require('cors');
const app = express();
const port = 3000;
app.use(express.static('public'));
app.use(favicon(__dirname + '/public/favicon.ico'));
// app.use(cors());
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
const exp = require("constants");

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
// --- end rides ---

// EXPERIENCES PAGES
app.get("/dining", function (req, res) {
  readAndServe("./public/html/dining.html", res)
});

app.get("/shop", function (req, res) {
  readAndServe("./public/html/shops.html", res)
});
// --- end experiences ---

// CHECKOUT FORM 1 (PRODUCTS FORM)
app.get("/checkout", function (req, res) {
  readAndServe("./public/html/checkout-form.html", res)
});

// CHECKOUT FORM 2 (CUSTOMER INFO FORM + ORDER SUMMARY DISPLAY)
app.get("/checkout/cart", function (req, res) {
  readAndServe("./public/html/checkout.html", res)
});

// ACCOUNT (LOG IN PAGE + ACCOUNT DETAILS)
app.get("/account", function (req, res) {
  readAndServe("./public/html/account.html", res)
});

// ORDER CONFIRMATION
app.get("/confirmation", function (req, res) {
  readAndServe('./public/html/confirmation.html', res)
});


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
      res.status(500).send('Server Error');
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
    } res.json(results);
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
    } res.json(results);
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
    } res.json(results);
  });
});

/****************************************************************************
 * SEARCH BAR FUNCTIONALITY FOR:
 * /rides (DONE), /thrill-rides (IN PROGRESS), /family-rides (IN PROGRESS), 
 * /kids-rides (IN PROGRESS), /dining (DONE), /shops ()
 ***************************************************************************/
// SEARCH BAR FOR ALL RIDES --> THIS IS WORKING
app.get('/getRides/search', (req, res) => {
  const { query } = req.query; // Get the search query from the request

  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  const searchQuery = "SELECT r.name, r.description, r.type, r.height_req, l.name AS location" +
                      " FROM ride r" + 
                      " JOIN location l on r.location_id = l.location_id" + 
                      " WHERE r.name LIKE ? OR r.description LIKE ?";
  const searchTerm = `%${query}%`;

  con.query(searchQuery, [searchTerm, searchTerm], (err, results) => {
    if (err) {
      console.error('Error executing search query:', err);
      return res.status(500).json({ message: 'Error performing search' });
    }

    res.json(results);
  });
});

// SEARCH BAR FOR THRILL RIDES --> THIS IS NOT WORKING!! It searchs all rides still instead of type='thrill'
app.get('/getThrillRides/search', (req, res) => {
  const { query } = req.query; // Get the search query from the request

  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  const searchQuery = "SELECT r.name, r.description, r.type, r.height_req, l.name AS location" +
                      " FROM ride r" + 
                      " JOIN location l on r.location_id = l.location_id" + 
                      " WHERE r.type='thrill' AND (r.name LIKE ? OR r.description LIKE ?)";
  const searchTerm = `%${query}%`;

  con.query(searchQuery, [searchTerm, searchTerm], (err, results) => {
    if (err) {
      console.error('Error executing search query:', err);
      return res.status(500).json({ message: 'Error performing search' });
    }

    res.json(results);
  });
});

// SEARCH BAR FOR FAMILY RIDES --> THIS IS NOT WORKING!! It searchs all rides still instead of type='family'
app.get('/getFamilyRides/search', (req, res) => {
  const { query } = req.query; // Get the search query from the request

  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  const searchQuery = "SELECT r.name, r.description, r.type, r.height_req, l.name AS location" +
                      " FROM ride r" + 
                      " JOIN location l on r.location_id = l.location_id" + 
                      " WHERE r.type='family' AND (r.name LIKE ? OR r.description LIKE ?)";
  const searchTerm = `%${query}%`;

  con.query(searchQuery, [searchTerm, searchTerm], (err, results) => {
    if (err) {
      console.error('Error executing search query:', err);
      return res.status(500).json({ message: 'Error performing search' });
    }

    res.json(results);
  });
});

// SEARCH BAR FOR KIDS RIDES --> THIS IS NOT WORKING!! It searchs all rides still instead of type='kids'
app.get('/getKidsRides/search', (req, res) => {
  const { query } = req.query; // Get the search query from the request

  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  const searchQuery = "SELECT r.name, r.description, r.type, r.height_req, l.name AS location" +
                      " FROM ride r" + 
                      " JOIN location l on r.location_id = l.location_id" + 
                      " WHERE r.type='kids' AND (r.name LIKE ? OR r.description LIKE ?)";
  const searchTerm = `%${query}%`;

  con.query(searchQuery, [searchTerm, searchTerm], (err, results) => {
    if (err) {
      console.error('Error executing search query:', err);
      return res.status(500).json({ message: 'Error performing search' });
    }

    res.json(results);
  });
});

// SEARCH BAR FOR DINING --> THIS IS WORKING!! 
app.get('/getDining/search', (req, res) => {
  const { query } = req.query; // Get the search query from the request

  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  const searchQuery = "SELECT r.name, r.description, r.cuisine, r.dietary_options, l.name AS location" +
                      " FROM restaurant r" + 
                      " JOIN location l ON r.location_id = l.location_id" + 
                      " WHERE r.name LIKE ? OR r.description LIKE ? OR r.cuisine LIKE ? OR r.dietary_options LIKE ? OR l.name LIKE ?";
  const searchTerm = `%${query}%`;

  con.query(searchQuery, [searchTerm, searchTerm, searchTerm, searchTerm, searchTerm], (err, results) => {
    if (err) {
      console.error('Error executing search query:', err);
      return res.status(500).json({ message: 'Error performing search' });
    }

    res.json(results);
  });
});

// SEARCH BAR FOR SHOPS --> THIS IS WORKING!! 
app.get('/getShops/search', (req, res) => {
  const { query } = req.query; // Get the search query from the request
  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  const searchQuery = "SELECT s.name, s.description, s.type, l.name AS location" +
                      " FROM shop s" + 
                      " JOIN location l on s.location_id = l.location_id" + 
                      " WHERE s.name LIKE ? OR s.description LIKE ? OR s.type LIKE ? OR l.name LIKE ?";
  const searchTerm = `%${query}%`;

  con.query(searchQuery, [searchTerm, searchTerm, searchTerm, searchTerm], (err, results) => {
    if (err) {
      console.error('Error executing search query:', err);
      return res.status(500).json({ message: 'Error performing search' });
    }

    res.json(results);
  });
});


/*****************************************************
 * API ENDPOINT FOR WHEN A USER PLACES AN ORDER
 ****************************************************/
app.post("/order-confirm", (req, res) => {
  const { customer, products } = req.body;
  const { first_name, last_name, email, password, card_number, expiry_date, cvv } = customer;
  var baseTotal = 0;

  // filters out products to only get the ones included in the order
  for (const key in products) {
    products[key].forEach(item => {
      if (item.quantity == 0) delete products[key];
      else {
        baseTotal += parseFloat(item.quantity) * parseFloat(item.price.slice(1));
      }
    });
  }
  
  var baseTotalRounded = baseTotal.toFixed(2)
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

  // // Validate password match
  // if (password !== confirmPassword) {
  //     return res.status(400).send("Passwords do not match.");
  // }

  // Check for existing customer
  const checkQuery = `SELECT * FROM customer WHERE email = ?`;

  con.query(checkQuery, [email], (err, results) => {
      if (err) {
          console.error("Error checking for existing customer:", err);
          return res.status(500).send("An error occurred while checking the customer.");
      } else if (results.length > 0) { // existing customer
        if (password != results[0].password) return res.status(500).json({ message: `You are an existing <Hello World/> customer, but you entered the incorrect password for ${email}. Please try again.` });
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


/*****************************************************
 * API ENDPOINT FOR WHEN A USER LOGS IN TO ACCOUNT
 * AND ORDER HISTORY IS DISPLAYED
 ****************************************************/
app.post("/account", (req, res) => {
  const { email, password } = req.body;

  var query = "SELECT c.cust_id, c.first_name, c.last_name, pl.order_id, o.purchase_date, GROUP_CONCAT(pr.name, ct.quantity) AS products" +
              " FROM customer c" +
              " JOIN place pl ON c.cust_id = pl.cust_id" +
              " JOIN \`order\` o ON pl.order_id = o.order_id" +
              " JOIN contain ct ON o.order_id = ct.order_id" +
              " JOIN product pr ON ct.product_id = pr.product_id"+
              " WHERE c.email = ? AND c.password = ?" +
              " GROUP BY c.cust_id, pl.order_id, c.first_name, c.last_name, o.purchase_date";
  con.query(query, [email, password], (err, results) => {
    if (err) throw err;
    
    if (results.length > 0 ) {
      res.json({
        success: true,
        data: results,
        numOrders: 1
      });
    } else if (results.length == 0) {
      var newQuery = "SELECT * FROM customer WHERE email=? AND password=?";
      con.query(newQuery, [email, password], (err, results) => {
        if (err) throw err;

        if (results.length > 0) {
          res.json({
            success: true,
            data: results,
            numOrders: 0
          })
        } else {
          res.json({
            success: false, 
            message: 'Invalid email or password.',
            numOrders: 0
          })
        }
        
      });

    } else {
        res.json({
          success: false, 
          message: 'Invalid email or password.',
          numOrders: 0
        })
    }
  });
})


/*****************************************************
 * API ENDPOINT FOR WHEN A USER CLICKS ON SETTINGS
 * FROM ACCOUNT PAGE WHEN LOGGED IN
 * (This is for displaying information already in DB)
 ****************************************************/
app.post("/accountInfo", (req, res) => {
  const { email, password } = req.body;
  var query = "(SELECT c.cust_id, c.first_name, c.last_name, c.email, c.password, c.phone, c.address, c.city, c.state, c.zip, c.country, p.card_number, p.expr_date, p.cvv" +
              " FROM customer c" +
              " JOIN payment p ON c.pay_id = p.pay_id" +
              " WHERE email=? AND password=?)" +
              " UNION (SELECT c.cust_id, c.first_name, c.last_name, c.email, c.password, c.phone, c.address, c.city, c.state, c.zip, c.country, '' AS card_number, '' AS expr_date,'' AS cvv" +
              " FROM customer c" +
              " WHERE c.email=? AND c.password=?)" +
              " LIMIT 1;";
  con.query(query, [email, password, email, password], (err, results) => {
    if (err) throw err;
    
    if (results.length > 0 ) {
      res.json({
        success: true,
        data: results
      });
    } else {
        res.json({
          success: false, 
          message: 'Invalid email or password.'
        })
    }
  });
});


/*****************************************************
 * API ENDPOINT FOR WHEN A USER DELETES AN ORDER
 ****************************************************/
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
    res.send('Order deleted successfully');
  });
})


/*****************************************************
 * API ENDPOINT FOR WHEN A USER UPDATES THEIR 
 * ACCOUNT INFORMATION
 ****************************************************/
app.put('/updateAccount', (req, res) => {
  const { formData } = req.body;

  const custFields = [];
  const custValues = [];
  var custId = '';
  var payId = '';
  const paymentFields = [];
  const paymentValues = [];

  for (var [key, value] of Object.entries(formData)) {
    if (key == "custId") {
      custId = value;
      continue;
    }

    if (key == "cardNumber" || key == "expiryDate" || key == "cvv") {
      if (value.trim() !== '') { // skip empty values
        if (key == "cardNumber") key = "card_number";
        if (key == "expiryDate") key = "expr_date";
        paymentFields.push(key);

        if (value.trim().length == 0) { paymentValues.push(null); }
        else { paymentValues.push(`'${value}'`); }
        continue;
      }
    }

    else if (value !== '') { // Skip empty values
      custFields.push(`${key} = ?`);
      custValues.push(value);
    }
    
  }

  if (custFields.length === 0 && paymentFields.length === 0) {
    return res.status(400).send('No valid fields to update.');
  }

  if (paymentFields.length > 0) { // if user updates their payment info
    const query = `INSERT INTO payment (${paymentFields.join(', ')}) VALUES (${paymentValues.join(', ')})`; // inserts into payment table

    con.query(query, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error updating account.');
      }

      payId = result.insertId;
      custFields.push("pay_id = ?");
      custValues.push(payId);

      if (custFields.length > 0) {
        const query = `UPDATE customer SET ${custFields.join(', ')} WHERE cust_id = ${custId}`; // updates customer table with payment info + any other fields
        
        con.query(query, custValues, (err, result) => {
          if (err) {
            console.error(err);
            return res.status(500).send('Error updating account.');
          }

          // res.send('Account updated successfully.');
        });
      }
    });

  }

  if (custFields.length > 0) {
    const query = `UPDATE customer SET ${custFields.join(', ')} WHERE cust_id = ${custId}`; // updates customer table with fields user changed
    
    con.query(query, custValues, (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error updating account.');
      }

      // res.send('Account updated successfully.');
    });
  }
  
  res.send('Account updated successfully.');
  

});