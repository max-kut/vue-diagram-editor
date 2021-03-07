export default class Size {
    width = null;
    height = null;

    /**
     * @param {Number} width
     * @param {Number} height
     */
    constructor({width = 150, height = 150}) {
        this.width = Number(width);
        this.height = Number(height);
    }
}
