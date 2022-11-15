import { BlocState } from "@bloc-state/state"
import {
  EMPTY,
  from,
  Observable,
  Subject,
  Subscription,
  catchError,
  shareReplay,
  map,
  distinctUntilChanged,
  filter,
  BehaviorSubject,
  mergeWith,
} from "rxjs"
import { BlocBase } from "./base"
import { BlocObserver } from "./bloc-observer"
import { BlocEvent } from "./event"
import { concurrent } from "./transformer"
import { Transition } from "./transition"
import {
  BlocStateDataType,
  EventHandler,
  ClassType,
  BlocSelectorConfig,
  EventTransformer,
  Emitter,
  OnEventConfig,
} from "./types"

export type DerivedStateMapValue<T> = {
  state$: Observable<T>
}

export abstract class Bloc<
  Event extends BlocEvent,
  State extends BlocState,
> extends BlocBase<State> {
  constructor(state: State) {
    super(state)
    const { data } = state.payload
    this.#dataSubject = new BehaviorSubject(data)
    this.data$ = Bloc.subjectToShareReplayObservable(this.#dataSubject)
    this.#data = data
    this.add = this.add.bind(this)
    this.on = this.on.bind(this)
    this.emit = this.emit.bind(this)
  }

  readonly #eventSubject$ = new Subject<Event>()

  readonly #eventMap = new Map<ClassType<Event>, null>()

  readonly #subscriptions = new Set<Subscription>()

  readonly #emitters = new Set<Emitter<State>>()

  readonly #derivedStateMap = new Map<
    ClassType<State>,
    DerivedStateMapValue<State>
  >()

  readonly #dataSubject: BehaviorSubject<BlocStateDataType<State>>

  readonly isBlocInstance = true

  readonly data$: Observable<BlocStateDataType<State>>

  #data: BlocStateDataType<State>

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

  protected on<T extends Event, S extends State>(
    event: ClassType<T>,
    eventHandler: EventHandler<T, S>,
    config?: OnEventConfig<T, S>,
  ): void {
    const state = config?.listenTo
    const transformer = config?.transformer ?? Bloc.transformer

    if (this.#eventMap.has(event)) {
      throw new Error(`${event.name} can only have one EventHandler`)
    }

    this.#eventMap.set(event, null)

    if (state && !this.#derivedStateMap.has(state)) {
      this.#subscribeToDerivedState(state)
    }

    const mapEventToState = (event: T): Observable<void> => {
      const stateToBeEmittedStream$ = new Subject<State>()
      let disposables: Subscription[] = []
      let isClosed = false

      const emitter: Emitter<State> = (nextState: State): void => {
        if (isClosed) {
          return
        }

        if (this.state !== nextState) {
          try {
            this.onTransition(new Transition(this.state, event, nextState))
            stateToBeEmittedStream$.next(nextState)
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
            this.emit(nextState, state)
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

  #createDerivedStateStream = (stateType: ClassType<State>) => {
    return this.state$.pipe(
      filter((state) => state instanceof stateType),
      distinctUntilChanged(),
      shareReplay({ bufferSize: 1, refCount: true }),
    )
  }

  #subscribeToDerivedState<S extends State>(stateType: ClassType<S>) {
    let subscription: Subscription

    const state$ = this.#createDerivedStateStream(stateType)
    subscription = state$.subscribe()
    this.#derivedStateMap.set(stateType, {
      state$,
    })

    this.#subscriptions.add(subscription)
  }

  #fetchDerivedState = <S extends State>(stateType: ClassType<S>) => {
    const state$ = this.#derivedStateMap.get(stateType)?.state$

    if (!state$) {
      throw new Error(
        `Bloc.getDerivedState: ${stateType} is not being listened to in this bloc`,
      )
    }

    return state$
  }

  getDerivedState(stateType: ClassType<State>[]): Observable<State> {
    const mergedDerivedState$ = stateType
      .map((type) => this.#fetchDerivedState(type))
      .reduceRight((prev, curr) => prev.pipe(mergeWith(curr)))
    return mergedDerivedState$
  }

  get data(): BlocStateDataType<State> {
    return this.#data
  }

  override emit(nextState: State, stateType?: ClassType<State>): void {
    const { hasData, data } = nextState.payload

    if (hasData) {
      this.#emitData(data)
    }

    super.emit(nextState)
  }

  #emitData(data: any) {
    // if the view model of this bloc is a primitive value or an Array, just return the new value
    if (Array.isArray(this.#data) || this.#data !== Object(this.#data)) {
      this.#data = data
      this.#dataSubject.next(data)
    } else {
      // if the view model is an object, we can merge top level properties of an object
      const mergedData = { ...this.#data, ...data }
      this.#data = mergedData
      this.#dataSubject.next(mergedData)
    }
  }

  static subjectToShareReplayObservable = <T>(subject: Subject<T>) => {
    return subject
      .asObservable()
      .pipe(
        distinctUntilChanged(),
        shareReplay({ bufferSize: 1, refCount: true }),
      )
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

  override select<K>(
    config:
      | BlocSelectorConfig<State, K>
      | ((state: BlocStateDataType<State>) => K),
  ): Observable<K> {
    let data$: Observable<K>
    if (typeof config === "function") {
      data$ = this.data$.pipe(map(config))
    } else {
      const selectorFilter = config.filter ?? (() => true)
      data$ = this.data$.pipe(map(config.selector), filter(selectorFilter))
    }

    return data$.pipe(
      distinctUntilChanged(),
      shareReplay({ refCount: true, bufferSize: 1 }),
    )
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
    this.#derivedStateMap.clear()
    super.close()
  }
}

export const isBlocInstance = (bloc: any): bloc is Bloc<any, any> => {
  return bloc instanceof Bloc || Boolean(bloc.isBlocInstance)
}
