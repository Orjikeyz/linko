const getVendorData = async () => {
  profile_name = document.querySelector("#profile-name");
  profile_image = document.querySelector(".profile-image");
  profile_description = document.querySelector(".profile-description");
  profile_instagram = document.querySelector("#profile-instagram");
  profile_twitter = document.querySelector("#profile-twitter");
  profile_facebook = document.querySelector("#profile-facebook");
  profile_phone_number = document.querySelector("#profile-phone-number");

  try {
    const response = await fetch(`${backendUrl}/${paramsValue}`, {
      method: 'GET',
      // credentials: "include", // IMPORTANT for cookies
      headers: { 'Content-Type': 'application/json' }
    })

    if (!response.ok) {
      showAlert('No data available', "error")
    }

    const data = await response.json()
    if (data.status === 'error') {
      showAlert(`${data.message}`, `${data.status}`)
      if (data.message === "Vendor not found") {
        window.location.href = "./404.html"
      }
    }

    if (data.status === "success") {
      getProductsData() //Get vendor products

      profile_name.textContent = data.result.brand_name
      profile_image.src = data.result.brand_image
      profile_description.textContent = data.result.brand_description
      profile_instagram.href = data.result.instagram
      profile_facebook.href = data.result.facebook
      profile_twitter.href = data.result.x
      profile_phone_number.href = data.result.phone_number

      // heroImage.style.background = `linear-gradient(135deg, #000000 0%, #1a1a1ab5 100%), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLat8bZvhXD3ChSXyzGsFVh6qgplm1KhYPKA&s')`;
    }
  } catch (error) {
    showAlert("Server Error. Please try again later", "error")
    console.log(error)
  }
}

