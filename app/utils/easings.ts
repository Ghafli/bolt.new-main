// Easing functions

export const easeInOutQuad = (t: number): number => {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
};

export const easeOutQuad = (t: number): number => {
  return t * (2 - t);
};
