import { BlocState, BlocStateStatus } from "@bloc-state/state"
import { Bloc, BlocEvent } from "../src"
import { restartable, sequential } from "../src/transformer"
import { delay } from "./helpers/counter/delay"

describe("transformers", () => {
  abstract class EventTransformerEvent extends BlocEvent {}
  class EventTransformerSequentialEvent extends EventTransformerEvent {}
  class EventTransformerRestartableEvent extends EventTransformerEvent {
    constructor(public num: number = 1) {
      super()
    }
  }
  class EventTransformerState extends BlocState<number> {}

  class EventTransformerBloc extends Bloc<
    EventTransformerEvent,
    EventTransformerState
  > {
    constructor() {
      super(new EventTransformerState(0))

      this.on(
        EventTransformerSequentialEvent,
        async (event, emit) => {
          await delay(1000)
          emit(this.state.ready((data) => data + 1))
        },
        sequential(),
      )

      this.on(
        EventTransformerRestartableEvent,
        async (event, emit) => {
          await delay(1000)
          emit(this.state.ready(event.num))
        },
        restartable(),
      )
    }
  }

  let transformerBloc: EventTransformerBloc

  beforeEach(() => {
    transformerBloc?.close()
    transformerBloc = new EventTransformerBloc()
  })

  describe("sequential", () => {
    it("should process each event sequentially, additional events added should be queued while processing current event", async () => {
      const states: EventTransformerState[] = []
      transformerBloc.state$.subscribe({
        next: (state) => {
          states.push(state)
        },
        complete: () => {
          expect(states.length).toBe(5)
        },
      })

      expect(states.length).toBe(0)
      transformerBloc.add(new EventTransformerSequentialEvent())
      transformerBloc.add(new EventTransformerSequentialEvent())
      transformerBloc.add(new EventTransformerSequentialEvent())
      transformerBloc.add(new EventTransformerSequentialEvent())
      transformerBloc.add(new EventTransformerSequentialEvent())
      await delay(3100)
      expect(states.length).toBe(3)
      await delay(3000)
      transformerBloc.close()
    }, 10000)
  })

  describe("restartable", () => {
    it("should process each event until completion or until a new event comes in", async () => {
      const states: EventTransformerState[] = []
      transformerBloc.state$.subscribe({
        next: (state) => states.push(state),
        complete: () => {
          const [a, b] = states
          expect(states.length).toBe(2)
          expect(a.status === BlocStateStatus.initial).toBe(true)
          expect(b.data).toBe(2)
        },
      })

      expect(states.length).toBe(0)
      transformerBloc.add(new EventTransformerRestartableEvent())
      transformerBloc.add(new EventTransformerRestartableEvent())
      transformerBloc.add(new EventTransformerRestartableEvent())
      transformerBloc.add(new EventTransformerRestartableEvent())
      transformerBloc.add(new EventTransformerRestartableEvent(2))
      await delay(3100)
      transformerBloc.close()
    }, 10000)
  })
})
