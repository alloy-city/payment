class Item {
    _id: string;
    price: number;
    title: string;

    constructor(_id: string, price: number, title: string) {
        this._id = _id;
        this.price = price;
        this.title = title;
    }
}

export { Item }
