import { Item } from './item'
import { showCart } from './show-cart'
import { post, get } from './http'
import * as Evidence from './evidence'
import total from './total'
import clearItems from './clear-items'
import { unlockProductCards } from './unlockProductCards'
import installments from './installments'

interface Logger {
    log(s?: string): void
}

declare var Auth: any
declare var string: any
declare var notify: ((message: string, level: string, persistent: boolean) => void)
declare var paypal: any

let paypalEnvironment: string = 'production'
/// #if DEBUG
paypalEnvironment = 'sandbox'
/// #endif

class Cart implements Logger {
    items: [Item];

    constructor (){
        this.items = Auth.userData.shoppingCart
        if (this.items.length > 0) Evidence.notify(this.items.length)
    }

    log(){
        for (let item in this.items){
            console.log(this.items[item])
        }
    }

    add(productId: string, price: number, title: string){
        let body = {
            type: "sign",
            price: price,
            products: [productId]
        }

        post(body, "accept-terms", (res: any) => {
            /// #if DEBUG
            // console.log(res)
            /// #endif
            if (res == 304){
                $("#product-detail").modal('hide');
                notify(string.alerts.productAlreadyOnShoppingCart, "warning", false)
            } else {
                let item = new Item(productId, price, title)

                if (this.items == undefined) {
                    this.items = [item]
                } else {
                    this.items.push(item)
                }

                Evidence.notify(this.items.length)
                showCart(this.items)
            }
        })
    }

    removeItem(_id: string){
        post({product: _id}, "product", (res: number) => {
            if (res == 0){
                let index
                for (let i=0; i<this.items.length; i++){
                    if (this.items[i]._id == _id){
                        index = i
                        break
                    }
                }

                this.items.splice(index, 1)
                document.getElementById(_id).remove()
                document.getElementById("shopping-cart-total").innerText = total(this.items)
                document.getElementById("installment-plan").innerText = installments(this.items)
                if (this.items.length < 1) {
                    $("#payment-cart").modal('hide');
                    Evidence.remove();
                } else {
                    Evidence.notify(this.items.length);
                }
            }
        })
    }

    generatePayPalPayment(){
        // let cover = document.getElementById("paypal-button-cover")
        // cover.classList.remove("hidden")
        // setTimeout(() => { cover.remove() }, 2000)

        let total = 0
        for (let item of this.items) {
            total += item.price;
        }

        let body = {
            type: "payi",
            value: total,
            products: this.items
        }

        paypal.Button.render({

            env: paypalEnvironment,

            payment: function () {
                return new paypal.Promise(function (resolve: any, reject: any) {                 
                    post(body, "payment", (paymentId: string) => {
                        resolve(paymentId)
                    })
                });
            },

            onAuthorize: function (data: any) {
                // console.log(data)

                /*
                    data: {
                        intent: "sale"
                        orderID: "EC-82D4049367278843W"
                        payerID: "PTQGRKZ2XA8H2"
                        paymentID: "PAY-17G9286416917994ULL5MSVQ"
                        paymentToken: "EC-82D4049367278843W"
                        returnUrl: "https://pantoufle.online/?paymentId=PAY-17G9286416917994ULL5MSVQ&token=EC-82D4049367278843W&PayerID=PTQGRKZ2XA8H2"
                    }
                */

                post(data, "payment/execute", (res: any) => {
                    /// #if DEBUG
                    // console.log(res)
                    /// #endif

                    if (res.state == "approved"){
                        $("#payment-cart>div.modal-dialog>div.modal-content").html(`
                            <div class="modal-body">
                                <h3>${string.shoppingCart.success}</h3>
                                <p>${string.shoppingCart.paymentConcluded}</p>
                                <p>${string.shoppingCart.paymentID} <i>${data.paymentID}</i></p>
                            </div>
                            <div class="modal-footer">
                                <button type="button" class="btn btn-primary" data-dismiss="modal">Ok</button>
                            </div>`
                        );

                        Evidence.remove()
                        clearItems()
                        unlockProductCards(res.products)
                    } else {
                        $("#payment-cart").modal("hide");
                    }
                })
            },

            onCancel: function (data: any) {
                console.log('The payment was cancelled!')
                console.log(data)
            }
        }, '#paypal-button-container');
    }
}

let payment: { [s: string]: Item | Cart | ((items: [Item]) => void); } = {}
payment.cart = new Cart();
payment.showCart = showCart;

(<any>window).Payment = payment;
