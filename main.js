document.addEventListener('DOMContentLoaded', function() {
    fetch('data.json')
    .then(response => response.json())
    .then(data => {
        window.fullData = data;
        populateTable(data.slice(0, 10)); // Displaying the first 4 items
        populateFilters(data);
    })
    .catch(error => console.error('Error loading the data:', error));
});

function populateTable(data) {
    const table = document.getElementById('membersTable').getElementsByTagName('tbody')[0];
    table.innerHTML = '';
    data.forEach(item => {
        const row = table.insertRow();
        row.insertCell().textContent = item.firstname + ' ' + item.lastname;
        row.insertCell().textContent = item.email;
        row.insertCell().textContent = item.mobile;
        row.insertCell().textContent = `${item.city}, ${item.state}, ${item.pincode}`;
        row.insertCell().textContent = calculateAge(item.dateOfBirth);
        row.insertCell().textContent = item.gender;
    });
}

function populateFilters(data) {
    const citySet = new Set();
    const citySelect = document.getElementById('cityFilter');
    const genderSelect = document.getElementById('genderFilter');

    data.forEach(item => {
        citySet.add(item.city);
    });

    citySet.forEach(city => {
        citySelect.options.add(new Option(city, city));
    });

    // Gender selection
    genderSelect.options.add(new Option('Male', 'Male'));
    genderSelect.options.add(new Option('Female', 'Female'));

    // Filtering
    citySelect.addEventListener('change', () => filterTable());
    genderSelect.addEventListener('change', () => filterTable());
}

function filterTable() {
    const cityFilter = document.getElementById('cityFilter').value;
    const genderFilter = document.getElementById('genderFilter').value;
    const filteredData = window.fullData.filter(item => {
        const matchesCity = cityFilter ? item.city === cityFilter : true;
        const matchesGender = genderFilter ? item.gender === genderFilter : true;
        return matchesCity && matchesGender;
    });
    populateTable(filteredData);
}

function calculateAge(dob) {
    const birthday = new Date(dob);
    const now = new Date();
    const months = (now.getFullYear() - birthday.getFullYear()) * 12 + now.getMonth() - birthday.getMonth();
    const years = Math.floor(months / 12);
    const extraMonths = months % 12;

    return `${years} yrs ${extraMonths} mns`;
}


// Debounce function for search
function debounce(func, wait, immediate) {
    var timeout;
    return function() {
        var context = this, args = arguments;
        var later = function() {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        var callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

const searchTable = debounce(function() {
    let input = document.getElementById("searchInput");
    let filter = input.value.toUpperCase();
    let table = document.getElementById("membersTable");
    let tr = table.getElementsByTagName("tr");

    for (let i = 0; i < tr.length; i++) {
        let td = tr[i].getElementsByTagName("td")[0];
        if (td) {
            let txtValue = td.textContent || td.innerText;
            tr[i].style.display = (txtValue.toUpperCase().indexOf(filter) > -1) ? "" : "none";
        }
    }
}, 250);
