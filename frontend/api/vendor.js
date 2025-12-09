const getVendorData = async () => {
  const params = new URLSearchParams(window.location.search)
  const paramsValue = params.get('id')
  const heroImage = document.getElementById("heroImage")


  if (paramsValue === '' || !paramsValue) {
    window.location.href = '404.html'
  }

    profile_name = document.querySelector("#profile-name");
    profile_image = document.querySelector(".profile-image");
    profile_description = document.querySelector(".profile-description");
    profile_instagram = document.querySelector("#profile-instagram");
    profile_twitter = document.querySelector("#profile-twitter");
    profile_facebook = document.querySelector("#profile-facebook");
    profile_phone_number = document.querySelector("#profile-phone-number");

  try {
    const response = await fetch(`http://localhost:3000/${paramsValue}`, {
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

    if (data.status === "success") {
      getProductsData() //Get vendor products

      profile_name.textContent = data.result.brand_name
      profile_image.src = data.result.brand_image
      profile_description.textContent = data.result.brand_description
      profile_instagram.href = data.result.instagram
      profile_facebook.href = data.result.facebook
      profile_twitter.href = data.result.x
      profile_phone_number.href = data.result.profile_phone_number

      // heroImage.style.background = `linear-gradient(135deg, #000000 0%, #1a1a1ab5 100%), url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRLat8bZvhXD3ChSXyzGsFVh6qgplm1KhYPKA&s')`;
    }
  } catch (error) {
    showAlert("Server Error. Please try again later", "error")
    console.log(error)
  }
}

getVendorData()
