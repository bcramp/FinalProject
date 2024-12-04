function openModal(name, description, type, heightReq, location, imgPath) {
    const modal = document.getElementById('rideModal')
    const modalImg = document.getElementById("modalImg");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    const modalType = document.getElementById("modalType");
    const modalHeight = document.getElementById("modalHeight");
    const modalLocation = document.getElementById("modalLocation");

    modalImg.src = imgPath;
    modalTitle.textContent = name;
    modalDesc.textContent = description;
    modalType.innerHTML = `<strong>Ride Type:</strong> ${type}`;
    modalHeight.innerHTML = `<strong>Height Requirement:</strong> ${heightReq}"`;
    modalLocation.innerHTML = `<strong>Located In:</strong> ${location}`;

    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.alignItems = 'center';

    window.addEventListener('click', (event) => {
        if (event.target == modal) modal.style.display = 'none';
    });
    
}

function openDiningModal(name, description, type, dietaryOptions, location, imgPath) {
    const modal = document.getElementById('diningModal')
    const modalImg = document.getElementById("modalImg");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    const modalType = document.getElementById("modalType");
    const modalHeight = document.getElementById("modalDietaryOptions");
    const modalLocation = document.getElementById("modalLocation");

    modalImg.src = imgPath;
    modalTitle.textContent = name;
    modalDesc.textContent = description;
    modalType.innerHTML = `<strong>Cuisine:</strong> ${type}`;
    modalHeight.innerHTML = `<strong>Dietary Options:</strong> ${dietaryOptions}`;
    modalLocation.innerHTML = `<strong>Located In:</strong> ${location}`;

    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.alignItems = 'center';

    window.addEventListener('click', (event) => {
        if (event.target == modal) modal.style.display = 'none';
    });
    
}

function openShopsModal(name, description, type, location, imgPath) {
    const modal = document.getElementById('diningModal')
    const modalImg = document.getElementById("modalImg");
    const modalTitle = document.getElementById("modalTitle");
    const modalDesc = document.getElementById("modalDesc");
    const modalType = document.getElementById("modalType");
    const modalLocation = document.getElementById("modalLocation");

    modalImg.src = imgPath;
    modalTitle.textContent = name;
    modalDesc.textContent = description;
    modalType.innerHTML = `<strong>Type:</strong> ${type}`;
    modalLocation.innerHTML = `<strong>Located In:</strong> ${location}`;

    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.alignItems = 'center';

    window.addEventListener('click', (event) => {
        if (event.target == modal) modal.style.display = 'none';
    });
    
}

function test() {
    console.log("test")
}

function openCancelModal(orderId) {
    // console.log("cancel")

    const modal = document.getElementById('cancelModal');
    const modalCloseBtn = document.getElementById('closeModalBtn');
    const modalTitle = document.getElementById('modalTitle');
    const modalCancelBtn = document.getElementById('cancelOrderBtn');
    
    modalCloseBtn.onclick = function() { modal.style.display = 'none'; }
    modalTitle.textContent = "Order #" + orderId;
    modalCancelBtn.onclick = async function () {
        try {
            const response = await fetch(`/delete/${orderId}`, {
              method: 'DELETE',
              headers: { 'Content-Type': 'application/json' },
            });
            if (response.ok) {
              alert('Order deleted successfully');
              modal.style.display = 'none';
            } else {
              alert('Failed to delete the record');
            }
          } catch (error) {
            console.error('Error:', error);
          }
    }

    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';

    window.addEventListener('click', (event) => {
        if (event.target == modal) modal.style.display = 'none';
    });
}