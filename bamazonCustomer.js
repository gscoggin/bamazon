//======================== APP INFO ========================
// APP NAME: bmanazon
// PRIMARY FUNCTION; Demonstrate using Node.js, Javascript, and mySQL to resturn data back to the user and change data in the database, based on the user's commands. This app uses an amazon product search example to illustrate how this works. 
// AUTHOR: Gabe Scoggin
// RUN COMMAND: node bamazon.js
// Copyright: Gabe Scoggin 2018
//==========================================================

//================== APP REQUIREMENTS ======================
// *Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale. [DONE]
// *The app should then prompt users with two messages:
//   >>The first should ask them the ID of the product they would like to buy. [DONE]
//   >>The second message should ask how many units of the product they would like to buy. [DONE]
// *Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
//   >>If not, the app should log a phrase like Insufficient quantity!, and then prevent the order from going through.[DONE]
// *However, if your store does have enough of the product, you should fulfill the customer's order.
//   >>This means updating the SQL database to reflect the remaining quantity. [DONE]
//   >>Once the update goes through, show the customer the total cost of their purchase. [DONE]
//==========================================================

//========================== CODE ==========================
//Required Node/NPM packages
var mysql = require("mysql");
var inquirer = require("inquirer");
require("dotenv").config();
 
//Establish a connection with mySQL database for queries
var connection = mysql.createConnection({
  host: process.env.HOST,
  port: parseInt(process.env.PORT),
  user: process.env.TEST,
  password: process.env.PASSWORD,
  database: process.env.DATABASE
});

connection.connect(function(err) {
  if (err) throw err;
  disOptions(idSearch)  
});

//Cosmetic variables to beautify the output
var smallDiv = "---------------------------------------------------------------------------------------------------------------------------------------"
var bigDiv = "======================================================================================================================================="
var welcome = (bigDiv + "\n" + "                                       ****** WELCOME TO BAMAZON! HERE'S THE INVENTORY ******" + "\n" + bigDiv)
var orderInfo = (bigDiv + "\n" + "                                               ****** HERE'S YOUR ORDER INFO! ******" + "\n" + bigDiv)

//Function to dipsplay the content of the database
function disOptions(callback) {
    var itemIds = [];
    var query = "SELECT * FROM products;";
    console.log(welcome);
    connection.query(query, function(err, res) {
      for (var i = 0; i < res.length; i++) {
        console.log(smallDiv + "\n" + "Item: " + res[i].item_id + " || Product: " + res[i].product_name + " || Dept: " + res[i].department_name + " || Price: " + res[i].price + "|| Quantity: " + res[i].stock_quantity);
        itemIds.push(res[i].item_id);
        
      }
      console.log(bigDiv);
      return callback(itemIds);
    })
  };

//Function to prompt the user for a product id they would like to buy and how many items
function idSearch(items) {
  inquirer
    .prompt([{
      name: "item_id",
      type: "input",
      message: "Please select the ID of the product you wish to purchase?",
      validate: function validateID(id){
        return id !== '' && items.indexOf(parseInt(id)) > -1;
    }
  },{
      name: "num_items",
      type: "input",
      message: "How many would you like to purchase?",
      validate: function(amount){
        if (isNaN(amount) === false) {
          return true;

        }
        return false;
      }
  }])
  .then(function(answer) {
    var numRequested = parseInt(answer.num_items);
    var itemRequested = parseInt(answer.item_id);
    var query = "SELECT item_id, product_name, price, stock_quantity FROM products WHERE item_id= ? "; 
    connection.query(query, [itemRequested], function(err, res) {
      var stockNum = parseInt(res[0].stock_quantity);
      var itemPrice = parseFloat(res[0].price);
      var totalCost = numRequested * itemPrice; 
      if (stockNum > 0 ) {
        connection.query('UPDATE products SET stock_quantity = stock_quantity -? WHERE item_id= ? ', [numRequested, itemRequested], function(err, res) {
          if (err) throw err;
        }) 
        console.log(orderInfo + "\n" + "There are " + res[0].stock_quantity + " " + res[0].product_name + "'s available, at the cost of: " + "$" + res[0].price + "\n" + smallDiv + "\n" + "Your total comes to $" + totalCost + "\n" + smallDiv + "\n" + "Your order will arrive in 2 days. Thanks for being a Bamazon Brime Member!" + "\n" + bigDiv);
      } else {
        console.log(bigDiv + "\n" + "Sorry, we're fresh out of " + res[0].product_name + ", please check back later." + "\n" + bigDiv);
      } 
      whatNow();
    })
  })
};

//Ends the app when the user is ready to stop shopping
function closeBamazon() {
  console.log(bigDiv + "\n" + "Thanks for shopping with Bamzon, bye!" + "\n" + bigDiv) 
  process.exit(0);
};

//After each search + purchase, ask the user if they would like to keep shopping or leave the app
function whatNow () {
  inquirer
    .prompt({
      name: "what_now",
      type: "list",
      message: "Would you like to continue shopping?",
      choices: [
        "I'm done, thanks.",
        "Yes! I got money to spend!"
      ]
    })
      .then(function(answer) {
        switch (answer.what_now) {
        case "I'm done, thanks.":
          closeBamazon();
          break;
        
        case "Yes! I got money to spend!":
        disOptions(idSearch);
        break;
      }
      })
  };