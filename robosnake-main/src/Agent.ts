import { MaybeCell, ScreenPart } from "./GameRunner";

export type Player = "A" | "B" | "C" | "D"; 

export type Motion = "up" | "down" | "left" | "right";

/**
 * Moves in a random direction, tries not to hit anything
 * @param part 5x5 window with the agent in the center
 * @returns Direction to move
 */
export function randomMotion(part: ScreenPart): Motion {
  const rnd: number = Math.random() * 4; // random float in the half-open range [0, 4)

  let x: Motion;
  if (rnd < 1) x = "up";
  else if (rnd < 2) x = "down";
  else if (rnd < 3) x = "left";
  else x = "right";

  // try not to hit anything
  if (tryMove(x, part) != "apple" && tryMove(x, part) != "empty") {
    switch (x) {
      case "up": return "down";
      case "right": return "left";
      case "down": return "up";
      case "left": return "right";
    }
  }

  return x;
}

/**
 * Tries a move to check what is there
 * @param m Which direction moving towards
 * @param p 5x5 window with the agent in the center
 * @returns Either Player, "apple", "empty", or "outside"
 */
function tryMove(m: Motion, p: ScreenPart): MaybeCell {
  // the snake is positioned in the center at p[2][2]
  switch (m) {
    case "left": return p[2][1];
    case "right": return p[2][3];
    case "up": return p[1][2];
    case "down": return p[3][2];
  }
}

export interface PlayerMove {
  agentMove: (screenPart: ScreenPart) =>  Motion;
}

export class PlayerA implements PlayerMove {
    agentMove(screenPart: ScreenPart): Motion { return "right" };
  }

export class PlayerB implements PlayerMove {
    agentMove(screenPart: ScreenPart):Motion{
      return randomMotion(screenPart)
    }
  }


export class PlayerC implements PlayerMove {
    agentMove(screenPart: ScreenPart): Motion {
      const cCycle: Motion[] = ["up", "up", "right", "down", "right"];
      let cIndex: number = 0;
      const c: Motion = cCycle[cIndex];
      cIndex++;
      cIndex = cIndex % cCycle.length;
      return c;
    };
  }

export class PlayerD implements PlayerMove {
    agentMove(screenPart: ScreenPart):Motion{
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          if (screenPart[j][i] == "apple") {
            if (i > 3) return "right";
            else if (i < 3) return "left";
            else if (j > 3) return "down";
            else if (j < 3) return "up";
          }
        }
      }
      return randomMotion(screenPart);
    };
  }
