import fs from 'fs'

class CartManager {
    constructor(cart){
        this.path = cart;
        this.productsCart=[];
    }

    async newCartEmpty(){

        await this.getCart()

        const newCart = {            
        };

        
        if (this.productsCart.length === 0){
            newCart.id=1;
        }else{
            let mayorProdId=1;
            this.productsCart.forEach(product=>{
                
                if (product.id>mayorProdId){
                    mayorProdId=product.id;
                }                        
            })
            newCart.id=mayorProdId+1;
        }
        newCart.products=[];

        this.productsCart.push(newCart)

        await fs.promises.writeFile(this.path,JSON.stringify(this.productsCart),'utf-8')
        console.log("Carrito agregado")
        return newCart

    }

    async getCart(limit){
        const prodCart = await fs.promises.readFile(this.path,'utf-8')
        const prodParse = await JSON.parse(prodCart);
        this.productsCart = prodParse;

        return limit === 0 ? prodParse : prodParse.slice(0,limit);
    }

    async getCartId(id){
        await this.getCart()

        const cartId = this.productsCart.find(cartId => cartId.id === id)
        if (cartId){
            return cartId
        }else {
            return ("Not Found");
         }        
    }

    async addProductCart(id,productId){

        const cartProduct = await this.getCartId(id);

        if (cartProduct){

            const prod = cartProduct.products

            const prodFilter = prod.filter(prod => prod.product === productId)

            // console.log('prodFilter',prodFilter)

            if (prodFilter.length>0){
                prod.forEach(cart =>{ 
                    if (cart.product === productId){
                        cart.quantity+=1;
                    }})
            } else {
                cartProduct.products.push({'product':productId, 'quantity':1})
            }
            
            await fs.promises.writeFile(this.path,JSON.stringify(this.productsCart),'utf-8')
        }
        
        return (cartProduct)
    }

}

export default CartManager;