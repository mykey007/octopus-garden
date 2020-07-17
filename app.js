const cartBtn = document.querySelector(".cart-btn")
const closeCartBtn = document.querySelector(".close-cart")
const clearCartBtn = document.querySelector(".clear-cart")
const cartDOM = document.querySelector(".cart")
const cartOverlay = document.querySelector(".cart-overlay")
const cartItems = document.querySelector(".cart-items")
const cartTotal = document.querySelector(".cart-total")
const cartContent = document.querySelector(".cart-content")
const productsDOM = document.querySelector(".products-center")

// cart starts as empty array
let cart = []

// buttons populated in buyNow() 
let buttonsDOM = []

// create methods...

// get products
class Products {
    // only get when the promise is returned
    async getProducts() {
        try {
            let result = await fetch('./ListJSONTest.json')
            let data = await result.json()
            let products = data.List

            products = products.map(listItem => {
                const title = listItem.productLink.rel
                const price = listItem.price
                const prodUrl = listItem.productUrl
                const image = listItem.mediumImageURL
                const prodId = listItem.prodId
                const isAvailable = listItem.isAvailable
                const brand = listItem.brand

                return {title, price, prodUrl, image, prodId, isAvailable, brand}
            })
            return products
        } catch(err) {
            console.log(err)
        }
    }
}

// display products
class UI {
    displayProducts(products) {
        // console.log(products)
        let result = ''

        products.forEach(product => {
            result += `
                <article class="flex-col article-border">
                    <div class="img-container">
                        <a href="${product.prodUrl}">
                            <img src="${product.image}" alt="${product.title}" class="product-img">
                        </a>
                        
                    </div>
                    <h3>${product.title}</h3>
                    <h4 class="price-color">$${product.price}</h4>
                    <button class="bag-btn" data-id="${product.prodId}">
                        <i class="las la-shopping-bag"></i>
                        add to cart
                    </button>
                </article>
            `
        })
        productsDOM.innerHTML = result
    }

    buyNow() {
        //spread operator to better traverse the nodelist
        const buttons = [...document.querySelectorAll(".bag-btn")]
        buttonsDOM = buttons

        buttons.forEach(button => {
            let id = button.dataset.id 

            //show values
            // console.log(id)
            let inCart = cart.find(item => item.id === id)
            if(inCart) {
                button.innerText = 'In Cart'
                button.disabled = true
            }
            // } else {
                button.addEventListener('click', (event)=> {
                    event.target.innerText = 'In Cart'
                    event.target.disabled = true
                    // console.log(event)

                    // get product from products
                    let cartItem = {...Storage.getProduct(id)}

                    // add to empty cart array
                    cart = [...cart, cartItem]
                    // console.log(cart)

                    // save cart in local storage too
                    Storage.saveCart(cart)

                    // set cart values
                    this.setCartValues(cart)

                    // add cart item
                    this.addCartItem(cartItem)

                    // show cart
                    this.showCart()
                })
            // } end else
            // console.log(id)
        })
    }

    setCartValues(cart) {
        let tempTotal = 0

        cart.map(item => {
            tempTotal += item.price * item.amount
        })
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2))
        // console.log(cartTotal)
    }

    addCartItem(item) {
        const div = document.createElement('div')
        div.classList.add('cart-item')
        div.innerHTML = `
            <img src='${item.image}' alt="">
            <div>
                <h3>${item.title}</h3>
                <h4>$${item.price}</h4>
                <span class="remove-item" data-id=${item.id}>remove</span>
            </div>
        `
        cartContent.appendChild(div)
        // console.log(cartContent)

    }

    showCart() {
        cartOverlay.classList.add('transparentBcg')
        cartDOM.classList.add('showCart')
    }
}

// save it locally
class Storage {
     static saveProducts(products) {
         localStorage.setItem('products', JSON.stringify(products))
     }

     static getProduct(id) {
         let products = JSON.parse(localStorage.getItem('products'))
         return products.find(product => product.id === id)
     }

     static saveCart(cart) {
         localStorage.setItem('cart', JSON.stringify(cart))
     }
}


// var items = [{id:2, title:"...", pId:62},
//              {id:1, title:"...", pId:43},
//              {id:4, title:"...", pId:74},
//              {id:9, title:"...", pId:35},
//              {id:5, title:"...", pId:81}];


// class Sort {
//     static sortByProperty(property) {  
//         return function(a,b) {  
//            if(a[property] > b[property])  
//               return 1
//            else if(a[property] < b[property])  
//               return -1  
       
//            return 0;  
//         }  
//      }
// }

// update cart
document.addEventListener("DOMContentLoaded", () => {
    const ui = new UI()
    const products = new Products()
    // const sort = new Sort()

    // get all the products
    products.getProducts().then(products => {
        ui.displayProducts(products)
        Storage.saveProducts(products)
    }).then(() => {
        ui.buyNow()
    })
})