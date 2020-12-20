import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
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
  share,
  shareReplay,
  switchMap,
  take,
  tap,
  withLatestFrom,
} from 'rxjs/operators';
import { Answer, DiceRollStep, Game, GameState, Player, Round } from './models';
import { StorageService } from './storage.service';
import firebase from 'firebase/app';

@Injectable({
  providedIn: 'root',
})
export class StadtlandService {
  private alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  private currentGameId$ = new BehaviorSubject<string>(null);
  private currentGame$: Observable<
    AngularFirestoreDocument<Game>
  > = this.currentGameId$.pipe(
    filter((e) => !!e),
    map((gameId) => this.afs.collection<Game>('games').doc(gameId))
  );

  game$ = this.currentGame$.pipe(switchMap((game) => game.valueChanges()));
  state$ = this.game$.pipe(
    map((game) => game.state),
    distinctUntilChanged()
  );

  gameStarted$ = this.state$.pipe(
    map((state) => state === GameState.StartedIdle)
  );

  roundRunning$ = this.state$.pipe(
    map((state) =>
      [
        GameState.RoundDicing,
        GameState.RoundWriting,
        GameState.RoundGivingPoints,
      ].includes(state)
    ),
    distinctUntilChanged()
  );

  categories$ = this.game$.pipe(map((game) => game.categories));
  players$ = this.currentGame$.pipe(
    switchMap((game) =>
      game
        .collection<Player>('players')
        .valueChanges({ idField: 'id' })
        .pipe(
          map((players) =>
            players.map((player) => ({
              ...player,
              isMe: player.client === this.ss.clientId,
            }))
          )
        )
    )
  );
  myPlayer$ = this.currentGame$.pipe(
    switchMap((game) =>
      game
        .collection<Player>('players', (ref) =>
          ref.where('client', '==', this.ss.clientId)
        )
        .valueChanges({ idField: 'id' })
        .pipe(map((players) => players[0] || null))
    )
  );
  myScore$ = this.myPlayer$.pipe(map((p) => p?.score));

  gameCreatedByMe$ = this.game$.pipe(
    map((g) => g.client),
    distinctUntilChanged(),
    map((cid) => cid === this.ss.clientId)
  );

  currentRound$ = this.currentGame$.pipe(
    switchMap((game) =>
      game
        .collection<Round>('rounds', (ref) =>
          ref.orderBy('started', 'desc').limit(1)
        )
        .valueChanges({ idField: 'id' })
        .pipe(
          map((rounds) => rounds[0] || null),
          shareReplay(1)
        )
    )
  );

  currentRoundRef$ = this.currentRound$.pipe(
    switchMap(({ id: roundId }) =>
      this.currentGame$.pipe(
        map((gameRef) => gameRef.collection('rounds').doc(roundId))
      )
    ),
    shareReplay(1)
  );

  cumulatedRoundData$ = this.currentRoundRef$.pipe(
    switchMap((roundRef) =>
      combineLatest([
        this.categories$,
        this.players$,
        roundRef.collection<Answer>('answers').valueChanges({ idField: 'id' }),
      ]).pipe(
        map(([categories, players, answers]) => {
          const answerRows = answers.map((a) => {
            const player = players.find((p) => p.id === a.playerId);
            return {
              player,
              answerId: a.id,
              answers: a.answers.map((value, i) => ({
                value,
                points: a.points[i] || 0,
              })),
            };
          });

          return { categories, answerRows };
        })
      )
    )
  );

  constructor(private afs: AngularFirestore, private ss: StorageService) {}

  setCurrentGame(gameId?: string): void {
    this.currentGameId$.next(gameId);
  }

  createNewGame(): Observable<string> {
    return from(
      this.afs.collection<Game>('games').add({
        categories: [],
        state: 0,
        client: this.ss.clientId,
      })
    ).pipe(map((docRef) => docRef.id));
  }

