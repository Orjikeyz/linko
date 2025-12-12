const params = new URLSearchParams(window.location.search)
const paramsValue = params.get('id')
const productId = params.get('pid')

if (paramsValue === '' || !paramsValue) {
    document.getElementsByTagName("body")[0].style.display = "none"
    window.location.href = '404'
}
let productUrl = "https://linkohub.vercel.app/"

const getProductsData = async () => {
    try {
        const response = await fetch(`http://localhost:3000/product/${paramsValue}`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        })

        if (!response.ok) {
            showAlert('No data available', "error")
        }

        const data = await response.json()
        if (data.status === 'error') {
            showAlert(`${data.message}`, `${data.status}`)
        }

        if (data.status === 'success') {

            data.result.forEach(item => {
                let productGrid = document.getElementById("productGrid")
                productGrid.innerHTML += `
                    <a href="products?id=${paramsValue}&pid=${item._id}">
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
        showAlert('Server Error. Please try again later', "error")
    }
}

const getProductById = async () => {
    let backBtnHref = document.getElementById("backBtnHref")
    backBtnHref.href = `index?id=${paramsValue}`

    if (!productId) {
        window.location.href = '404'
    }

    try {
        const response = await fetch(`http://localhost:3000/product/id/${productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'product_id': productId,
                'vendor_username': paramsValue
            }
        })

        if (!response.ok) {
            showAlert('No data available', "error")
        }

        const data = await response.json()
        if (data.status === 'error') {
            showAlert(`${data.message}`, `${data.status}`)
        }

        if (data.status === 'success') {
            let productName = document.getElementById("productName")
            let productDescription = document.getElementById("productDescription")
            let price = document.getElementById("price")
            let img_list = document.querySelector(".img-list")
            let main_img = document.getElementById("main-img")

            productName.textContent = data.result[0].name
            productDescription.textContent = data.result[0].description
            price.textContent = data.result[0].price
            let vendorNumber = data.result[0].vendor.phone_number;
            main_img.src = data.result[0].images[0]

            let buy = document.querySelector("#buy")

            data.result[0].images.forEach(img => {
                img_list.innerHTML += `<img src="${img}" loading="lazy" class="img-list-item">`

                let img_list_item = document.querySelectorAll(".img-list-item")


                img_list_item.forEach(item => {
                    main_img.classList.remove("main-img-toggle")
                    item.addEventListener("click", function () {
                        if (main_img.src === item.src) return;
                        main_img.classList.remove("main-img-toggle")
                        void main_img.offsetWidth;
                        main_img.classList.add("main-img-toggle")
                        main_img.src = item.src
                    })
                });
            });


            // Check plan flow 

            buy.addEventListener("click", function () {
                if (data.plan === "free") {
                    generateWhatsAppMessage(productName.textContent, productDescription.textContent, price.textContent, productUrl, vendorNumber)
                } else {
                    console.log("dffernet plan")
                }
            })


        }
    } catch (error) {
        showAlert('Server Error. Please try again later', "error")
    }
}

// Vendor Dashboard Product API Call
const getAllVendorProduct = async () => {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = ""
    let cachedProduct = localStorage.getItem("products")
    if (cachedProduct) {
        loadProducts(JSON.parse(cachedProduct))
        console.log("cached")
    } else {
        console.log("api")
        try {
            const response = await fetch(`http://localhost:3000/product/vendor/${paramsValue}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            })

            if (!response.ok) {
                showAlert('No data available', "error")
            }

            const data = await response.json()
            if (data.status === 'error') {
                showAlert(`${data.message}`, `${data.status}`)
            }

            if (data.status === 'success') {
                localStorage.removeItem("products");

                cachedProduct = localStorage.setItem("products", JSON.stringify(data.result))
                loadProducts(data.result)
            }
        } catch (error) {
            showAlert('Server Error. Please try again later', "error")
        }
    }

}

// Load product
function loadProducts(data) {
    const tbody = document.getElementById('productsTableBody');
    data.forEach(product => {
        tbody.innerHTML += `<tr>
                    <td>${product.name}</td>
                    <td><textarea rows='5' style='border: none; outline: none; background: transparent;'>${product.description}</textarea></td>
                    <td>₦${product.price.toFixed(2)}</td>
                    <td><img src='${product.images[0]}' loading='lazy' data-img='${JSON.stringify(product.images)}' width='70px' height='70px' class='img-view'></td>
                    <td>status</td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-small btn-edit" onclick="editProduct(${product._id})">Edit</button>
                            <button class="btn btn-small btn-delete" onclick="deleteProduct(${product._id})">Delete</button>
                        </div>
                    </td>
                </tr>`
    });

    let img_view = document.querySelectorAll(".img-view")
    img_view.forEach(item => {
        item.addEventListener("click", function () {
            let dataimg = JSON.parse(item.getAttribute("data-img"))
            let modal_img_overview_container = document.querySelector(".modal-img-overview-container")
            let img_overview_main = document.getElementById("img-overview-main")
            let img_overview_list = document.querySelector(".img-overview-list")
            let close_img_overview = document.getElementById('close-img-overview')

            modal_img_overview_container.style.display = "block"
            img_overview_main.src = item.src

            close_img_overview.addEventListener("click", function () {
                modal_img_overview_container.style.display = "none"
            })

            img_overview_list.innerHTML = ""

            dataimg.forEach((img, item) => {
                img_overview_list.innerHTML += `<img src="${img}" width="70px" height="70px" class="img-overview-list-item">`
                let img_overview_list_item = document.querySelectorAll(".img-overview-list-item")
                img_overview_list_item.forEach(item => {
                    item.addEventListener("click", function () {
                        img_overview_main.src = item.src
                    })
                });
            });
        })
    });
}

function refreshProductTable() {
    localStorage.removeItem("products");
    getAllVendorProduct()
}