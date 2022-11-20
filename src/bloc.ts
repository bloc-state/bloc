import {
  EMPTY,
  from,
  Observable,
  Subject,
  Subscription,
  catchError,
  filter,
} from "rxjs"
import { BlocBase } from "./base"
import { BlocObserver } from "./bloc-observer"
import { BlocEvent } from "./event"
import { concurrent } from "./transformer"
import { Transition } from "./transition"
import {
  EventHandler,
  ClassType,
  EventTransformer,
  Emitter,
  EmitUpdaterCallback,
  BlocConfig,
} from "./types"

export abstract class Bloc<
  Event extends BlocEvent,
  State,
> extends BlocBase<State> {
  constructor(state: State, config?: BlocConfig<State>) {
    // don't pass compare to BlocBase or else the comparison will happen twice
    super(state, { ...config, compare: undefined })
    this.on = this.on.bind(this)
    this.add = this.add.bind(this)
    this.emit = this.emit.bind(this)
    this.#compare = config?.compare ?? ((a: any, b: any) => a !== b)
  }

  readonly #compare: NonNullable<BlocConfig<State>["compare"]>

  readonly #eventSubject$ = new Subject<Event>()

  readonly #eventMap = new Map<ClassType<Event>, null>()

  readonly #subscriptions = new Set<Subscription>()

  readonly #emitters = new Set<Emitter<State>>()

  readonly isBlocInstance = true

  #mapEventToStateError(error: Error): Observable<never> {
    this.onError(error)
    return EMPTY
  }

  protected override onError(error: Error): void {
    Bloc.observer.onError(this, error)
  }

  protected onTransition(transition: Transition<Event, State>): void {
    Bloc.observer.onTransition(this, transition)
  }

  protected onEvent(event: Event): void {
    Bloc.observer.onEvent(this, event)
  }

  protected on<T extends Event>(
    event: ClassType<T>,
    eventHandler: EventHandler<T, State>,
    transformer: EventTransformer<T> = Bloc.transformer,
  ): void {
    if (this.#eventMap.has(event)) {
      throw new Error(`${event.name} can only have one EventHandler`)
    }

    this.#eventMap.set(event, null)

    const mapEventToState = (event: T): Observable<void> => {
      const stateToBeEmittedStream$ = new Subject<State>()
      let disposables: Subscription[] = []
      let isClosed = false

      const emitter: Emitter<State> = (
        nextState: State | EmitUpdaterCallback<State>,
      ): void => {
        if (isClosed) {
          return
        }

        let stateToBeEmitted: State

        if (typeof nextState === "function") {
          let callback = nextState as EmitUpdaterCallback<State>
          stateToBeEmitted = callback(this.state)
        } else {
          stateToBeEmitted = nextState
        }

        if (this.#compare(this.state, stateToBeEmitted)) {
          try {
            this.onTransition(
              new Transition(this.state, event, stateToBeEmitted),
            )
            stateToBeEmittedStream$.next(stateToBeEmitted)
          } catch (error) {
            if (error instanceof Error) this.onError(error)
          }
        }
      }

      emitter.onEach = (stream$, onData, onError) =>
        new Promise((resolve) => {
          const subscription = stream$.subscribe({
            next: onData,
            error: (error) => {
              if (onError != null && error != null) {
                onError(error)
              }
              resolve()
            },
            complete: () => {
              resolve()
            },
          })

          disposables.push(subscription)
        })

      emitter.forEach = (stream$, onData, onError) =>
        emitter.onEach(
          stream$,
          (data) => emitter(onData(data)),
          onError ? (error: any) => emitter(onError(error)) : undefined,
        )

      emitter.close = () => {
        isClosed = true
        stateToBeEmittedStream$.complete()
        for (const sub of disposables) {
          sub.unsubscribe()
        }
        disposables = []
        this.#emitters.delete(emitter)
      }

      this.#emitters.add(emitter)

      return new Observable((subscriber) => {
        stateToBeEmittedStream$.subscribe({
          next: (nextState) => {
            this.emit(nextState)
          },
        })

        const result = eventHandler.call(this, event, emitter)

        if (result instanceof Promise) {
          from(result).subscribe({
            complete: () => subscriber.complete(),
          })
        } else {
          subscriber.complete()
        }

        return () => {
          emitter.close()
        }
      })
    }

    const transformStream$ = transformer(
      this.#eventSubject$.pipe(
        filter((newEvent): newEvent is T => newEvent instanceof event),
      ),
      mapEventToState,
    )

    const subscription = transformStream$
      .pipe(catchError((error: Error) => this.#mapEventToStateError(error)))
      .subscribe()

    this.#subscriptions.add(subscription)
  }

  static transformer: EventTransformer<any> = concurrent()

  static observer: BlocObserver = new BlocObserver()

  add(event: Event) {
    if (!this.#eventSubject$.closed) {
      try {
        this.onEvent(event)
        this.#eventSubject$.next(event)
      } catch (error) {
        if (error instanceof Error) this.onError(error)
      }
    }
    return this
  }

  override close(): void {
    for (const emitter of this.#emitters) {
      emitter.close()
    }

    for (const sub of this.#subscriptions) {
      sub.unsubscribe()
    }

    this.#emitters.clear()
    this.#subscriptions.clear()
    super.close()
  }
}

export const isBlocInstance = (bloc: any): bloc is Bloc<any, any> => {
  return bloc instanceof Bloc || Boolean(bloc.isBlocInstance)
}