  setGameState(state: GameState) {
    return this.currentGame$
      .pipe(take(1))
      .pipe(switchMap((game) => from(game.update({ state }))));
  }

  setCategories(categories: string[]) {
    this.currentGame$.pipe(take(1)).subscribe((game) => {
      game.update({ categories });
    });
  }

  addPlayer(name: string): Observable<string> {
    return this.currentGame$.pipe(
      take(1),
      switchMap((game) =>
        from(
          game
            .collection<Player>('players')
            .add({ name, score: 0, client: this.ss.clientId })
        ).pipe(map((docRef) => docRef.id))
      )
    );
  }

  removePlayer(id: string): Observable<any> {
    return this.currentGame$.pipe(
      take(1),
      switchMap((game) =>
        from(game.collection<Player>('players').doc(id).delete())
      )
    );
  }

  createNewRoundWithRandomLetter() {
    const started = firebase.firestore.Timestamp.now();
    const letter = this.getRandomLetter();

    return this.currentGame$.pipe(
      take(1),
      switchMap((game) =>
        from(game.collection<Round>('rounds').add({ letter, started })).pipe(
          map((docRef) => docRef.id)
        )
      )
    );
  }

  renewCurrentRound() {
    const started = firebase.firestore.Timestamp.now();
    const letter = this.getRandomLetter();

    return this.currentRound$.pipe(
      take(1),
      filter((e) => !!e),
      switchMap((round) =>
        this.currentGame$.pipe(
          take(1),
          switchMap((game) =>
            from(
              game
                .collection<Round>('rounds')
                .doc(round.id)
                .update({ letter, started })
            )
          )
        )
      )
    );
  }

  private getRandomLetter() {
    const pos = Math.floor(Math.random() * this.alphabet.length);
    return this.alphabet.charAt(pos);
  }

  generateTimedDiceRoll(targetLetter: string): Observable<DiceRollStep> {
    const stepTime = 80;
    const steps = 20;
    return concat(
      interval(stepTime).pipe(
        take(steps),
        map(() => ({ letter: this.getRandomLetter(), final: false }))
      ),
      of({ letter: targetLetter, final: true }).pipe(delay(stepTime))
    );
  }

  generateCountdown(seconds: number = 5): Observable<number> {
    return timer(0, 1000).pipe(
      take(seconds + 1),
      map((i) => seconds - i)
    );
  }

  submitMyAnswers(answers: string[]) {
    this.myPlayer$.subscribe();
    const points = answers.map(() => 0);
    return this.currentRound$.pipe(
      take(1),
      filter((e) => !!e),
      withLatestFrom(this.myPlayer$),
      concatMap(([round, player]) =>
        this.currentGame$.pipe(
          take(1),
          concatMap((game) =>
            from(
              game
                .collection<Round>('rounds')
                .doc(round.id)
                .collection<Answer>('answers')
                .add({ answers, points, playerId: player.id })
            ).pipe(map((docRef) => docRef.id))
          )
        )
      )
    );
  }

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
        from(answerDoc.update({ points: newPointsArray }))
      )
    );
  }

  moveRoundPointsToPlayerScore() {
    return this.cumulatedRoundData$.pipe(
      take(1),
      mergeMap((data) =>
        data.answerRows.map((row) => ({
          playerId: row.player.id,
          points: row.answers.reduce((acc, item) => acc + item.points, 0),
        }))
      ),
      withLatestFrom(this.currentGame$),
      mergeMap(([data, gameRef]) =>
        from(
          gameRef
            .collection('players')
            .doc(data.playerId)
            .update({
              score: firebase.firestore.FieldValue.increment(data.points),
            })
        )
      )
    );
  }

  getRouteForGameState(state: GameState) {
    const routeMap: { [s: number]: string } = {
      [GameState.StartedIdle]: 'landing',
      [GameState.RoundDicing]: 'dice',
      [GameState.RoundWriting]: 'write',
      // [GameState.RoundGivingPoints]: 'points',
    };

    return routeMap[state] || null;
  }
}
