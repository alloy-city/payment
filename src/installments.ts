import { Item } from './item'

declare var numberToBRL: ((x: number) => string);
declare var Auth: any;
declare var string: any

export default (items: [Item]): string => {
    let total = 0;
    let installments = ``;
    for (let item of items) {
        total += item.price;
    }

    if (total < Auth.minimumInstalmentPrice) {
        installments = "";
    } else {

        installments = `<div style="margin-left: 15%;"><h3>${string.shoppingCart.installmentsPlan}</h3><ul>`

        installments += `<li>1x ${numberToBRL(total*Auth.fullPaymentFraction)} (-${Math.floor((1-Auth.fullPaymentFraction)*100)}%)</li>`;

        for (let i=2; i<=Auth.maxInstalments; i++) {
            installments += `<li>${i}x ${numberToBRL(total/i)}</li>`;
        }

        installments += "</ul></div>";
    }

    return installments;
}
