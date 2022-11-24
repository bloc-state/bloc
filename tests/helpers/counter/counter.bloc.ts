import { Bloc } from "../../../src"
import {
  CounterDecrementEvent,
  CounterEvent,
  CounterIncrementEvent,
  CounterNoEmitDataEvent,
} from "./counter.event"
import { CounterState } from "./counter.state"

export class CounterBloc extends Bloc<CounterEvent, CounterState> {
  constructor() {
    super(new CounterState(0))

    this.on(CounterIncrementEvent, (event, emit) => {
      emit((state) => state.ready(state.data + 1))
    })

    this.on(CounterDecrementEvent, (event, emit) => {
      emit((state) => state.ready(state.data - 1))
    })

    this.on(CounterNoEmitDataEvent, (event, emit) => {
      emit((state) => state.loading())
    })
  }
}
