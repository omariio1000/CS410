export function main1(
  input1: string,
  input2: string,
  output: HTMLElement,
) {
  console.log("input 1 is: " + input1);
  console.log("input 2 is: " + input2);

  output.innerText = input1 + ", " + input2;
}