export interface Player {
  name: string;
  emoji: string;
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
  categories: string[];
  started: any;
  stoppedByPlayer: string;
}

export interface Answer {
  answers: string[];
  points: (number | null)[];
  playerId: string;
}

/****************************/

export enum GameState {
  Created,
  StartedIdle,
  RoundDicing,
  RoundWriting,
  RoundGivingPoints,
  GameFinished,
}

export interface DiceRollStep {
  letter: string;
  final: boolean;
}
