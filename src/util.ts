export const eventPosition = (e: Event & Partial<MouseEvent & TouchEvent>): [number, number] | undefined => {
  if (e.clientX || e.clientX === 0) return [e.clientX, e.clientY!];
  if (e.targetTouches?.[0]) return [e.targetTouches[0].clientX, e.targetTouches[0].clientY];
  return;
};

export function posDiff(a: [number, number], b: [number, number]): [number, number] {
  return [Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1])];
}
