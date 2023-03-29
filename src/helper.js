const colors = [
  { depth: 2, bgColor: 'rgb(255, 121, 7)', textColor: 'rgb(255, 231, 211)' },
  { depth: 3, bgColor: 'rgb(255, 130, 11)', textColor: 'rgb(255, 234, 215)' },
  { depth: 7, bgColor: 'rgb(255, 155, 22)', textColor: 'rgb(255, 243, 226)' },
  { depth: 10, bgColor: 'rgb(254, 179, 33)', textColor: 'rgb(255, 249, 236)' },
  { depth: 13, bgColor: 'rgb(254, 204, 44)', textColor: 'rgb(255, 253, 247)' },
  { depth: 16, bgColor: 'rgb(254, 228, 55)', textColor: 'rgb(255, 255, 255)' },
  { depth: 20, bgColor: 'rgb(253, 251, 65)', textColor: 'rgb(255, 255, 255)' },
  { depth: 26, bgColor: 'rgb(217, 237, 76)', textColor: 'rgb(255, 255, 255)' },
  { depth: 33, bgColor: 'rgb(180, 223, 86)', textColor: 'rgb(255, 255, 255)' },
  { depth: 39, bgColor: 'rgb(144, 211, 102)', textColor: 'rgb(255, 255, 255)' },
  { depth: 52, bgColor: 'rgb(69, 204, 181)', textColor: 'rgb(229, 248, 245)' },
  { depth: 66, bgColor: 'rgb(1, 197, 252)', textColor: 'rgb(202, 243, 255)' },
  { depth: 82, bgColor: 'rgb(1, 170, 252)', textColor: 'rgb(202, 238, 255)' },
  { depth: 98, bgColor: 'rgb(0, 143, 253)', textColor: 'rgb(202, 232, 255)' },
  { depth: 115, bgColor: 'rgb(0, 117, 253)', textColor: 'rgb(202, 226, 255)' },
  { depth: 131, bgColor: 'rgb(4, 94, 249)', textColor: 'rgb(203, 222, 254)' },
  { depth: 164, bgColor: 'rgb(31, 71, 222)', textColor: 'rgb(208, 217, 248)' },
  { depth: 197, bgColor: 'rgb(59, 49, 195)', textColor: 'rgb(208, 205, 243)' },
  { depth: 230, bgColor: 'rgb(69, 30, 159)', textColor: 'rgb(181, 157, 236)' },
  { depth: 262, bgColor: 'rgb(46, 20, 106)', textColor: 'rgb(141, 104, 226)' },
];

export const getBGColor = (depth) => {
  const color = colors.find(c => depth <= c.depth);
  const { bgColor } = color;

  return bgColor;
};

export const getTextColor = (depth) => {
  const color = colors.find(c => depth <= c.depth);
  const { textColor } = color;

  return textColor;
};
