const params = new URLSearchParams(window.location.search)
const paramsValue = params.get('id')
const productId = params.get('pid')

if (paramsValue === '' || !paramsValue) {
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

            productName.textContent = data.result[0].name
            productDescription.textContent = data.result[0].description
            price.textContent = data.result[0].price
            let vendorNumber = data.result[0].vendor.phone_number;

            let buy = document.querySelector("#buy")


            data.result[0].images.forEach(img => {
                img_list.innerHTML += `<img src="${img}"loading="lazy" class="img-list-item">`

                let img_list_item = document.querySelectorAll(".img-list-item")
                let main_img = document.getElementById("main-img")

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

