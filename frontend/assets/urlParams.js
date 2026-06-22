let params = new URLSearchParams(window.location.search)
const paramsValue = params.get('id') || ""
const pid = params.get('pid') || "" // product Id

if (paramsValue === '' || !paramsValue) {
    document.getElementsByTagName("body")[0].style.display = "none"
    // window.location.href = '404'
}
