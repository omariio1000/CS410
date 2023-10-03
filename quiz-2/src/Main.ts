function foo(x: number, y: number): number {
  return baz(x + y);
}

function baz(x: number): number {
  return bar(x, -x);
}

function bar(i: number, a: number): number {
  for (let j = 0; j < Math.abs(i); j++)
    if (j % 4 == 0)
      a += foo(a, i);
  return a;
}

export function main1(output: HTMLElement) {
  output.innerText = foo(1, 9).toString();
}
