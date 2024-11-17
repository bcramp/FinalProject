function openModal(name, description, type, heightReq, location, imgPath) {
    const modal = document.getElementById('rideModal');
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
