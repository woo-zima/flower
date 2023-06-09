export const groupArray = array => {
  // if(array)
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (array[i].furl.includes(';')) {
      array[i].furl = array[i].furl.split(';')[0];
    }
  }

  if (array.length <= 3) {
    for (let i = 0; i < array.length; i += 3) {
      result.push(array.slice(i, array.length));
    }
  } else {
    for (let i = 0; i < array.length; i += 3) {
      result.push(array.slice(i, i + 3));
    }
  }
  return result;
};

export const fliterArray = array => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].furl.includes(';')) {
      array[i].furl = array[i].furl.split(';')[0];
    }
  }
  return array;
};

export const fliterFlowerArray = array => {
  for (let i = 0; i < array.length; i++) {
    if (array[i].flower.furl.includes(';')) {
      array[i].flower.furl = array[i].flower.furl.split(';')[0];
    }
  }
  return array;
};
