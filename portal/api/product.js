// const getProductsData = async () => {
//             renderSkeletons(6);
//             await new Promise(r => setTimeout(r, 650)); // simulate network latency

//                 try {
//                     const response = await fetch(`${backendUrl}/product/${paramsValue}`, {
//                         method: 'GET',
//                         headers: { 'Content-Type': 'application/json' }
//                     })

//                     if (!response.ok) {
//                         showAlert('No data available', "error")
//                     }

//                     const data = await response.json()
//                     if (data.status === 'error') {
//                         showAlert(`${data.message}`, `${data.status}`)
//                     }

//                     if (data.status === 'success') {
                        
//                             window.__productsById = {};
//                             data.result.forEach(item => { window.__productsById[item._id] = item; });
//                             renderGrid();
//                     }
//                 } catch (error) {
//                     console.log(error)
//                     showAlert('Server Error: Error getting product data', "error")
//                 }
//         };

const getProductById = async (productId) => {
    try {
        const response = await fetch(`${backendUrl}/product/id/${paramsValue}?product_id=${productId}`)

        if (!response.ok) {
            showAlert('No data available', "error")
        }

        const data = await response.json()
        if (data.status === 'error') {
            showAlert(`${data.message}`, `${data.status}`)
        }

        if (data.status === 'success') {
            // document.querySelector('meta[property="og:title"]').setAttribute("content", data.result[0].name);
            // document.querySelector('meta[property="og:description"]').setAttribute("content", data.result[0].description);
            // document.querySelector('meta[property="og:image"]').setAttribute("content", data.result[0].images[0]);
            // document.querySelector('meta[property="og:url"]').setAttribute("content", productUrl+`/frontend/product.html?id=${data.result[0].vendor.username}&pid=${data.result[0]._id}}`);
            
            return data.result[0]
            
        }
    } catch (error) {
        console.log(error)
        showAlert('Server Error: Error getting product data by ID', "error")
    }
}

// ============================================
// Vendor Dashboard Product API Call
// ============================================

