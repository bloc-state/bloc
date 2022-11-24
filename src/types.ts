import { State } from "@bloc-state/state"
import { Observable } from "rxjs"
import { BlocEvent } from "./event"

export interface BlocEmitter<State> {
  onEach<T>(
    stream$: Observable<T>,
    onData: (data: T) => void,
    onError?: (error: Error) => void,
  ): Promise<void>

  forEach<T>(
    stream$: Observable<T>,
    onData: (data: T) => State,
    onError?: (error: Error) => State,
  ): Promise<void>
}

export type EmitUpdaterCallback<T> = (state: T) => T

export type EmitDataUpdaterCallback<T extends State<any>> = (state: T) => T

export interface Emitter<S> extends BlocEmitter<S> {
  (state: S | EmitUpdaterCallback<S>): void
  close: () => void
}

export type EventHandler<E extends BlocEvent, S> = (
  event: InstanceType<ClassType<E>>,
  emitter: Emitter<S>,
) => void | Promise<void>

export interface ClassType<T = any> extends Function {
  new (...args: any[]): T
}

export type EventMapper<Event extends BlocEvent> = (
  event: Event,
) => Observable<void>

export type EventTransformer<Event extends BlocEvent> = (
  events$: Observable<Event>,
  mapper: EventMapper<Event>,
) => Observable<void>
