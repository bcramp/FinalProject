// const API_BASE_URL = 'http://localhost:3000';

// window.onload = window.localStorage.clear(); // logs user out on reload

// Check if logged in
document.addEventListener('DOMContentLoaded', () => {
    const email = localStorage.getItem('email');
    const password = localStorage.getItem('password');
    

    if (email && password) {
        showOrderHistory(email, password) //console.log(email, password);
        // login();
    } else {
        showLoginForm();
    }
});

function showLoginForm() {
    const loginFormDiv = document.getElementById('loginForm');
    const dataDiv = document.getElementById('results');

    dataDiv.style.display = 'none';
    loginFormDiv.style.display = 'flex';

}

function logout() {
    localStorage.removeItem('email');
    localStorage.removeItem('password');

    const loginFormDiv = document.getElementById('loginForm');
    const dataDiv = document.getElementById('results');
    const settingsDiv = document.getElementById('accountSettings');

    dataDiv.innerHTML = '';
    settingsDiv.innerHTML = '';

    dataDiv.style.display = 'none';
    settingsDiv.style.display = 'none';
    loginFormDiv.style.display = 'flex';

    document.getElementById("email").value = '';
    document.getElementById("password").value = '';

}

async function login() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    localStorage.setItem('email', email);
    localStorage.setItem('password', password);

    // console.log(email, password)
    showOrderHistory(email, password);
}

async function showOrderHistory(email, password) {
    try {
        const response = await fetch('http://localhost:3000/account', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
        });
        const results = await response.json();
        if (results.success) {
            
            const dataDiv = document.getElementById('results')
            dataDiv.innerHTML = ''; // clear out

            if (results.numOrders == 1) {
                // const custId = results.data[0].cust_id;

                const nameDiv = document.createElement('div');
                nameDiv.className = 'name-wrapper';
                nameDiv.innerHTML = `<div>
                                        <span class='name-header'>Welcome, ${results.data[0].first_name}!</span>
                                        <br>
                                        <p style='padding-left: 5px;'>Past Purchases<p>
                                    </div>
                                    <div>
                                        <button class='update-info-btn' onclick="showAccountSettings('${email}', '${password}')">Settings</button>
                                        <button class='update-info-btn' onclick="logout()">Log out</button>
                                    </div>`;
                dataDiv.appendChild(nameDiv);
                const ordersDiv = document.createElement('div')
                ordersDiv.className = "order-wrapper";
                results.data.forEach((row , index)=> {
                    const orderId = row.order_id;
                    
                    var purchaseDate = row.purchase_date;
                    const purchaseDateArr = purchaseDate.split('-');
                    if (purchaseDateArr.length > 1) {
                        const yyyy = purchaseDateArr[0];
                        const mm = purchaseDateArr[1];
                        const dd = purchaseDateArr[2];
                        purchaseDate = mm + '/' + dd + '/' + yyyy;
                    }

                    const products = row.products.split(',');
                    
                    const rowDiv = document.createElement('div');
                    rowDiv.className = 'order-list-wrapper';

                    const itemDiv = document.createElement('div');
                    itemDiv.className = 'order-items-wrapper';
                    const isLastItem = index === results.data.length - 1;

                    itemDiv.innerHTML = `<h3>Order #${orderId}</h3>
                                        <p>${purchaseDate}</p>`;
                    products.forEach(elem => {
                        const quantity = elem[elem.length-1];
                        const product = elem.substring(0, elem.length-1);

                        itemDiv.innerHTML += `<p>x ${quantity} ${product}</p>`;
                    })

                    rowDiv.append(itemDiv)

                    const cancelBtnDiv = document.createElement('div');
                    cancelBtnDiv.className = 'cancel-btn-wrapper';
                    cancelBtnDiv.innerHTML = `<button class='cancel-btn' onclick='openCancelModal(${orderId})'>Cancel</button>`;
                    
                    const modalDiv = document.createElement('div');
                    modalDiv.className = 'modal';
                    modalDiv.id = 'cancelModal';
                    modalDiv.innerHTML = `
                        <div class='modal-content'>
                            <span id='closeModalBtn'>X</span>
                            <h1 id='modalTitle'></h1>
                            <p id='modalDesc'>Are you sure you want to cancel your order?<br>This action cannot be undone.</p>
                            <button id=cancelOrderBtn>CANCEL MY ORDER</button>
                        </div>`;

                    rowDiv.append(cancelBtnDiv);

                    ordersDiv.appendChild(rowDiv);
                    ordersDiv.appendChild(modalDiv);

                    if (!isLastItem) {
                        ordersDiv.innerHTML += `<div class='divider'></div>`;
                    }
                    
                });
                dataDiv.appendChild(ordersDiv);
            } else if (results.numOrders == 0) {
                // const custId = results.data[0].cust_id;

                const nameDiv = document.createElement('div');
                nameDiv.className = 'name-wrapper';
                nameDiv.innerHTML = `<div>
                                        <span class='name-header'>Welcome, ${results.data[0].first_name}!</span>
                                        <br>
                                        <p style='padding-left: 5px;'>Past Purchases<p>
                                    </div>
                                    <div>
                                        <button class='update-info-btn' onclick="showAccountSettings('${email}', '${password}')">Settings</button>
                                        <button class='update-info-btn' onclick="logout()">Log out</button>
                                    </div>`;
                dataDiv.appendChild(nameDiv);
                const ordersDiv = document.createElement('div')
                ordersDiv.className = "order-wrapper";
                ordersDiv.innerHTML = "<p style='padding-left: 30px;'>No orders found.</p>"
                dataDiv.appendChild(ordersDiv);
            }
            
            document.getElementById('loginForm').style.display = 'none';
            dataDiv.style.display = 'flex';
            dataDiv.style.flexDirection = 'column';
            dataDiv.style.justifyContent = 'center'; 
            document.getElementById('accountSettings').style.display = 'none';
            document.getElementById('accountSettings').innerHTML = '';

        } else { alert(results.message) };
    } catch (error) { console.error('Error logging in: ', error); }
}

