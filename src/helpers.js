export const getAbsoluteXY = element => {
  const viewportElement = document.documentElement;
  const box = element.getBoundingClientRect();
  const scrollLeft = viewportElement.scrollLeft;
  const scrollTop = viewportElement.scrollTop;
  return {
    x: box.left + scrollLeft,
    y: box.top + scrollTop
  };
};

export const snapToGrip = (val, gridSize) => {
  return gridSize * Math.round(val / gridSize);
};
