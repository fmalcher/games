import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import {
  BehaviorSubject,
  combineLatest,
  concat,
  from,
  interval,
  Observable,
  of,
  timer,
} from 'rxjs';
import {
  concatMap,
  delay,
  distinctUntilChanged,
  filter,
  map,
  mergeMap,
  shareReplay,
  switchMap,
  take,
  withLatestFrom,
} from 'rxjs/operators';
import { Answer, DiceRollStep, Game, GameState, Player, Round } from './models';
import { ClientIdService } from './clientid.service';
import firebase from 'firebase/app';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { slfConfig } from './config';

@Injectable({
  providedIn: 'root',
})
export class StadtlandService {
  /** firestore collection name for games */
  private gamesCollection = 'stadtlandGames';

  /** **********
   * GAME
   * ***********
   */

  /** ID of the currently active game, can be set with `setCurrentGame()` */
  private currentGameId$ = new BehaviorSubject<string>(null);

  /** reference to the current game doc */
  private currentGameRef$ = this.currentGameId$.pipe(
    filter((e) => !!e),
    map((gameId) => this.afs.collection<Game>(this.gamesCollection).doc(gameId))
  );

  /** the current game data */
  game$ = this.currentGameRef$.pipe(
    switchMap((game) => game.valueChanges()),
    shareReplay(1)
  );

  /** state of the current game */
  state$ = this.game$.pipe(
    map((game) => game.state),
    distinctUntilChanged()
  );

  /**
   * flag that indicates whether the current game has been started.
   * after start the player list cannot be changed anymore
   */
  gameStarted$ = this.state$.pipe(
    map((state) => state === GameState.StartedIdle)
  );

  /** list of categories of the current game */
  categories$ = this.game$.pipe(map((game) => game.categories));

  /** list of all players in the current game */
  players$ = this.currentGameRef$.pipe(
    switchMap((game) =>
      game
        .collection<Player>('players', (ref) => ref.orderBy('score', 'desc'))
        .valueChanges({ idField: 'id' })
        .pipe(
          map((players) =>
            players.map((player) => ({
              ...player,
              isMe: this.cis.isMyClientId(player.client),
            }))
          )
        )
    ),
    shareReplay(1)
  );

  /** my player */
  myPlayer$ = this.currentGameRef$.pipe(
    switchMap((game) =>
      game
        .collection<Player>('players', (ref) =>
          ref.where('client', '==', this.cis.clientId)
        )
        .valueChanges({ idField: 'id' })
        .pipe(map((players) => players[0] || null))
    ),
    shareReplay(1)
  );

  /** score of my player */
  myScore$ = this.myPlayer$.pipe(map((p) => p?.score));

  /** flag that describes whether I am the game master */
  gameCreatedByMe$ = this.game$.pipe(
    map((g) => g.client),
    distinctUntilChanged(),
    map((cid) => this.cis.isMyClientId(cid))
  );

  /** **********
   * ROUND
   * ***********
   */

  /** the current round (is always the latest created) */
  currentRound$ = this.currentGameRef$.pipe(
    switchMap((game) =>
      game
        .collection<Round>('rounds', (ref) =>
          ref.orderBy('started', 'desc').limit(1)
        )
        .valueChanges({ idField: 'id' })
        .pipe(map((rounds) => rounds[0] || null))
    ),
    shareReplay(1)
  );

  /** reference to the current round document */
  currentRoundRef$ = this.currentRound$.pipe(
    switchMap(({ id: roundId }) =>
      this.currentGameRef$.pipe(
        map((gameRef) => gameRef.collection('rounds').doc(roundId))
      )
    ),
    shareReplay(1)
  );

  /** categories of the current round */
  currentRoundCategories$ = this.currentRound$.pipe(map((r) => r.categories));

  /** letter of the current round */
  currentRoundLetter$ = this.currentRound$.pipe(map((r) => r.letter));

  /** all data from the round necessary to display the points/results table */
  cumulatedRoundData$ = this.currentRoundRef$.pipe(
    switchMap((roundRef) =>
      combineLatest([
        this.currentRound$,
        this.players$,
        roundRef.collection<Answer>('answers').valueChanges({ idField: 'id' }),
      ]).pipe(
        map(([round, players, answers]) => {
          const answerRows = answers.map((a) => {
            const player = players.find((p) => p.id === a.playerId);
            return {
              player,
              answerId: a.id,
              rowPoints: a.points.reduce((acc, item) => acc + item, 0),
              answers: a.answers.map((value, i) => ({
                value,
                points: a.points[i] >= 0 ? a.points[i] : null,
              })),
            };
          });

          return {
            stoppedByPlayer: round.stoppedByPlayer,
            categories: round.categories,
            answerRows,
          };
        })
      )
    ),
    shareReplay(1)
  );

  /*************************************************** */

  constructor(private afs: AngularFirestore, private cis: ClientIdService) {}

  /** **********
   * GAME
   * ***********
   */

  /** set the ID of the current game according to the route */
  setCurrentGame(gameId?: string): void {
    this.currentGameId$.next(gameId);
  }

  /** create a new game and return the ID of the new document */
  createNewGame(): Observable<string> {
    return from(
      this.afs
        .collection<Game>(this.gamesCollection)
        .add({
          categories: [],
          state: 0,
          client: this.cis.clientId,
        })
        .then((docRef) => docRef.id)
    );
  }

