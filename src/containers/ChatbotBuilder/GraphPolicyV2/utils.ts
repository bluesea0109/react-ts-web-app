export const snapItemPosition = (x: number, y: number) => {
  let snappedX = Math.ceil((x + 1) / 10) * 10;
  let snappedY = Math.ceil((y + 1) / 10) * 10;

  if (snappedX < 10) {
    snappedX = 10;
  }
  if (snappedY < 10) {
    snappedY = 10;
  }

  return {
    x: snappedX,
    y: snappedY,
  };
};
