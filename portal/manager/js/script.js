function showProductImages(images) {
    const modal = document.querySelector("#productImageModal");
    const gallery = document.querySelector("#productImageGallery");

    if (!modal || !gallery) return;
    gallery.innerHTML = images.map(image => `<img src="${image}" alt="Product image" class="product-gallery-image">`).join("");
    modal.classList.add("show");
}


function closeProductImages() {
    const modal = document.querySelector("#productImageModal");

    if (modal) {
        modal.classList.remove("show");
    }
}


// Close when clicking outside the modal content
document.addEventListener("click", function (event) {
    const modal = document.querySelector("#productImageModal");

    if ( modal && event.target === modal) {
        closeProductImages();
    }
});


// Close with Escape key
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
        closeProductImages();
    }
});
