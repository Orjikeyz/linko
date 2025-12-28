let orders = [
    { id: "ORD-1234", product: "Premium Beat Pack Vol. 1", customer: "John Doe", email: "john@example.com", amount: 49.99, date: "2024-01-15", status: "Completed" },
    { id: "ORD-1233", product: "Music Production Masterclass", customer: "Jane Smith", email: "jane@example.com", amount: 99.99, date: "2024-01-14", status: "Completed" },
    { id: "ORD-1232", product: "Serum Preset Bank", customer: "Mike Johnson", email: "mike@example.com", amount: 29.99, date: "2024-01-14", status: "Completed" },
    { id: "ORD-1231", product: "Hip Hop Heat Vol. 2", customer: "Sarah Williams", email: "sarah@example.com", amount: 44.99, date: "2024-01-13", status: "Processing" },
    { id: "ORD-1230", product: "Music Theory for Producers", customer: "David Brown", email: "david@example.com", amount: 19.99, date: "2024-01-13", status: "Completed" }
];


loadProducts();
loadOrders();


// Navigation
function showSection(section) {
    // Hide all sections
    document.querySelectorAll('.dashboard-section').forEach(s => s.style.display = 'none');

    // Remove active class from all nav links
    document.querySelectorAll('.sidebar-nav a').forEach(a => {
        a.classList.remove('active');
    });

    // Show selected section
    document.getElementById(section + 'Section').style.display = 'block';

    if (section === "products") {
        getAllVendorProduct()
    }

    // Add active class to clicked nav link
    event.target.classList.add('active');
}

// Products Management
// function loadProducts() {
//     const tbody = document.getElementById('productsTableBody');
//     tbody.innerHTML = products.map(product => `
//                 <tr>
//                     <td>${product.name}</td>
//                     <td>${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</td>
//                     <td>$${product.price.toFixed(2)}</td>
//                     <td>
//                         <span class="badge ${product.status === 'active' ? 'badge-active' : 'badge-inactive'}">
//                             ${product.status.charAt(0).toUpperCase() + product.status.slice(1)}
//                         </span>
//                     </td>
//                     <td>${product.sales} units</td>
//                     <td>
//                         <div class="action-buttons">
//                             <button class="btn btn-small btn-edit" onclick="editProduct(${product.id})">Edit</button>
//                             <button class="btn btn-small btn-delete" onclick="deleteProduct(${product.id})">Delete</button>
//                         </div>
//                     </td>
//                 </tr>
//             `).join('');
// }


function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.getElementById('productForm').reset();
    currentEditId = null;
}


function deleteProduct(id) {
    if (confirm('Are you sure you want to delete this product?')) {
        products = products.filter(p => p.id !== id);
        loadProducts();
    }
}

document.getElementById('productForm').addEventListener('submit', (e) => {
    e.preventDefault();

    const productData = {
        name: document.getElementById('productName').value,
        category: document.getElementById('productCategory').value,
        price: parseFloat(document.getElementById('productPrice').value),
        description: document.getElementById('productDescription').value,
        status: document.getElementById('productStatus').value,
    };

    if (currentEditId) {
        // Edit existing product
        const index = products.findIndex(p => p.id === currentEditId);
        products[index] = { ...products[index], ...productData };
    } else {
        // Add new product
        const newId = Math.max(...products.map(p => p.id)) + 1;
        products.push({ id: newId, ...productData, sales: 0 });
    }

    loadProducts();
    closeProductModal();
});

// Orders Management
function loadOrders() {
    const tbody = document.getElementById('ordersTableBody');
    tbody.innerHTML = orders.map(order => `
                <tr>
                    <td>${order.id}</td>
                    <td>${order.product}</td>
                    <td>${order.customer}</td>
                    <td>${order.email}</td>
                    <td>$${order.amount.toFixed(2)}</td>
                    <td>${order.date}</td>
                    <td>
                        <span class="badge ${order.status === 'Completed' ? 'badge-active' : 'badge-inactive'}">
                            ${order.status}
                        </span>
                    </td>
                </tr>
            `).join('');
}
