export interface ChartTheme {
  text: string;
  textMuted: string;
  border: string;
  primary: Record<number, string>; // 100.. 900
}

export const readChartTheme = (): ChartTheme => {
  const style = getComputedStyle(document.documentElement);

  const read = (name: string) => style.getPropertyValue(name).trim();

  const primary: Record<number, string> = {};

  for (let shade = 100; shade <= 900; shade += 100) {
    primary[shade] = read(`--p-primary-${shade}`);
  }

  return {
    text: read('--text-color'),
    textMuted: read('--text-color-secondary'),
    border: read('--surface-border'),
    primary,
  };
};

// Con 1-4 datasets arranca en 400; con 5-9 arranca en su cantidad; nunca baja de 100
export const shadeFor = (index: number, total: number): number => {
  const start = Math.min(Math.max(total, 4), 9);

  return Math.max(start - index, 1) * 100;
};