let productCurrentPage = 1;
let productLimit = 10;
let ProductTotalPages = 1;
let fetchedProduct ;
const getAllVendorProduct = async () => {
    const tbody = document.getElementById('productsTableBody');
    tbody.innerHTML = ""

    try {
        const response = await fetch(`${backendUrl}/product/vendor/${paramsValue}?limit=${productLimit}&page=${productCurrentPage}`, {
            method: 'GET',
            credentials: "include",
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
            ProductTotalPages = data.result.totalPages
            document.getElementById("totalProductCount").textContent = data.result.totalRecords
            fetchedProduct  = data.result
            loadProducts(data.result)
        }
    } catch (error) {
        console.log(error)
        showAlert('Server Error: Error getting all vendor products', "error")
    }
}

// Product Next Button pagination
async function productNextBtn() {
    if (productCurrentPage < ProductTotalPages) {
        productCurrentPage++;
        console.log(productCurrentPage, ProductTotalPages)
        getAllVendorProduct();
    } else {
        showAlert("No more transactions to display", "info");
    }
}

// Product Previou Button pagination
async function productPrevBtn() {
    if (productCurrentPage > 1) {
        productCurrentPage--;
        getAllVendorProduct();
    } else {
        showAlert("No more transactions to display", "info");
    }
}

// Load vendor product list
function loadProducts(data) {
    let vendorData = data.data
    let status_plan = document.getElementById("status_plan")
    let account_status = document.getElementById("account_status")
    localStorage.removeItem("currentProductId"); // Clear currentProductId from localStorage when loading products list NOTE: this was setup on edit product to determine whether to add or update a product, so it must be cleared when loading the products list to prevent unintended updates when adding a new product after editing. 


    // status_plan.textContent = vendorData.plan.charAt(0).toUpperCase() + vendorData.plan.slice(1).toLowerCase();
    // account_status.textContent = vendorData.status.charAt(0).toUpperCase() + vendorData.status.slice(1).toLowerCase();

    const tbody = document.getElementById('productsTableBody');
    vendorData.forEach(product => {
        tbody.innerHTML += `<tr style='font-size: 12px'>
                    <td>${product.name}</td>
                    <td><textarea rows='1' style='border: none; outline: none; background: transparent;'>${product.description}</textarea></td>
                    <td>₦${Number(product.price.toFixed(2) || 0).toLocaleString()}</td>
                    <td><img src='${product.images[0]}' loading='lazy' data-img='${JSON.stringify(product.images)}' width='50px' height='50px' class='img-view'></td>
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
    let currentImage = document.querySelector(".currentImage");


    currentImage.innerHTML = "";


    function imagePreviewBlog() {
        document.getElementById("productImages").onchange = function () {

            Array.from(this.files).forEach(file => {

                currentImage.innerHTML += `
                    <div class="currentimageItem">
                        <img src="${URL.createObjectURL(file)}" loading="lazy" width="70px" height="70px" style="border-radius: 10px; margin: 0 10px;" class="imageName">
                        <i class="fa-solid fa-x removeImage" style="font-size: 10px; position: absolute; transform: translateX(-30px); background: #e3e3e3; padding: 5px; border-radius: 5px;"></i>
                    </div>
                `;
            });
        };
    }


    if (productId) {

        const product = fetchedProduct.data.find(p => p._id === productId);

        document.getElementById('modalTitle').textContent = 'Edit Product';
        document.getElementById('productName').value = product.name;
        document.getElementById('productPrice').value = product.price;
        document.getElementById('productDescription').value = product.description || '';

        currentEditId = productId;

        // Store old images
        existingImages = [...product.images];
        product.images.forEach(item => {

            currentImage.innerHTML += `
                <div class="currentimageItem">
                    <img src="${item}" loading="lazy" width="70px" height="70px" style="border-radius: 10px; margin: 0 10px;" class="imageName">
                    <i class="fa-solid fa-x removeImage" style="font-size: 10px; position: absolute; transform: translateX(-30px); background: #e3e3e3; padding: 5px; border-radius: 5px;"></i>
                </div>
            `;
        });


        const productImagesInput = document.getElementById("productImages");

        // Prevent duplicate listeners
        productImagesInput.onchange = function () {

            Array.from(this.files).forEach(file => {

                currentImage.innerHTML += `
                    <div class="currentimageItem">
                        <img src="${URL.createObjectURL(file)}" loading="lazy" width="70" height="70" style="border-radius:10px; margin:0 10px;" class="imageName">
                        <i class="fa-solid "fa-x removeImage" style="font-size:10px;position:absolute;transform:translateX(-30px);background:#e3e3e3;padding:5px;border-radius:5px;"></i>
                    </div>
                `;
            });
        };


        // Prevent duplicate listeners
        currentImage.onclick = function (e) {
            if (!e.target.classList.contains("removeImage")) return;
            const imageItem = e.target.parentElement;
            const imgSrc = imageItem.querySelector("img").src;

            // Remove existing image only
            existingImages = existingImages.filter(url => url !== imgSrc);
            imageItem.remove();

        };


    } else {

        console.log(productId);

        imagePreviewBlog();

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
        console.log(productImagesInput)
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
    const maxSize = 5 * 1024 * 1024; // 5MB

    for (let img of productImages) {
        if (!allowedTypes.includes(img.type)) {
            showAlert("Only JPG, PNG, or WEBP images are allowed", "error")
            loading()
            return;
        }

        if (img.size > maxSize) {
            showAlert("Each image must be less than 5MB", "error")
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
                return;
            }

            if (document.getElementById("modalTitle").textContent === "Add New Product") {
                console.log(localStorage.getItem("currentProductId"))
                sendDataToBackend(StorageData.urls)
            }else {
                console.log(localStorage.getItem("currentProductId"))
                existingImages = [...existingImages, ...StorageData.urls];
                sendDataToBackend(existingImages)
            }


            return;
        } else {
            showAlert(StorageData.message || "Upload failed", "error");
            loading()
            return;
        }

    } catch (error) {
        console.error(error);
        showAlert("Server error occurred while uploading images", "error");
        loading()
        return;
    }

    /* ================= SEND TO BACKEND ================= */
    // Check if the modal title is "Edit Product" to determine whether to update or add a new product
    
        async function sendDataToBackend(urls) {
            const currentProductId = localStorage.getItem("currentProductId");
            let JSONFormData = {
                name: safeName,
                price: productPrice,
                description: safeDescription,
                image: urls,
            }

            const endpoint = currentProductId ? `${backendUrl}/product/vendor/${paramsValue}/${currentProductId}` : `${backendUrl}/product/vendor/${paramsValue}`;
            const method = currentProductId ? "PUT" : "POST";
            const action = currentProductId ? "updating" : "adding";

            try {
                const response = await fetch(endpoint, {
                    method: method,
                    credentials: "include",
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
                    localStorage.removeItem("currentProductId");
                    setTimeout(() => {
                        window.location.href = ""
                    }, 2000);

                } else {
                    showAlert(data.message, data.status)
                    loading()
                }

            } catch (error) {
                console.log(error)
                showAlert(`Server error occurred while ${action} product`, "error")
                loading()
            }
        }
}

// Edit product
function editProduct(id) {
    localStorage.setItem("currentProductId", id);
    openProductModal(id);
}

// Delete Product
async function deleteProduct(id) {

    if (confirm("Do you wish to delete product")) {
        try {
            const response = await fetch(`${backendUrl}/product/vendor/${paramsValue}/${id}`, {
                method: "DELETE",
                credentials: "include",
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

