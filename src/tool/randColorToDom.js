export const randomColorToDom = dom => {
  const ASH = '#c0bab2';
  const ORANGE = '#FAEBD7';
  const GREE = '#86a88f';
  const A = '#4c9186';
  let El = document.querySelector(dom);
  const ColorArr = ['#c0bab2', '#FAEBD7', '#86a88f', '#4c9186', '#fff'];
  let rS = ColorArr[Math.floor(Math.random() * ColorArr.length)];
  El.style.backgroundColor = rS;
};
