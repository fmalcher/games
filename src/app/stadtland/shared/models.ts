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
}

export interface Answer {
  answers: string[];
  points: number[];
  playerId: string;
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
