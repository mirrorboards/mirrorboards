export const toPascalCase = (s: string) => {
  return s
    .split('_')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');
};
