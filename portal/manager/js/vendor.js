const API_URL = `${backendUrl}/manager/vendor`;

async function getVendors() {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'GET',
      credentials: "include",
      headers: { 'Content-Type': 'application/json' }
    })

    const data = await response.json()

    if (data.status === "error") {
        return showAlert(data.message, data.status)
    }

    // showAlert(data.message, data.status)
    return data
  } catch (error) {
    console.error("Error fetching vendors:", error);
    return showAlert("Error Fetching vendors data", "error")
  }
}

async function loadVendors() {
  try {
    const vendorData = await getVendors();
    let totalVendor = document.querySelectorAll(".totalVendor") 
    for (let i = 0; i < totalVendor.length; i++) {
      totalVendor[i].textContent = vendorData.result.length
    }
    const vendors = vendorData.result || [];

    // Select both tables
    const tbodies = document.querySelectorAll("#vendorTableBody, #vendorTableBody2");

    const rows = vendors.map(vendor => {
      const statusClass =
        vendor.status === "active" ? "green" : "red";

      const twoFactor =
        vendor.twofactorToken === "on" ? "🔒 on" : "off";

      return `
        <tr>
          <td>
            <div class="cell-main">
              <img class="thumb" src="${vendor.brand_image || ""}" alt="${vendor.brand_name || "Vendor"}">

              <div>
                <div class="cell-title">${vendor.brand_name || "Unknown Vendor"}</div>
                <div class="cell-sub">@${vendor.username || ""}</div>
              </div>
            </div>
          </td>

          <td>
            <div class="cell-sub"> ${vendor.brand_email || "—"}</div>
            <div class="cell-sub">${vendor.phone || "—"}</div>
          </td>

          <td>
            <span class="badge blue">${vendor.plan || "N/A"}</span>
          </td>

          <td><span class="badge ${statusClass}">${vendor.status || "unknown"}</span>
          </td>

          <td class="cell-sub">${twoFactor}</td>

          <td>
            <div class="row-actions">
              <a class="icon-btn" href="#viewVendor" title="View">👁</a>
              <button class="icon-btn" title="Edit">✎</button>

              <button class="icon-btn red" title="Delete">🗑</button>
            </div>
          </td>
        </tr>
      `;
    }).join("");

    // Put the same rows into both tables
    tbodies.forEach(tbody => {
      tbody.innerHTML = rows;
    });

  } catch (error) {
    console.error("Failed to load vendors:", error);
  }
}


setTimeout(() => {
    loadVendors()
}, 1500);


