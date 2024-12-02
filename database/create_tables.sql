-- Table keeps track of customers; dynamic table
create table customer(
	cust_id int primary key,
    first_name varchar(50) not null,
    last_name varchar(50) not null,
    email varchar(100) not null unique,
    phone_number varchar(12) not null unique,
    address varchar(100),
    city varchar(50),
    country varchar(50),
    zip_code varchar(10), -- ex) 12345-6789 (incl. ext)
    password varchar(100) not null,
    pay_id int,
    
    foreign key (pay_id) references payment_info(pay_id)
);


-- Table keeps track of payment info for the customer; dynamic table
create table payment_info(
	pay_id int primary key,
    type enum('Cash', 'Card') not null,
    card_number varchar(20) unique,
    expr_date date,
    cvv varchar(4)
);


-- Table keeps track of all the orders; dynamic table
 create table orders(
	order_id int primary key,
    purchase_datetime datetime not null,
    pay_id int not null,
    base_price decimal(10,2) not null,
    total_price decimal(10,2) not null,
    
    foreign key (pay_id) references payment_info(pay_id) ON DELETE CASCADE
 );


-- Table keeps track of which customers placed which orders; dynamic table
create table place_order(
	cust_id int not null,
	order_id int not null,

	primary key (cust_id, order_id),
	foreign key (cust_id) references customer(cust_id),
	foreign key (order_id) references orders(order_id) ON DELETE CASCADE
);


-- Table keeps track of what the product the order contains; dynamic table
create table contain(
    order_id int not null,
    product_id int not null,
    valid_start_date datetime not null,
    expire_date datetime,
	quantity int not null default 1,
    
    primary key (order_id, product_id),
    foreign key (order_id) references orders(order_id) ON DELETE CASCADE,
    foreign key (product_id) references product(product_id)
);


-- Table to store the list of available products; static table.
create table product(
    product_id int primary key,
    name enum('Daily Ticket', '2025 Season Pass', '2025 Gold Membership', 
              'Fast Pass', '1-Day Drink Deal', '1-Day Dining Deal', 
              'All-Season Drink Deal', 'All-Season Dining Deal') not null,
	type enum('admission', 'add-on') not null,
    description text not null,
    price decimal(10, 2) not null
);


-- Table keeps track of the locations in the park; static table
create table location(
	location_id int primary key,
	name enum('Algorithm Alley', 'Quantum Quarters', 'Code Canyon', 'AI Avenue', 
			  'Data District', 'Cybersecurity Citadel', 'Mainframe Mountain', 'Syntax City') not null unique
);


-- Table keeps track of the rides in the park; static table
create table ride(
	ride_id int primary key,
	name varchar(30),
	type enum('Thrill', 'Family', 'Kids') not null,
	location_id int not null,
	height_req decimal (5,2) not null, -- height in inches
	description text,

	foreign key (location_id) references location(location_id)
);


-- Table keeps track of the restaurants in the park; static table
create table restaurant(
	rest_id int primary key,
	name varchar (50) not null unique,
	cuisine varchar (50) not null,
	dietary_options enum('V', 'VG', 'GF', 'DF', 'Halal', 'Kosher'),
	location_id int not null,
	description text not null,

	foreign key (location_id) references location (location_id)
);
-- so we can have multiple values for the dietary options.
ALTER TABLE restaurant
MODIFY COLUMN dietary_options SET('V', 'VG', 'GF', 'DF', 'Halal', 'Kosher');


-- Table keeps track of the shops in the park; static table
create table shop(
	shop_id int primary key,
	name varchar(50) not null unique,
	type varchar(30) not null,
	location_id int not null,
	description text not null,

	foreign key (location_id) references location(location_id)
);
