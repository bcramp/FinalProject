/*
//*** Giannina Flamiano and Brennen Cramp
//*** CSC 621
//*** 12/9/2024
//*** Final project and account creation backend
*/

// Creates the dropdown element for the tickets on the navbar at the top of the page
function showDropdown() {
    document.getElementById("ticketsDropdown").classList.toggle("show");
}

// Creates the dropdown element for the rides on the navbar at the top of the page
function showDropdown2() {
    document.getElementById("ridesDropdown").classList.toggle("show");
}

// Creates the dropdown element for dining/shopping on the navbar at the top of the page
function showDropdown3() {
    document.getElementById("experiencesDropdown").classList.toggle("show");
}

window.onclick = function(event) {
    if (!event.target.matches('.dropbtn')) {
        var dropdowns = document.getElementsByClassName("dropdown-content");
        var i;
        for (i = 0; i < dropdowns.length; i++) {
            var openDropdown = dropdowns[i];
            if (openDropdown.classList.contains('show')) {
                openDropdown.classList.remove('show');
            }
        }
    }
}
