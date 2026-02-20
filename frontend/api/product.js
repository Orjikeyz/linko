const getProductsData = async () => {
    try {
        const response = await fetch(`${backendUrl}/product/${paramsValue}`, {
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
                    <a href="products.html?id=${paramsValue}&pid=${item._id}">
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
    backBtnHref.href = `index.html?id=${paramsValue}`

    if (!productId) {
        window.location.href = '404'
    }

    try {
        const response = await fetch(`${backendUrl}/product/id/${productId}`, {
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
    getTotalProduct(paramsValue)
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = ""
    let cachedProduct = localStorage.getItem("products")
    if (cachedProduct) {
        loadProducts(JSON.parse(cachedProduct))
        console.log("cached")
    } else {
        console.log("api")
        try {
            const response = await fetch(`${backendUrl}/product/vendor/${paramsValue}`, {
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

// Load vendor product list
function loadProducts(data) {
    let vendorData = JSON.parse(localStorage.getItem("vendorData"))
    let status_plan = document.getElementById("status_plan")
    let account_status = document.getElementById("account_status")

    status_plan.textContent = vendorData.plan.charAt(0).toUpperCase() + vendorData.plan.slice(1).toLowerCase();
    account_status.textContent = vendorData.status.charAt(0).toUpperCase() + vendorData.status.slice(1).toLowerCase();

    const tbody = document.getElementById('productsTableBody');
    data.forEach(product => {
        tbody.innerHTML += `<tr>
                    <td>${product.name}</td>
                    <td><textarea rows='5' style='border: none; outline: none; background: transparent;'>${product.description}</textarea></td>
                    <td>₦${product.price.toFixed(2)}</td>
                    <td><img src='${product.images[0]}' loading='lazy' data-img='${JSON.stringify(product.images)}' width='70px' height='70px' class='img-view'></td>
                    <td>
                        <div class="action-buttons">
                            <button class="btn btn-small btn-edit" onclick="editProduct('${product._id}')">Edit</button>
                            <button class="btn btn-small btn-delete" onclick="deleteProduct('${product._id}')">Delete</button>
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

// Open modal edit/ add product 
function openProductModal(productId) {
    const modal = document.getElementById('productModal');
    const form = document.getElementById('productForm');
    let cachedProduct = JSON.parse(localStorage.getItem("products"))
    let currentImage = document.querySelector(".currentImage")

    currentImage.innerHTML = ""

    if (productId) {
        const product = cachedProduct.find(p => p._id === productId);
        document.getElementById('modalTitle').textContent = 'Edit Product';
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productDescription').value = product.description || '';
        currentEditId = productId;
        let removeImage = document.querySelectorAll(".removeImage")
        let imageName = document.querySelectorAll(".imageName")


        product.images.forEach(item => {
            currentImage.innerHTML += `
            <div class="currentimageItem">
                <img src="${item}"
                    loading="lazy" width="70px" height="70px" style="border-radius: 10px; margin: 0 10px;" class="imageName">
                <i class="fa-solid fa-x removeImage" style="font-size: 10px; position: absolute; transform: translateX(-30px); background: #e3e3e3; padding: 5px; border-radius: 5px;"></i>
            </div>
        `
        });

        removeImage.forEach((removeImageItem, index) => {
            removeImageItem.addEventListener("click", () => {
                console.log(index)
            })
        });
    } else {
        document.getElementById('modalTitle').textContent = 'Add New Product';
        form.reset();
        currentEditId = null;
    }

    modal.classList.add('active');
}



function escapeHTML(str) {
    return str
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#x27;");
}

// Add Product
const addProduct = async () => {
    let plan = JSON.parse(localStorage.getItem("vendorData")).plan
    let save_btn = document.getElementById("save_btn")
    let load_btn = document.getElementById("load_btn")

    function loading() {
        setTimeout(() => {
            save_btn.style.display = "block"
            load_btn.style.display = "none"
        }, 1000);
    }

    save_btn.style.display = "none"
    load_btn.style.display = "block"

    const productNameInput = document.getElementById("productName");
    const productPriceInput = document.getElementById("productPrice");
    const productDescriptionInput = document.getElementById("productDescription");
    const productImagesInput = document.getElementById("productImages");

    const productName = productNameInput.value.trim();
    const productPrice = productPriceInput.value.trim();
    const productDescription = productDescriptionInput.value.trim();
    const productImages = productImagesInput.files;

    /* ================= VALIDATION ================= */

    if (!productName || productName.length < 3) {
        showAlert("Product name must be at least 3 characters", "error")
        loading()
        return;
    }

    if (!productPrice || isNaN(productPrice) || Number(productPrice) <= 0) {
        showAlert("Enter a valid product price", "error")
        loading()
        return;
    }

    if (!productImages || productImages.length === 0) {
        showAlert("Please upload at least one image", "error")
        loading()
        return;
    }


    if (plan === "free" && productImages.length > 1) {
        showAlert("Free plan allows only 1 image", "error");
        loading();
        return;
    }

    if (plan !== "free" && productImages.length > 5) {
        showAlert("You can upload a maximum of 5 images", "error");
        loading();
        return;
    }



    // Image validation
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    const maxSize = 2 * 1024 * 1024; // 2MB

    for (let img of productImages) {
        if (!allowedTypes.includes(img.type)) {
            showAlert("Only JPG, PNG, or WEBP images are allowed", "error")
            loading()
            return;
        }

        if (img.size > maxSize) {
            showAlert("Each image must be less than 2MB", "error")
            loading()
            return;
        }
    }

    /* ================= SANITIZE ================= */

    const safeName = escapeHTML(productName);
    const safeDescription = escapeHTML(productDescription);

    /* ================= FORM DATA ================= */

    const formData = new FormData();
    for (let img of productImages) {
        formData.append("images[]", img);
    }

    /* ================= SEND TO External Storage ================= */

    try {
        const StorageResponse = await fetch("https://judydoesbraids.com/linkostorage/upload.php", {
            method: "POST",
            body: formData
        });

        if (!StorageResponse.ok) {
            showAlert(`Sorry an error occurred while processing request. Please try again later`, "error");
            loading()
            return;
        }

        const StorageData = await StorageResponse.json();

        if (StorageData.status) {

            if (StorageData.count <= 0) {
                showAlert(StorageData.message || "Upload failed. Please try again later", "error");
                loading()
                return
            }

            sendToBackend(StorageData.urls)
        } else {
            showAlert(StorageData.message || "Upload failed", "error");
            loading()
        }

    } catch (error) {
        console.error(error);
        showAlert("Server error occurred", "error");
        loading()
    }


    /* ================= SEND TO BACKEND ================= */
    async function sendToBackend(urls) {
        let JSONFormData = {
            name: safeName,
            price: productPrice,
            description: safeDescription,
            image: urls,
        }

        try {
            const response = await fetch(`${backendUrl}/product/vendor/${paramsValue}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(JSONFormData),
            });

            // Handle non-2xx HTTP responses
            if (!response.ok) {
                showAlert(`HTTP Error: ${response.status}`, "error")
                loading()
            }

            const data = await response.json();

            if (data.status === "success") {
                showAlert(data.message, data.status)
                localStorage.removeItem("products")
                setTimeout(() => {
                    window.location.href = ""
                }, 2000);

            } else {
                showAlert(data.message, data.status)
                loading()
            }

        } catch (error) {
            showAlert(`Server Error`, "error")
            loading()
        }
    }

}


// Edit product
function editProduct(id) {
    openProductModal(id);
}

// Delete Product
async function deleteProduct(id) {

    if (confirm("Do you wish to delete product")) {
        try {
            const response = await fetch(`${backendUrl}/product/vendor/${paramsValue}/${id}`, {
                method: "DELETE",
                headers: {
                    'Content-Type': 'application/json'
                }
            })

            const data = await response.json()

            if (data.status === "error") {
                showAlert(data.message, data.status)
                return
            }

            if (data.status === "success") {
                showAlert(data.message, data.status)
                localStorage.removeItem("products");
                setTimeout(() => {
                    window.location.href = ""
                }, 1000);
                return
            }
        } catch (error) {
            console.log(error)
            showAlert("Sorry an error occurred.", "error")
        }
    }
}

// Get total Product Count
const getTotalProduct = async (id) => {
    try {
        const response = await fetch(`${backendUrl}/product/vendor/totalProduct/${id}`, {
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
            let totalProduct = document.getElementById("totalProduct")
            totalProduct.textContent = data.result.totalProducts
        }
    } catch (error) {
        showAlert('Server Error. Please try again later', "error")
    }
}

function refreshProductTable() {
    localStorage.removeItem("products");
    getAllVendorProduct()
}

