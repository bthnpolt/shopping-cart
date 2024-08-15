//! Variables
const cartBtn =  document.querySelector(".cart-btn");
const cartClear = document.querySelector(".btn-clear");
const cartContent =  document.querySelector(".cart-list");
const totalValue = document.querySelector(".total-value");
const cartItems = document.querySelector(".cart-items");
const productDOM =  document.getElementById("products-dom");

//! classes
let buttonsDom = [];
let cart = [];


class Products{
    static async getProduct(){
        try{
            let res =  await fetch("https://66b794897f7b1c6d8f1c41f9.mockapi.io/products");
            let data =  await res.json();
            let products =  data;
            return products;
        }catch(error){
        
            console.log(error);
        };
    };
};

class UI{
    static displayProducts(products){
        let result = "";
        products.forEach(element => {
          result+=  `<div class="col-lg-4 col-md-6">
                    <div class="product">
                        <div class="product-image">
                            <img src="${element.image}" alt="product">
                        </div>
                        <div class="product-hover">
                            <span class="product-title">${element.title}</span>
                            <span class="product-price">${element.price}₺</span>
                            <button class="btn-add-to-cart" data-id="${element.id}">
                                <i class="fas fa-cart-shopping"></i>
                            </button>
                        </div> 
                    </div>
                </div>`
        });
        productDOM.innerHTML =  result;
    };
    static getAllButtons(){
        const buttons =  [...document.querySelectorAll(".btn-add-to-cart")];
        buttonsDom =  buttons;
        buttons.forEach(button=>{
            let id = button.dataset.id;
            let inCart =  cart.find(item => item.id === id);
            if(inCart){
                button.setAttribute("disabled","disabled");
                button.style.opacity = ".3";
            }else{
                button.addEventListener("click",(event)=>{
                    event.target.disabled = true;
                    event.target.style.opacity = ".3";
                    //! get product from products
                    let cartItem =  {...Storoge.getProduct(id), amount:1};
                    //! add product to the cart
                    cart = [...cart,cartItem];
                    //! save cart in local stroge
                    Storoge.saveCart(cart);
                    //! save cart values
                    this.setCartValues(cart);
                    //! display cart list
                    this.addCartItem(cartItem);
                    //! show the cart
                    this.showCart();
                    
                });
            }
        });
       
    };
    static setCartValues (cart){
        if(cart.lenght!==0){
            let tempTotal = 0;
            let itemsTotal = 0;
        cart.map(item => {
            tempTotal += item.price * item.amount;
            itemsTotal += item.amount;
        });
        cartItems.innerText =  itemsTotal;
        totalValue.innerText =  parseFloat(tempTotal.toFixed(2));
        }else{
            cartItems.innerText = 0;
        }
        
    };
    static addCartItem(item){
        const li = document.createElement("li");
        li.classList.add("cart-list-item");
        li.innerHTML = `<div class="cart-left">
                                <div class="cart-left-image">
                                    <img class="img-fluid" src="${item.image}" alt="product">
                                </div>
                                <div class="cart-left-info">
                                    <a class="cart-left-info-title" href="#">${item.title}</a>
                                    <span class="cart-left-info-price">${item.price}</span>
                                </div>
                            </div>
                            <div class="cart-right">
                                <div class="cart-right-quantity">
                                    <button class="quantity-minus" data-id='${item.id}'>
                                        <i class="fas fa-minus"></i>
                                    </button>
                                    <span class="quantity">${item.amount}</span>
                                    <button class="quantity-plus" data-id='${item.id}'>
                                        <i class="fas fa-plus"></i>
                                    </button>
                                </div>
                                <div class="cart-right-remove">
                                    <button class="cart-remove-btn" data-id='${item.id}'>
                                        <i class="fas fa-trash"></i>
                                    </button>
                                </div>
                            </div>`
                        cartContent.appendChild(li);
    };
    static showCart(){
        cartBtn.click();
    }
    static setupApp(){
       cart =  Storoge.getCart(); 
       this.setCartValues(cart);
       this.populateCart(cart);
    }
    static populateCart(cart){
        cart.forEach(item => this.addCartItem(item));
    }
    static cartLogic(){
        cartClear.addEventListener("click", ()=>{
            this.clearCart();
        });
        cartContent.addEventListener("click", (event)=>{
            if(event.target.classList.contains("cart-remove-btn")){
                let removeItem =  event.target;
                let id = removeItem.dataset.id;
                removeItem.parentElement.parentElement.parentElement.remove();
                this.removeItem(id);
            }else if(event.target.classList.contains("quantity-minus")){
                let lowerAmount = event.target;
                let id = lowerAmount.dataset.id;
                let tempItem =  cart.find(item => item.id === id);
                tempItem.amount -= 1;
                if(tempItem.amount != 0){
                    Storoge.saveCart(cart);
                    this.setCartValues(cart);
                    lowerAmount.nextElementSibling.innerText =  tempItem.amount
                }else{
                    lowerAmount.parentElement.parentElement.parentElement.remove();
                    this.removeItem(id);
                }
            }else if(event.target.classList.contains("quantity-plus")){
                let plusItem =  event.target;
                let id = plusItem.dataset.id;
                let tempItem =  cart.find(item => item.id === id);
                tempItem.amount +=1;
                plusItem.previousElementSibling.innerText = tempItem.amount
                Storoge.saveCart(cart);
                this.setCartValues(cart);
            }
        });
    }
    static clearCart (){
        let cartItems  = cart.map(item => item.id);
        cartItems.forEach(id => this.removeItem(id));
        while(cartContent.children.length>0){
            cartContent.removeChild(cartContent.children[0]);
        }
    }
    static removeItem(id){
        cart =  cart.filter(item => item.id !== id);
        this.setCartValues(cart);
        Storoge.saveCart(cart);
        let button = this.getSingleButton(id);
        button.disabled = false;
        button.style.opacity = "1";
    };
    static getSingleButton(id){
        return buttonsDom.find(button=>button.dataset.id === id);
    }

};

class Storoge{
    static saveProduct(products){
        localStorage.setItem("products",JSON.stringify(products));
    };
    static getProduct(id){
      let products = JSON.parse(localStorage.getItem("products"));
      return products.find(product => product.id === id);
    }
    static saveCart(cart){
        localStorage.setItem("cart",JSON.stringify(cart));
    }
    static getCart(){
        return localStorage.getItem("cart") ? JSON.parse(localStorage.getItem("cart")) : [];
    }
};

document.addEventListener("DOMContentLoaded",()=>{
    UI.setupApp();
    Products.getProduct().then(products=>{
        UI.displayProducts(products);
        Storoge.saveProduct(products);
    }).then(()=>{
        UI.getAllButtons();
        UI.cartLogic();
    });
});

