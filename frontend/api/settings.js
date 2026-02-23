const getSettingsData = async () => {
    let storeData = JSON.parse(localStorage.getItem("vendorData"))
    let logoImage = document.getElementById("logoImage")
    let vendorName = document.getElementById("vendorName")
    let vendorDescription = document.getElementById("vendorDescription")
    let vendorEmail = document.getElementById("vendorEmail")
    let vendorPhone = document.getElementById("vendorPhone")
    
    logoImage.src = storeData.brand_image
    vendorName.value = storeData.brand_name 
    vendorDescription.value = storeData.brand_description 
    vendorPhone.value = storeData.phone_number 
    vendorEmail.value = storeData.brand_email || ""
}

getSettingsData()