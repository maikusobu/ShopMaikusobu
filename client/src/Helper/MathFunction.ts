export const MathFunction = (value: number, discount: number) => {
  return Math.floor((value - (value * discount) / 100) * 100) / 100;
};
