async function hash(str: string): Promise<number> {
  let sum = 0;
  const buffer = await crypto.subtle.digest("SHA-1", new TextEncoder().encode(str));
  for (const n of new Uint8Array(buffer)) {
    sum += n;
  }
  return sum;
}

async function hue(str: string): Promise<number> {
  const n = await hash(str);
  return n % 360;
}

function hslToHex(h: number, s: number, l: number): string {
  l /= 100;
  const a = (s * Math.min(l, 1 - l)) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, "0");
  };
  return `#${f(0)}${f(8)}${f(4)}`;
}

function getTriadColor(h: number): number {
  return (h + 120) % 360;
}

export async function generateGradient(username: string) {
  const h = await hue(username);
  const fromColor = hslToHex(h, 95, 50);
  const secondH = getTriadColor(h);
  const toColor = hslToHex(secondH, 95, 50);

  return {
    fromColor,
    toColor,
  };
}
