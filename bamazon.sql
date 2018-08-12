--drops the database if it already exists !!!don't run if you already created the DB
DROP DATABASE IF EXISTS bamazon_db;

--creates the bamazon_db database
CREATE DATABASE bamazon_db;

--tells mySQL to use the bamazon_db database for any queries hereafter
USE bamazon_db;

--creates a table called 'products' inside bamazon_db
CREATE TABLE products (
  item_id INTEGER(10) AUTO_INCREMENT NOT NULL,
  product_name VARCHAR(60) NOT NULL,  
	department_name VARCHAR(60),
  price INTEGER(7) NOT NULL,
  stock_quantity INTEGER(10),  
  PRIMARY KEY (item_id)
);