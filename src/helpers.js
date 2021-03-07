export const getAbsoluteXY = element => {
    var viewportElement = document.documentElement;
    var box = element.getBoundingClientRect();
    var scrollLeft = viewportElement.scrollLeft;
    var scrollTop = viewportElement.scrollTop;
    return {
        x: box.left + scrollLeft,
        y: box.top + scrollTop
    };
};

export const snapToGrip = (val, gridSize) => {
    return gridSize * Math.round(val / gridSize);
};
