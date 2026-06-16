export const rating2goals = (rating) => {
  if (rating < 66) return 0;
  return Math.floor((rating - 66) / 6) + 1;
};
