import { Item } from './item'
import total from './total'

declare var string: any
declare var numberToBRL: ((x: number) => string)

function showCart(items: [Item]){
    $("#product-detail").modal('hide');
    $("#payment-cart").remove();

    let modalContainer = document.createElement("div");

    let listOfItems = ``
    for (let item of items){
        listOfItems += `
            <tr id="${item._id}">
                <td class="text-right text-muted"><span class="glyphicon glyphicon-remove" aria-hidden="true" role="button" onclick="Payment.cart.removeItem('${item._id}')"></span></td>
                <td><span role="button" onclick="Student.Product.view('${item._id}')">${item.title}</span></td>
                <td>${numberToBRL(item.price)}</td>
            </tr>`
    }

    listOfItems += `
            <tr>
                <td></td>
                <td class="text-right"><b>${string.shoppingCart.total}</b></td>
                <td><h4 id="shopping-cart-total" style="margin: 0;font-weight: bold;">${total(items)}</h4></td>
            </tr>`

    let modal = `
        <div id="payment-cart" class="modal fade" tabindex="-1" role="dialog">
            <div class="modal-dialog" role="document">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                        <h4 class="modal-title"><span class="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span> ${string.shoppingCart.shoppingCart}</h4>
                    </div>
                    <div class="modal-body">
                        <div class="table-responsive">
                            <table class="table">
                                ${listOfItems}
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" onclick="Payment.cart.generatePayPalPayment()">${string.buttons.pay}</button>
                        <div id="paypal-button-cover" class="hidden"></div>
                        <div id="paypal-button-container"></div>
                    </div>
                    
                </div>
            </div>
        </div>`

    modalContainer.innerHTML = modal;
    
    document.body.insertBefore(modalContainer, document.getElementsByClassName("content")[0]);

    $("#payment-cart").modal("show");
}

export { showCart }