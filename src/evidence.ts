declare var htmlToElement: any;
declare var string: any;

let messageBox = document.getElementById("messages");

function buildMessage( n: number ){
    if (n == 1) {
        return `<p><span class="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span> ${string.shoppingCart.oneItemCall} <span class="text-info" role="button" onclick="Payment.showCart(Payment.cart.items)">${string.shoppingCart.shoppingCart}</span>.</p>`;
    } else if (n > 1) {
        return `<p><span class="glyphicon glyphicon-shopping-cart" aria-hidden="true"></span> ${string.shoppingCart.itemsCall[0]} ${n} ${string.shoppingCart.itemsCall[1]} <span class="text-info" role="button" onclick="Payment.showCart(Payment.cart.items)">${string.shoppingCart.shoppingCart}</span>.</p>`;
    }
}

function notify(n: number) {
    remove();
    let markup = `
        <div id="payment-notification" class="alert alert-info" role="alert">
            ${ buildMessage(n) }
        </div>`;

    messageBox.appendChild( htmlToElement(markup));
}

function remove() {
    let notification = document.getElementById("payment-notification");
    if (notification) notification.remove();
}

export { notify, remove }
