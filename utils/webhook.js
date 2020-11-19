const request = require('request');

module.exports = {
    sendWebhook: async (webhookURL, color, title, productDetails) => {
        try {            
            const embed = {
                embeds: [{
                    author: {
                        name: `${title} @ ${productDetails.site}`,
                        url: productDetails.site
                    },
                    color: color,
                    title: productDetails.product.title,
                    url: `${productDetails.site}/products/${productDetails.product.handle}`,
                    thumbnail: {
                        "url": productDetails.product.images[0].src
                    },
                    footer: {
                        icon_url: "https://cdn.iconscout.com/icon/free/png-256/shopify-226579.png",
                        text: "Shopify Monitor by Rock @ StormeIO"
                    },
                    type: 'rich',
                    fields: productDetails.restockedVariants.map((variant) => {
                        return {
                            name: `${variant.title}: ${(variant.inventory_quantity) ? variant.inventory_quantity : '1+'} Stock`,
                            value: `[ATC](${productDetails.site}/cart/${variant.id}:1)`,
                            inline: true
                        }
                    }),
                    timestamp: new Date().toISOString()
                }]
            }
            console.log(embed);
            
            let response = await request.post({
                url: webhookURL,
                followAllRedirects: true,
                simple: false,
                resolveWithFullResponse: true,
                headers: {
                    'content-type': 'application/json',
                },
                body: JSON.stringify(embed)
            })
        } catch (webhookError) {
            console.error('WEBHOOK: ' + webhookError.message);
            await new Promise((resolve) => setTimeout(() => resolve(), 5000));
            return module.exports.sendWebhook(webhookURL, color, title, productDetails);
        }
    }
}