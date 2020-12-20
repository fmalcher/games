import { Injectable } from '@angular/core';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, concat, from, interval, Observable, of } from 'rxjs';
import {
  delay,
  distinctUntilChanged,
  filter,
  map,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { Game, GameState, Player, Round } from './models';
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
        .valueChanges()
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
        .pipe(map((rounds) => rounds[0] || null))
    )
  );

  constructor(
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    private ss: StorageService
  ) {}

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
    this.currentGame$.pipe(take(1)).subscribe((game) => {
      game.update({ state });
    });
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

  generateTimedDiceRoll(targetLetter: string): Observable<string> {
    const stepTime = 80;
    return concat(
      interval(stepTime).pipe(
        take(20),
        map(() => this.getRandomLetter())
      ),
      of(targetLetter).pipe(delay(stepTime))
    );
  }
}