async function showAccountSettings(email, password) {
    // const email = localStorage.getItem('email'); //document.getElementById('email').value;
    // const password = localStorage.getItem('password') //document.getElementById('password').value;
    // console.log(email, password)
    try {
        const response = await fetch('http://localhost:3000/accountInfo', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ email, password })
        });
        const results = await response.json();
        if (results.success) {
            localStorage.setItem('email', email);
            localStorage.setItem('password', password);

            const custId = results.data[0].cust_id;

            const dataDiv = document.getElementById('results')
            dataDiv.style.display = 'none';

            const settingsDiv = document.getElementById('accountSettings');
            settingsDiv.innerHTML = ''; // clear out

            const nameDiv = document.createElement('div');
            nameDiv.className = 'name-wrapper';
            nameDiv.innerHTML = `<div>
                                    <span class='name-header'>Welcome, ${results.data[0].first_name}!</span>
                                    <br>
                                    <p style='padding-left: 5px;'>Update/Add Account Settings<p>
                                </div>
                                <div>
                                    <button class='update-info-btn' onclick="showOrderHistory('${email}', '${password}')">Order History</button>
                                    <button class='update-info-btn' onclick="logout()">Log out</button>
                                </div>`;
            settingsDiv.appendChild(nameDiv);
            const accountInfoDiv = document.createElement('div');
            accountInfoDiv.className = "account-info-wrapper";
            results.data.forEach(row => {
                const formDiv = document.createElement('div');
                formDiv.className = "customer-info";

                formDiv.innerHTML = `
                    <form id="updateCustomerForm">
                        <div class="form-item-wrapper">
                            <div class="label-input-wrapper">
                                <p>First Name</p>
                                <input type="text" id="firstName" name="firstName" placeholder="${(row.first_name) ? row.first_name : ''}">
                            </div>
                            <div class="label-input-wrapper">
                                <p>Last Name</p>
                                <input type="text" id="lastName" name="lastName" placeholder="${(row.last_name) ? row.last_name : ''}">
                            </div>
                        </div>
                        <div class="label-input-wrapper">
                                <p>Phone Number</p>
                                <input type="tel" id="phone" name="phone" maxlength="10" placeholder="${(row.phone) ? row.phone : ''}" >
                        </div>
                        <div class="label-input-wrapper">
                            <p>Address</p>
                            <input type="text" id="address" name="address" placeholder="${(row.address) ? row.address : ''}">
                        </div>
                        <div class="form-item-wrapper">
                            <div class="label-input-wrapper">
                                <p>City</p>
                                <input type="text" id="city" name="city" placeholder="${(row.city) ? row.city : ''}">
                            </div>
                            <div class="label-input-wrapper">
                                <p>State</p>
                                <input type="text" id="state" name="state" placeholder="${(row.state) ? row.state : ''}" >
                            </div>
                        </div>
                        <div class="form-item-wrapper">
                            <div class="label-input-wrapper">
                                <p>Zip</p>
                                <input type="text" id="zip" name="zip" placeholder="${(row.zip) ? row.zip : ''}" >
                            </div>
                            <div class="label-input-wrapper">
                                <p>Country</p>
                                <input type="text" id="country" name="country" placeholder="${(row.country) ? row.country : ''}">
                            </div>
                        </div>
                        <div class="label-input-wrapper">
                            <p>Credit Card Number</p>
                            <input type="text" id="cardNumber" name="cardNumber" pattern="[0-9]{16}" placeholder="${(row.card_number) ? row.card_number : ''}" maxlength="16">
                        </div>
                        <div class="form-item-wrapper">
                            <div class="label-input-wrapper">
                                <p>Expiry Date</p>
                                <input type="month" id="expiryDate" name="expiryDate" placeholder="${(row.expr_date) ? row.expr_date : ''}">
                            </div>
                            <div class="label-input-wrapper">
                                <p>CVV</p>
                                <input type="password" id="cvv" name="cvv" pattern="[0-9]{3}" placeholder="${(row.cvv) ? 'xxx' : ''}" maxlength="3">
                            </div>
                        </div>
                        <br>
                        <div class="label-input-wrapper">
                            <button type="button" id="saveChangesBtn" onclick="updateInfo(${custId})">Save Changes</button>
                        </div>
                    </form>`;
                accountInfoDiv.appendChild(formDiv);

                
            settingsDiv.appendChild(accountInfoDiv);
            
            settingsDiv.style.display = 'flex';
            settingsDiv.style.flexDirection = 'column';
            

            })
        } else { alert(results.message) };
    } catch (error) { console.error('Error getting account details: ', error); }

}

async function updateInfo(custId) {
    const formData = {
        custId: custId,
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zip: document.getElementById('zip').value,
        country: document.getElementById('country').value,
        cardNumber: document.getElementById('cardNumber').value,
        expiryDate: document.getElementById('expiryDate').value,
        cvv: document.getElementById('cvv').value,
    };

    try {
        const response = await fetch('http://localhost:3000/updateAccount', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ formData }),
        });

        const message = await response.text();

        if (response.ok) {
            alert('Customer updated successfully!');
        } else {
            alert('Failed to update customer: ' + message);
        }
    } catch (error) {
        alert('Error updating customer: ' + error.message);
    }
        
    
}
