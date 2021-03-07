export default class Coordinates {
    x = null;
    y = null;

    constructor({x = 10, y = 10}) {
        this.x = Number(x);
        this.y = Number(y);
    }
}
