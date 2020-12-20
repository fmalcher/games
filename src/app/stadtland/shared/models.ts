export interface Player {
  name: string;
  score: number;
  client: string;
  isMe?: boolean;
}

export interface Game {
  categories: string[];
  state: number;
  client: string;
}

export interface Round {
  letter: string;
  started: any;
}

/****************************/

export enum GameState {
  Created,
  StartedIdle,
  RoundDicing,
  RoundWriting,
  RoundGivingPoints,
}

export interface DiceRollStep {
  letter: string;
  final: boolean;
}
