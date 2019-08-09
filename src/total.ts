import { Item } from './item'

declare var numberToBRL: ((x: number) => string)

export default (items: [Item]): string => {
    let total = 0
    for (let item of items) {
        total += item.price
    }
    return numberToBRL(total)
}
