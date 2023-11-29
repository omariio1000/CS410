/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-implied-eval */
/* eslint-disable @typescript-eslint/no-non-null-assertion */

let timeoutId: number | null = null;
/**
 * Schedules the next update
 * @param milliseconds 
 * @param update 
 */
export function scheduleNextUpdate(milliseconds: number, update: () => any): void {
  if (timeoutId) clearTimeout(timeoutId);
  timeoutId = setTimeout(<TimerHandler> update, milliseconds);
}

/**
 * Get HTML gamescreen element
 */
export const canvas: CanvasRenderingContext2D =
  (<HTMLCanvasElement> document.getElementById("gameScreen")).getContext("2d")!;

  /**
   * reset the canvas 
   */
export function resetCanvas(): void {
  if (timeoutId) clearTimeout(timeoutId);
  canvas.scale(1, 1);
  canvas.fillStyle = "white";
  canvas.fillRect(0, 0, 500, 500);
}

const CELL_SIZE = 10;

/**
 * Fill cell with color
 * @param color Color to set cell
 * @param left Coordinate from left
 * @param top Coordinate from top
 */
export function fillCell(
  color: string,
  left: number,
  top: number
): void {
  canvas.fillStyle = color;
  canvas.fillRect(left*CELL_SIZE, top*CELL_SIZE, CELL_SIZE, CELL_SIZE);
}

/**
 * Update HTML if player has lost
 * @param player Player to update
 * @param lost Status (False = Lost)
 */
export function updateLost(
  player: "A" | "B" | "C" | "D",
  lost: boolean
): void {
  document.getElementById("lost" + player)!.innerText = lost.toString();
}

/**
 * Update player apple count
 * @param player Player to update
 * @param apples number of apples
 */
export function updateApples(
  player: "A" | "B" | "C" | "D",
  apples: number
): void {
  document.getElementById("apples" + player)!.innerText = apples.toString();
}
