let params = new URLSearchParams(window.location.search)
const paramsValue = params.get('id') || ""
const productId = params.get('pid') || ""

if (paramsValue === '' || !paramsValue) {
    document.getElementsByTagName("body")[0].style.display = "none"
    window.location.href = '404'
}
let productUrl = "https://linkohub.vercel.app/" //producturl same as frontend url
let backendUrl = "https://linko-mosc.onrender.com"
