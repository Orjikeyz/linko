async function getProducts() {
    try {
        const response = await fetch(`${backendUrl}/manager/product`, {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            }
        });

        const data = await response.json()
        if (data.status === "error") {
            return showAlert(data.message, data.status)
        }

        // showAlert(data.message, data.status)
        return data;

    } catch (error) {
        console.error("Error fetching products:", error);
        return showAlert("Error fetching products", "error")
    }
}


// ============================================================
// LOAD PRODUCTS INTO TABLE
// ============================================================

async function loadProducts() {
  try {
    const productData = await getProducts();

    let totalProduct = document.querySelectorAll(".totalProduct");
    for (let i = 0; i < totalProduct.length; i++) {
      totalProduct[i].textContent = productData.result.length
    }

    const products = productData.result || [];
    const tbody = document.querySelector("#productBody");

    if (!tbody) return;

    if (products.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="5" class="cell-sub" style="text-align: center;">No products found</td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = products.map(product => {

      // First product image
      const image = product.images?.[0] || "";

      // Number of images
      const imageCount = product.images?.length || 0;

      // Short description
      const description = product.description
        ? product.description.length > 45
          ? product.description.substring(0, 45) + "…"
          : product.description
        : "No description";

      // Format price
      const price = Number(product.price || 0).toLocaleString("en-NG");

      return `
        <tr>
          <td>
            <div class="cell-main">
              ${
                image
                  ? `
                    <img
                      class="thumb"
                      src="${image}"
                      alt="${product.name || "Product"}"
                    >
                  `
                  : `
                    <div class="thumb txt">
                      PR
                    </div>
                  `
              }

              <div>
                <div class="cell-title">${product.name || "Unnamed Product"}</div>
                <div class="cell-sub">${description}</div>
              </div>
            </div>
          </td>

          <td class="amount">₦${price}</td>

          <td>
            <div class="cell-sub">${product.vendor_id || "—"}</div>
            <div class="cell-sub">@${product.vendor_id || "—"}</div>
          </td>

          <td class="cell-sub">
            ${
              imageCount > 0
                ? `
                  <button
                    type="button"
                    class="image-count-btn"
                    onclick='showProductImages(${JSON.stringify(product.images)})'
                  >
                    ${imageCount} image${imageCount !== 1 ? "s" : ""}
                  </button>
                `
                : "No images"
            }
          </td>

          <td>
            <div class="row-actions">
              <a class="icon-btn" href="#viewProduct" title="View" onclick="viewProduct('${product._id}')">👁</a>
              <button class="icon-btn" title="Edit" style='color: orange' onclick="editProduct('${product._id}')">✎</button>
              <button class="icon-btn red" title="Delete" style='color: red' onclick="deleteProduct('${product._id}')">🗑</button>
            </div>
          </td>
        </tr>
      `;

    }).join("");

  } catch (error) {
    console.error("Failed to load products:", error);
  }
}



setTimeout(() => {
    loadProducts()
}, 1500);