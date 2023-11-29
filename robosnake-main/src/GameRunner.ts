import { initializeAgent, Motion, agentMove } from "./Agent";
import { scheduleNextUpdate, updateApples, updateLost } from "./DrawingLibrary";
import { Cell, draw, GameScreen } from "./GameScreen";
import { Player } from "./Agent"; 
// a MaybeCell is either a Cell or the string "outside"
export type MaybeCell = Cell | "outside";

// a ScreenPart is a 5x5 array of MaybeCell arrays
export type ScreenPart = MaybeCell[][];

/**
 * Class that stores a coordinate
 */
export class Point {
  public x: number;
  public y: number;

  /**
   * Takes in x and y coordinate
   * @param x x coordinate
   * @param y y coordinate
   */
  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

/**
 * Stores snake coordinates, apple count, and whether they have won or lost
 */
export class SnakeState extends Point {
  public apples: number;
  public lost: boolean;

  /**
   * Takes in x and y coordinates, sets apples to zero and lost to false by default
   * @param x x coordinate
   * @param y y coordinate
   */
  constructor(x: number, y: number) {
    super(x, y); // call Point constructor to set x and y
    this.apples = 0;
    this.lost = false;
  }

  /**
   * Takes in coordinates to update snake position
   * @param p Coordinates to set to
   */
  public setPoint(p: Point): void {
    this.x = p.x;
    this.y = p.y;
  }
}

/**
 * Get the 5x5 area around the snake
 * @param screen The entire screen
 * @param s The snake we are finding a the area for
 * @returns 5x5 area around the snake, type ScreenPart
 */
export function getScreenPart(screen: GameScreen, s: SnakeState): ScreenPart {
  const part: ScreenPart = new Array<MaybeCell[]>(5);
  for (let j = 0; j < 5; j++) {
    part[j] = new Array<MaybeCell>(5);
    for (let i = 0; i < 5; i++) {
      if (s.x+i-2 >= 0 && s.y-2 + j >= 0 && s.x-2 + i < screen.length && s.y-2 + j < screen.length)
        part[j][i] = screen[s.y+j-2][s.x+i-2];
      else
        part[j][i] = "outside";
    }
  }
  return part;
}

/**
 * The main run function that runs each player and updates their status
 * @param stepTime Milliseconds to wait for each update
 * @param newApplesEachStep How many apples to add to screen every step
 * @param screen Entire screen with all players and apples
 */
export function run(stepTime: number, newApplesEachStep: number, screen: GameScreen): void {
  initializeAgent("A");
  initializeAgent("B");
  initializeAgent("C");
  initializeAgent("D");

  // player initial positions
  const a = new SnakeState(0,0);
  const b = new SnakeState(screen.length - 1, 0);
  const c = new SnakeState(0, screen.length - 1);
  const d = new SnakeState(screen.length - 1, screen.length - 1);

  // draw starting screen
  screen[a.y][a.x] = "A";
  screen[b.y][b.x] = "B";
  screen[c.y][c.x] = "C";
  screen[d.y][d.x] = "D";
  draw(screen);

  // this will wait for stepTime milliseconds and then call step with these arguments
  scheduleNextUpdate(stepTime, () => step(stepTime, newApplesEachStep, screen, a, b, c, d));
  // the "() =>" part is important!
  // without it, step will get called immediately instead of waiting
}

/**
 * Updates the snakes location after a motion
 * @param motion The direction being moved
 * @param snake The snake being moved
 * @returns The new point the snake will be at
 */
function locationAfterMotion(motion: Motion, snake: SnakeState): Point {
  switch (motion) {
    case "left": return new Point(snake.x-1, snake.y);
    case "right": return new Point(snake.x+1, snake.y);
    case "up": return new Point(snake.x, snake.y-1);
    case "down": return new Point(snake.x, snake.y+1);
  }
}

/**
 * Does a step and gets the motion for every snake and updates their status
 * @param stepTime Milliseconds to wait for each update
 * @param newApplesEachStep How many apples being added each step
 * @param screen Entire screen with all players and apples
 * @param snakeA Snake 'A'
 * @param snakeB Snake 'B'
 * @param snakeC Snake 'C'
 * @param snakeD Snake 'C'
 */
export function step(
  stepTime: number,
  newApplesEachStep: number,
  screen: GameScreen,
  snakeA: SnakeState,
  snakeB: SnakeState,
  snakeC: SnakeState,
  snakeD: SnakeState
): void {
  // generate new apples
  for (let i = 0; i < newApplesEachStep; i++) {
    // random integers in the closed range [0, screen.length]
    const x = Math.floor(Math.random() * screen.length);
    const y = Math.floor(Math.random() * screen.length);
    // if we generated coordinates that aren't empty, skip this apple
    if (screen[y][x] == "empty")
      screen[y][x] = "apple";
  }

  // players take turns in order: A -> B -> C -> D -> A -> B -> C -> D -> ...
  snakeMotion(screen,  snakeA, "A")
  snakeMotion(screen,  snakeB, "B");
  snakeMotion(screen,  snakeC, "C")
  snakeMotion(screen,  snakeD, "D");
  

  // update game screen
  draw(screen);

  // update snake statistics
  updateLost("A", snakeA.lost); updateApples("A", snakeA.apples);
  updateLost("B", snakeB.lost); updateApples("B", snakeB.apples);
  updateLost("C", snakeC.lost); updateApples("C", snakeC.apples);
  updateLost("D", snakeD.lost); updateApples("D", snakeD.apples);

  // run again unless everyone has lost
  if (!snakeA.lost || !snakeB.lost || !snakeC.lost || !snakeD.lost)
    scheduleNextUpdate(stepTime, () => step(stepTime, newApplesEachStep, screen, snakeA, snakeB, snakeC, snakeD));
}

/**
 * Updates the position of a snake
 * @param snakeScreen Screen after update
 * @param snake Snake being updated
 * @param letter Player letter
*/
export function snakeMotion(snakeScreen: GameScreen, snake: SnakeState, letter: Player){
  if (!snake.lost) {
    const temp = locationAfterMotion(agentMove("D", getScreenPart(snakeScreen, snake)), snake);
    if (temp.x < 0 || temp.y < 0 || temp.x >= snakeScreen.length || temp.y >= snakeScreen.length) // hit the edge of the screen
      snake.lost = true;
    else
      switch (snakeScreen[temp.y][temp.x]) {
        case "empty": { // make the move
          snake.setPoint(temp);
          snakeScreen[temp.y][temp.x] = letter;
          break;
        }
        case "apple": { // make the move and eat the apple
          snake.setPoint(temp);
          snake.apples++;
          snakeScreen[temp.y][temp.x] = letter;
          break;
        }
        default: { // lose
          snake.lost = true;
          break;
        }

    }
  } 
    
    
}










/*export function snakeMotion( snakeScreen: GameScreen,  snake: SnakeState, letter: Player, temp:Point ){
    if (temp.x < 0 || temp.y < 0 || temp.x >= snakeScreen.length || temp.y >= snakeScreen.length) // hit the edge of the screen
      snake.lost = true;
    else
      switch (snakeScreen[temp.y][temp.x]) {
        case "empty": { // make the move
          snake.setPoint(temp);
          snakeScreen[temp.y][temp.x] = letter;
          break;
        }
        case "apple": { // make the move and eat the apple
          snake.setPoint(temp);
          snake.apples++;
          snakeScreen[temp.y][temp.x] = letter;
          break;
        }
        default: { // lose
          snake.lost = true;
          break;
        }

  } 
    
    
}*/

