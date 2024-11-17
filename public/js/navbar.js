function showDropdown() {
    document.getElementById("ticketsDropdown").classList.toggle("show");
}
function showDropdown2() {
    document.getElementById("ridesDropdown").classList.toggle("show");
}
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