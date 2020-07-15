const cartBtn = document.querySelector(".cart-btn")
const closeCartBtn = document.querySelector(".close-cart")
const clearCartBtn = document.querySelector(".clear-cart")
const cartDOM = document.querySelector(".cart")
const cartOverlay = document.querySelector(".close-overlay")
const cartItems = document.querySelector(".cart-items")
const cartTotal = document.querySelector(".cart-total")
const cartContent = document.querySelector(".cart-content")
const productsDOM = document.querySelector(".products-center")

// cart starts as empty array
let cart = []

// create methods...

// get products
class Products {
    // only get when the promise is returned
    async getProducts() {
        try {
            let result = await fetch('./ListJSONTest.json')
            return result
        } catch(err) {
            console.log(err)
        }
    }
}

// display products
class UI {

}

// save it locally
class Storage {
     
}

// update cart
document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI()
    const products = new Products()

    // get all the products
    products.getProducts().then(data => console.log(data))
})