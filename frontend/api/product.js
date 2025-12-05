const getProductsData = async () => {
    const params = new URLSearchParams(window.location.search)
    const paramsValue = params.get('id')

    if (paramsValue === '' || !paramsValue) {
        window.location.href = '404.html'
    }

    try {
        const response = await fetch(`http://localhost:3000/product/${paramsValue}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        if (!response.ok) {
            showAlert('No data available')
        }

        const data = await response.json()
        if (data.status === 'error') {
            showAlert(`${data.message}`, `${data.status}`)
        }

        if (data.status === 'success') {

            data.result.forEach(item => {
                let productGrid = document.getElementById("productGrid")
                productGrid.innerHTML += `
                    <a href="products.html">
                <div class="product-card" data-price="${item.price}">
                    <img src="https://www.wamdenim.com/cdn/shop/files/florence_black_shirt_01.jpg?v=1763378903&width=1500"
                        class="product-image" loading="lazy">
                    <div class="product-content">
                        <h3 class="product-title">${item.name}</h3>
                        <div class="product-footer">
                            <span class="product-price">₦${item.price}</span>
                            <button class="buy-btn">Buy Now</button>
                        </div>
                    </div>
                </div>
            </a>
        `
            });
        }
    } catch (error) {
        showAlert('Server Error. Please try again later')
    }
}

getProductsData()
