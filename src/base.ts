import {
  Observable,
  Subscription,
  distinctUntilChanged,
  shareReplay,
  Subject,
} from "rxjs"
import { Bloc } from "./bloc"
import { Change } from "./change"
import { EmitUpdaterCallback } from "./types"

export abstract class BlocBase<State = any> {
  constructor(state: State) {
    this.#state = state
    this.emit = this.emit.bind(this)
    this.#stateSubject$ = new Subject()
    this.state$ = this.#buildStatePipeline()
    this.#stateSubscription = this.#subscribeStateoState()
    this.onCreate()
  }

  #state: State

  readonly #stateSubject$: Subject<State>

  readonly #stateSubscription: Subscription

  #subscribeStateoState(): Subscription {
    return this.state$.subscribe()
  }

  #buildStatePipeline(): Observable<State> {
    return this.#stateSubject$
      .asObservable()
      .pipe(
        distinctUntilChanged(),
        shareReplay({ refCount: true, bufferSize: 1 }),
      )
  }

  #handleNewState(newState: State | EmitUpdaterCallback<State>): State {
    let stateToBeEmitted: State

    if (typeof newState === "function") {
      let callback = newState as EmitUpdaterCallback<State>
      stateToBeEmitted = callback(this.state)
    } else {
      stateToBeEmitted = newState
    }

    return stateToBeEmitted
  }

  protected onCreate() {
    Bloc.observer.onCreate(this)
  }

  protected onError(error: Error): void {
    Bloc.observer.onError(this, error)
  }

  protected onChange(change: Change<State>): void {
    Bloc.observer.onChange(this, change)
  }

  readonly state$: Observable<State>

  get state(): State {
    return this.#state
  }

  emit(newState: State | EmitUpdaterCallback<State>): void {
    if (!this.#stateSubject$.closed) {
      try {
        const stateToBeEmitted = this.#handleNewState(newState)
        if (this.#state !== stateToBeEmitted) {
          this.onChange(new Change(this.state, stateToBeEmitted))
          this.#state = stateToBeEmitted
          this.#stateSubject$.next(stateToBeEmitted)
        }
      } catch (error) {
        if (error instanceof Error) this.onError(error)
      }
    }
  }

  close() {
    this.#stateSubject$.complete()
    this.#stateSubscription.unsubscribe()
  }
}
