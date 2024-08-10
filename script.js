//! Variables
const cartBtn =  document.querySelector(".cart-btn");
const cartClear = document.querySelector(".btn-clear");
const cartContent =  document.querySelector(".cart-list");
const totalValue = document.querySelector(".total-value");
const cartItems = document.querySelector(".cart-list-item");
const productDOM =  document.getElementById("products-dom");

//! classes

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
                            <span class="product-price">${element.price}</span>
                            <button class="btn-add-to-cart" data-id="${element.id}">
                                <i class="fas fa-cart-shopping"></i>
                            </button>
                        </div> 
                    </div>
                </div>`
        });
        productDOM.innerHTML =  result;
    };
};

class Storoge{

};

document.addEventListener("DOMContentLoaded",()=>{
    Products.getProduct().then(products=>{
        UI.displayProducts(products);
    });
});

