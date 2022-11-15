import { Bloc } from "../../../src"
import {
  CounterDecrementEvent,
  CounterEvent,
  CounterIncrementEvent,
  CounterNoEmitDataEvent,
} from "./counter.event"
import {
  CounterDecrementState,
  CounterIncrementState,
  CounterState,
} from "./counter.state"

export class CounterBloc extends Bloc<CounterEvent, CounterState> {
  constructor() {
    super(CounterState.ready(0))

    this.on(
      CounterIncrementEvent,
      (event, emit) => {
        emit(CounterIncrementState.ready(this.data + 1))
      },
      { listenTo: CounterIncrementState },
    )

    this.on(
      CounterDecrementEvent,
      (event, emit) => {
        emit(CounterDecrementState.ready(this.data - 1))
      },
      {
        listenTo: CounterDecrementState,
      },
    )

    this.on(
      CounterNoEmitDataEvent,
      (event, emit) => {
        emit(CounterState.loading())
      },
      { listenTo: CounterState },
    )
  }
}
