function generateWhatsAppMessage(name, description, price, productUrl, vendorNumber) {
    const message = 
`🛍 *Product Inquiry*

*Product:* ${name}
*Description:* ${description}
*Price:* $${price}
*Product Link:* ${productUrl}

I would like to know more about this product.`;

    const encoded = encodeURIComponent(message);

    window.location.href = `https://wa.me/${vendorNumber}?text=${encoded}`
}

