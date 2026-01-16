// Navigation
getAllVendorProduct()
getVendorDashboardData()
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(s => s.style.display = 'none');

    // Remove active class from all nav links
    document.querySelectorAll('.sidebar-nav a').forEach(a => {
        a.classList.remove('active');
    });

    // Show selected section
    document.getElementById(section + 'Section').style.display = 'block';

    // if (section === "products") {
    // }

    // Add active class to clicked nav link
    event.target.classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.getElementById('productForm').reset();
    currentEditId = null;
}

