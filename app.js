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
    // only get when the promise is returned and use .then
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
                <article class="flex-col article-border" data-brand="${product.brand}" data-available="${product.isAvailable}">
                    <div class="img-container">
                        <a href="${product.prodUrl}">
                            <img src="${product.image}" alt="${product.title}" class="product-img">
                        </a>
                        
                    </div>
                    <h3>${product.title}</h3>
                    <p class="seller">From: ${product.brand}</p>
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
        let buttons = [...document.querySelectorAll(".bag-btn")]
        buttonsDOM = buttons

        buttons.forEach(button => {
            let id = button.dataset.prodId 
            //show values
            // console.log(id)
            let inCart = cart.find(item => item.id === id)

            if(inCart) {
                button.innerText = 'In Cart'
                button.disabled = true
            }
            // } else {
                button.addEventListener('click', (event)=> {
                    //disable button
                    event.target.innerText = 'In Cart'
                    event.target.disabled = true
                    // console.log(event)

                    // get product from products
                    let cartItem = {...Storage.getProduct(id), amount: 1}
                    // console.log(cartItem)
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
        let itemsTotal = 0

        cart.map(item => {
            tempTotal += item.price * item.amount
            itemsTotal += item.amount
        })
        // fix amount returned and return a number, not string
        cartTotal.innerText = parseFloat(tempTotal.toFixed(2))
        // console.log(cartTotal)
        cartItems.innerText = itemsTotal
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

    setupAPP() {
        cart = Storage.getCart();
        this.setCartValues(cart);
        this.populateCart(cart);
        cartBtn.addEventListener("click", this.showCart);
        closeCartBtn.addEventListener("click", this.hideCart);
      }
      populateCart(cart) {
        cart.forEach(item => this.addCartItem(item));
      }
      hideCart() {
        cartOverlay.classList.remove("transparentBcg");
        cartDOM.classList.remove("showCart");
      }

      cartLogic() {
        clearCartBtn.addEventListener("click", () => {
          this.clearCart();
        });
        cartContent.addEventListener("click", event => {
          if (event.target.classList.contains("remove-item")) {
            let removeItem = event.target;
            let id = removeItem.dataset.prodId;
            cartContent.removeChild(removeItem.parentElement.parentElement);
            // remove item
            this.removeItem(id);
          }
        });
      }
      clearCart() {
        // console.log(this);
        let cartItems = cart.map(item => item.prodId);
        cartItems.forEach(prodId => this.removeItem(prodId));
        while (cartContent.children.length > 0) {
          cartContent.removeChild(cartContent.children[0]);
        }
        this.hideCart();
      }
      removeItem(id) {
        cart = cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storage.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.innerHTML = `<i class="fas fa-shopping-cart"></i>add to bag`;
      }
      getSingleButton(id) {
        return buttonsDOM.find(button => button.dataset.id === id);
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
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    static getCart() {
        // either exists or doesn't exist
        return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
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
    ui.setupAPP()
    // get all the products
    products.getProducts().then(products => {
        ui.displayProducts(products)
        Storage.saveProducts(products)
    }).then(() => {
        ui.buyNow()
        ui.cartLogic()
    })
})



// Main Search 

// get input element
let filterInput = document.getElementById('filterInput')
let availableInput = document.getElementById('available')
// add event listener 
filterInput.addEventListener('keyup', filterNames)
availableInput.addEventListener('change', isAvailable)

function filterNames() {
    let filterValue = document.getElementById('filterInput').value.toUpperCase()
    console.log(filterValue)
    // get product names
    let names = document.getElementById('product-names')
    // get product name
    let product = names.querySelectorAll('article.article-border')
    // loop through all products
    for(let i = 0; i < product.length; i++) {
        let title = product[i].getElementsByTagName('h3')[0]
        let brand = product[i].getElementsByClassName('seller')[0]
        // let available = product[i].dataset.available === 'true'

        // if matched
        if(title.innerHTML.toUpperCase().indexOf(filterValue) > -1 
            || brand.innerHTML.toUpperCase().indexOf(filterValue) > -1) {
            product[i].style.display= ''
        } else {
            product[i].style.display= 'none'
        }
    }
}


function isAvailable() {
    // Get the output 
    let product = document.querySelectorAll('article.article-border')

    // is it available?
    if (availableInput.checked) {
        console.log(1)
        product.forEach(e => {
            if (e.dataset.available === 'false') {
                e.style.display = "none"
            }
        })
    } else {
        product.forEach(e => {
            console.log(2)
            if (e.dataset.available === 'true') {
                e.style.display = "flex"
            }
        })
    }
}