// Vendor Dashboard Product API Call
const getVendorDashboardData = async () => {
  try {
    const response = await fetch(`${backendUrl}/${paramsValue}`, {
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

      if (data.message === "Vendor not found") {
        localStorage.removeItem('vendorData');
        // window.location.href = "../404.html"
      }
      return
    }

    if (data.status === "success") {
      console.log(data.message)
      localStorage.setItem("vendorData", JSON.stringify(data.result))
    }
  } catch (error) {
    showAlert("Server Error. Please try again later", "error")
    console.log(error)
  }
}

// Update Vendor Store
const editVendorData = async () => {
  let storeData = JSON.parse(localStorage.getItem("vendorData"))
  let logoImage = document.getElementById("logoImage")
  let vendorName = document.getElementById("vendorName")
  let vendorDescription = document.getElementById("vendorDescription")
  let vendorEmail = document.getElementById("vendorEmail")
  let vendorPhone = document.getElementById("vendorPhone")
  let vendorInstagram = document.getElementById("vendorInstagram")
  let vendorFacebook = document.getElementById("vendorFacebook")
  let vendorX = document.getElementById("vendorX")
  let saveChanges = document.getElementById("saveChanges")

  logoImage.src = storeData.brand_image || ""
  vendorName.value = storeData.brand_name || ""
  vendorDescription.value = storeData.brand_description || ""
  vendorPhone.value = storeData.phone_number || ""
  vendorInstagram.value = storeData.instagram || ""
  vendorFacebook.value = storeData.facebook || ""
  vendorX.value = storeData.x || ""

  saveChanges.addEventListener("click", function () {
    saveChanges.textContent = "Updating..."
    saveChanges.disabled = true
    updateVendorData(vendorName.value, vendorDescription.value, vendorPhone.value, vendorInstagram.value, vendorFacebook.value, vendorX.value, saveChanges)
  })
}

const updateVendorData = async (vendorName, vendorDescription, vendorPhone, vendorInstagram, vendorFacebook, vendorX) => {
  const sanitizeInput = (input) => {
    return input.trim().replace(/[<>]/g, "") // basic XSS prevention
  }

  const validateURL = (url) => {
    const pattern = /^(https?:\/\/)?([\w\d-]+\.)+\w{2,}(\/.*)?$/i
    return pattern.test(url)
  }

  const validatePhone = (phone) => {
    const pattern = /^[0-9+\-\s()]{7,20}$/
    return pattern.test(phone)
  }

  // Sanitize inputs
  vendorName = sanitizeInput(vendorName)
  vendorDescription = sanitizeInput(vendorDescription)
  vendorPhone = sanitizeInput(vendorPhone)
  vendorInstagram = sanitizeInput(vendorInstagram)
  vendorFacebook = sanitizeInput(vendorFacebook)
  vendorX = sanitizeInput(vendorX)


  if (!vendorName) {
    return showAlert("Vendor brand Name cannot be empty", "error")
  }

  if (!vendorDescription) {
    return showAlert("Vendor brand description cannot be empty", "error")
  }

  if (!vendorPhone) {
    return showAlert("Vendor brand phone number cannot be empty", "error")
  }

  let dataForm = {
    vendorName: vendorName,
    vendorDescription: vendorDescription,
    vendorPhone: vendorPhone,
    vendorInstagram: vendorInstagram,
    vendorFacebook: vendorFacebook,
    vendorX: vendorX
  }


  try {
    const response = await fetch(`${backendUrl}/${paramsValue}`, {
      method: "PUT", // or PATCH
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      credentials: "include",
      body: JSON.stringify(dataForm)
    })

    const data = await response.json()

    if (data.status === "error") {
      showAlert(`${data.message}`, `${data.status}`)
      saveChanges.disabled = false
      saveChanges.textContent = "Save Changes"
      return
    }

    if (data.status === "success") {
      localStorage.setItem("vendorData", JSON.stringify(data.result))
      setTimeout(() => {
        saveChanges.textContent = "Saved"
        showAlert(`${data.message}`, `${data.status}`)
      }, 1500);
      setTimeout(() => {
        saveChanges.disabled = false
        saveChanges.textContent = "Save Changes"
      }, 3000);
    }

  } catch (error) {
    console.error(error)
    showAlert("Something went wrong", "error")
  }
}

/* =================  Vendor Brand logo Upload ================= */
let logoImage = document.getElementById('logoImage')
let logoImageText = document.getElementById('logoImageText')

document.getElementById("brandLogoImage").addEventListener("change", function (e) {
  logoImage.src = URL.createObjectURL(e.target.files[0])
  logoImageText.textContent = "Preview Brand Logo"
})

const uploadBrandLogo = async () => {
  let uploadBrandLogoBtn = document.getElementById("uploadBrandLogoBtn")
  uploadBrandLogoBtn.disabled = true

  /* ================= FORM DATA ================= */
  const productImagesInput = document.getElementById("brandLogoImage");
  const productImages = productImagesInput.files;
  let brandLogoUploadText = document.getElementById("brandLogoUploadText")
  brandLogoUploadText.textContent = "Uploading..."



  function loading() {
    setTimeout(() => {
      brandLogoUploadText.textContent = "Upload Logo"
      uploadBrandLogoBtn.disabled = false
    }, 1500);
  }


  if (productImages.length <= 0) {
    showAlert("Upload Brand logo", "error");
    loading()
    return;
  }

  if (productImages.length > 1) {
    showAlert("Only one image is allowed", "error");
    loading()
    return;
  }

  const formData = new FormData();
  for (let img of productImages) {
    formData.append("images[]", img);
  }

  /* ================= SEND TO External Storage ================= */

  try {
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
        showAlert("Image must be less than 2MB", "error")
        loading()
        return;
      }
    }

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

      sendToBackend(StorageData.urls, uploadBrandLogoBtn)

    } else {
      showAlert(StorageData.message || "Upload failed", "error");
      loading()
    }

  } catch (error) {
    console.error(error);
    showAlert("Server error occurred", "error");
    loading()
  }
}

// Send brand logo upload to backend 
async function sendToBackend(urls, uploadBrandLogoBtn) {
  let JSONFormData = {
    image: urls,
  }

  try {
    const response = await fetch(`${backendUrl}/${paramsValue}/logoUpload`, {
      method: "PUT",
      credentials: "include",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(JSONFormData),
    });

    const data = await response.json();
    if (data.status === "error") {
      showAlert(data.message, data.status)
      loading()
    }


    if (data.status === "success") {
      showAlert(data.message, data.status)
      brandLogoUploadText.textContent = "Uploaded"
      uploadBrandLogoBtn.disabled = false

      setTimeout(() => {
        brandLogoUploadText.textContent = "Upload Logo"
      }, 1500);

    }

  } catch (error) {
    showAlert(`Server Error`, "error")
    loading()
  }
}

editVendorData()