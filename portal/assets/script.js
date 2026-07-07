
        let year = new Date().getFullYear();
        document.getElementById("yearText").textContent = year
        // Filter functionality
        const filterBtns = document.querySelectorAll('.filter-btn');
        const productCards = document.querySelectorAll('.product-card');

        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                // Remove active class from all buttons
                filterBtns.forEach(b => b.classList.remove('active'));
                // Add active class to clicked button
                btn.classList.add('active');

                const filter = btn.dataset.filter;

                productCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();

            productCards.forEach(card => {
                const title = card.querySelector('.product-title').textContent.toLowerCase();
                const description = card.querySelector('.product-description').textContent.toLowerCase();

                if (title.includes(searchTerm) || description.includes(searchTerm)) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });


let currentPage = 1;
let totalPages = "-";
let product_limit = 20;

const prevBtn = document.querySelector(".prev");
const nextBtn = document.querySelector(".next");
const pageInfo = document.querySelector(".page-info");

function updatePagination() {
    pageInfo.innerHTML = `Page <strong>${currentPage}</strong> of <strong>${totalPages}</strong>`;

    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

const getProductsData = async () => {
    renderSkeletons(6);
    await new Promise(r => setTimeout(r, 650)); // simulate network latency

    try {
        const response = await fetch(`${backendUrl}/product/${paramsValue}?limit=${product_limit}&page=${currentPage}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        if (!response.ok) {
            showAlert('No data available', "error")
        }

        const data = await response.json()
        if (data.status === 'error') {
            productGrid.innerHTML = `
            `;

            showAlert(`${data.message}`, `${data.status}`)
            return
        }

        if (data.status === 'success') {
            totalPages = data.result.totalPages
            window.__productsById = {};
            data.result.data.forEach(item => { window.__productsById[item._id] = item; });
            renderGrid();
        }
    } catch (error) {
        console.log(error)
        showAlert('Server Error: Error getting product data', "error")
    }
};

prevBtn.addEventListener("click", async () => {
    if (currentPage > 1) {
        currentPage--;
        updatePagination();
        await getProductsData();
    }else {
        showAlert("No product to display", "info");
    }
});

nextBtn.addEventListener("click", async () => {
    if (currentPage < totalPages) {
        currentPage++;
        updatePagination();
        await getProductsData();
    }else {
        showAlert("No product to display", "info");
    }
});

// Initial load
updatePagination();
getProductsData()