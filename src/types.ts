import { BlocState } from "@bloc-state/state"
import { Observable } from "rxjs"
import { BlocBase } from "./base"
import { Bloc } from "./bloc"
import { Cubit } from "./cubit"
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

export type EmitDataUpdaterCallback<T extends BlocState<any>> = (state: T) => T

export interface Emitter<S extends BlocState<any>> extends BlocEmitter<S> {
  (state: S): void
  close: () => void
}

export type EventHandler<E extends BlocEvent, S extends BlocState<any>> = (
  event: InstanceType<ClassType<E>>,
  emitter: Emitter<S>,
) => void | Promise<void>

export interface ClassType<T = any> extends Function {
  new (...args: any[]): T
}

export type BlocStateType<T extends BlocBase<any>> = T extends Cubit<infer U>
  ? U
  : T extends Bloc<any, infer D>
  ? D
  : never

export type BlocStateDataType<T> = T extends BlocState<infer U> ? U : T

export type CubitSelectorConfig<State, P> = {
  selector: (state: State) => P
  filter?: (state: P) => boolean
}

export type BlocSelectorConfig<State extends BlocState<any>, P> = {
  selector: (state: BlocStateDataType<State>) => P
  filter?: (state: P) => boolean
}

export type EventMapper<Event extends BlocEvent> = (
  event: Event,
) => Observable<void>

export type OnEventConfig<
  Event extends BlocEvent,
  State extends BlocState<any>,
> = {
  listenTo?: ClassType<State>
  transformer?: EventTransformer<Event>
}

export type EventTransformer<Event extends BlocEvent> = (
  events$: Observable<Event>,
  mapper: EventMapper<Event>,
) => Observable<void>