  /** change the state of the game */
  setGameState(state: GameState) {
    return this.currentGameRef$
      .pipe(take(1))
      .pipe(switchMap((game) => game.update({ state })));
  }

  /** set the category list of the current game */
  setCategories(categories: string[]) {
    return this.currentGameRef$.pipe(
      take(1),
      mergeMap((game) => game.update({ categories }))
    );
  }

  /** add a player to the current game and return its new ID */
  addPlayer(name: string, emoji: string): Observable<string> {
    return this.currentGameRef$.pipe(
      take(1),
      switchMap((game) =>
        game
          .collection<Player>('players')
          .add({ name, emoji, score: 0, client: this.cis.clientId })
          .then((docRef) => docRef.id)
      )
    );
  }

  /** remove a player from the current game */
  removePlayer(id: string): Observable<any> {
    return this.currentGameRef$.pipe(
      take(1),
      switchMap((game) => game.collection<Player>('players').doc(id).delete())
    );
  }

  /** create a new round with random letter in the current game */
  createNewRoundWithRandomLetter() {
    const started = firebase.firestore.Timestamp.now();
    const letter = this.getRandomLetter(slfConfig.alphabet);

    return this.currentGameRef$.pipe(
      withLatestFrom(this.categories$),
      take(1),
      switchMap(([gameRef, categories]) =>
        gameRef
          .collection<Round>('rounds')
          .add({ letter, started, categories, stoppedByPlayer: null })
          .then((docRef) => docRef.id)
      )
    );
  }

  /** **********
   * ROUND
   * ***********
   */

  /** refresh the current round and assign a new letter */
  renewCurrentRound() {
    const started = firebase.firestore.Timestamp.now();
    const letter = this.getRandomLetter(slfConfig.alphabet);

    return this.currentRound$.pipe(
      take(1),
      filter((e) => !!e),
      switchMap((round) =>
        this.currentGameRef$.pipe(
          take(1),
          switchMap((game) =>
            game
              .collection<Round>('rounds')
              .doc(round.id)
              .update({ letter, started })
          )
        )
      )
    );
  }

  /** Stop current round: set my user as "stoppedBy" and change state */
  stopCurrentRound() {
    return this.currentRoundRef$.pipe(
      take(1),
      withLatestFrom(this.myPlayer$),
      mergeMap(([roundRef, player]) =>
        roundRef.update({ stoppedByPlayer: player.id })
      ),
      mergeMap(() => this.setGameState(GameState.RoundGivingPoints))
    );
  }

  /** save my answers in the current round */
  submitMyAnswers(answers: string[]) {
    const points = answers.map(() => null);
    return this.currentRound$.pipe(
      take(1),
      filter((e) => !!e),
      withLatestFrom(this.myPlayer$),
      concatMap(([round, player]) =>
        this.currentGameRef$.pipe(
          take(1),
          concatMap((game) =>
            game
              .collection<Round>('rounds')
              .doc(round.id)
              .collection<Answer>('answers')
              .add({ answers, points, playerId: player.id })
              .then((docRef) => docRef.id)
          )
        )
      )
    );
  }

  /** set points for a single answer in the current round */
  setRoundPoints(answerId: string, position: number, points: number) {
    const answerDoc$ = this.currentRoundRef$.pipe(
      map((roundRef) => roundRef.collection<Answer>('answers').doc(answerId)),
      take(1)
    );

    const currentPoints$ = answerDoc$.pipe(
      concatMap((answerDoc) =>
        answerDoc.valueChanges().pipe(map((a) => a.points))
      )
    );

    return currentPoints$.pipe(
      take(1),
      map((pointsArray) => {
        const newPointsArray = [...pointsArray];
        newPointsArray[position] = points;
        return newPointsArray;
      }),
      withLatestFrom(answerDoc$),
      concatMap(([newPointsArray, answerDoc]) =>
        answerDoc.update({ points: newPointsArray })
      )
    );
  }

  /** transfer all points from the round to the score of the players */
  moveRoundPointsToPlayerScore() {
    return this.cumulatedRoundData$.pipe(
      take(1),
      mergeMap((data) =>
        data.answerRows.map((row) => ({
          playerId: row.player.id,
          points: row.answers.reduce((acc, item) => acc + item.points, 0),
        }))
      ),
      withLatestFrom(this.currentGameRef$),
      mergeMap(([data, gameRef]) =>
        gameRef
          .collection('players')
          .doc(data.playerId)
          .update({
            score: firebase.firestore.FieldValue.increment(data.points),
          })
      )
    );
  }

  /** generate a dice roll stream that emits random letters in sequence and ends with the chosen letter */
  generateTimedDiceRoll(
    targetLetter: string,
    stepTimeMs = 80,
    steps = 20
  ): Observable<DiceRollStep> {
    return concat(
      interval(stepTimeMs).pipe(
        take(steps),
        map(() => ({
          letter: this.getRandomLetter(slfConfig.alphabet),
          final: false,
        }))
      ),
      of({ letter: targetLetter, final: true }).pipe(delay(stepTimeMs))
    );
  }

  /** **********
   * UTILITY
   * ***********
   */

  /** generate a random letter from the alphabet */
  private getRandomLetter(alphabet: string) {
    const pos = Math.floor(Math.random() * alphabet.length);
    return alphabet.charAt(pos);
  }

  /** generate a countdown to 0 in seconds */
  generateCountdown(seconds: number = 5): Observable<number> {
    return timer(0, 1000).pipe(
      take(seconds + 1),
      map((i) => seconds - i)
    );
  }
}
