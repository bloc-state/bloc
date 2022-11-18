import { BlocState } from "@bloc-state/state"
import { skip, take } from "rxjs"
import { BlocEvent, Bloc, Transition, isBlocInstance } from "../src"
import { CounterBloc } from "./helpers/counter/counter.bloc"
import { CounterCubit } from "./helpers/counter/counter.cubit"
import {
  CounterIncrementEvent,
  CounterDecrementEvent,
} from "./helpers/counter/counter.event"
import { CounterState } from "./helpers/counter/counter.state"

describe("bloc", () => {
  let bloc: CounterBloc

  beforeEach(() => {
    bloc = new CounterBloc()
  })

  it("should be defined", () => {
    expect(bloc).toBeDefined()
  })

  it("should have initial state", (done) => {
    bloc.state$.subscribe({
      next: (state) => {
        expect(state.data).toBe(0)
      },
      complete: () => done(),
    })

    bloc.close()
  })

  it("should map events to state", (done) => {
    const states: CounterState[] = []
    bloc.state$.pipe(skip(1), take(4)).subscribe({
      next: (state) => states.push(state),
      complete: () => {
        const [first, second, third, fourth] = states
        expect(first.data).toBe(1)
        expect(second.data).toBe(2)
        expect(third.data).toBe(3)
        expect(fourth.data).toBe(2)
        bloc.close()
        done()
      },
    })
    bloc.add(new CounterIncrementEvent())
    bloc.add(new CounterIncrementEvent())
    bloc.add(new CounterIncrementEvent())
    bloc.add(new CounterDecrementEvent())
  })

  describe("Bloc.on", () => {
    it("should work without optional config", () => {
      class TestState extends BlocState<null> {}
      class TestEvent extends BlocEvent {}

      class TestBloc extends Bloc<TestEvent, TestState> {
        constructor() {
          super(new TestState(null))

          this.on(TestEvent, (event, emit) => {
            emit(this.state.ready())
          })
        }
      }

      let testState: TestState
      const testBloc = new TestBloc()
      testBloc.state$.pipe(take(1)).subscribe({
        next: (state) => (testState = state),
        complete: () => {
          expect(testState).toBeDefined()
          testBloc.close()
        },
      })
      testBloc.add(new TestEvent())
    })

    it("should throw an error if attempting to subscribe to the same event more than once", () => {
      class TestState extends BlocState<null> {}
      class TestEvent extends BlocEvent {}

      class TestBloc extends Bloc<TestEvent, TestState> {
        constructor() {
          super(new TestState(null))

          this.on(TestEvent, (event, emit) => {})

          this.on(TestEvent, (event, emit) => {})
        }
      }

      expect(() => new TestBloc()).toThrowError(
        "TestEvent can only have one EventHandler",
      )
    })
  })

  describe("Bloc.onError", () => {
    it("should be invoked when an error is thrown from Bloc.onEvent", (done) => {
      class TestState extends BlocState<null> {}
      class TestEvent extends BlocEvent {}

      class TestBloc extends Bloc<TestEvent, TestState> {
        constructor() {
          super(new TestState(null))
          this.on(TestEvent, (event, emit) => {})
        }

        protected override onEvent(event: TestEvent): void {
          throw new Error("onevent error")
        }

        protected override onError(error: Error): void {
          expect(error.message).toBe("onevent error")
        }
      }

      const testBloc = new TestBloc()
      testBloc.state$.subscribe({ complete: () => done() })
      testBloc.add(new TestEvent())
      testBloc.close()
    })

    it("should be invoked when an error is thrown inside an event callback", (done) => {
      class TestState extends BlocState<null> {}
      class TestEvent extends BlocEvent {}

      class TestBloc extends Bloc<TestEvent, TestState> {
        constructor() {
          super(new TestState(null))
          this.on(TestEvent, (event, emit) => {
            throw new Error("eventcallback error")
          })
        }

        protected override onError(error: Error): void {
          expect(error.message).toBe("eventcallback error")
          bloc.close()
          done()
        }
      }

      const testBloc = new TestBloc()
      testBloc.add(new TestEvent())
    })

    it("should be invoked when an error is thrown from onTransition", (done) => {
      class TestState extends BlocState<null> {}
      class TestEvent extends BlocEvent {}

      class TestBloc extends Bloc<TestEvent, TestState> {
        constructor() {
          super(new TestState(null))
          this.on(TestEvent, (event, emit) => {
            emit(this.state.loading())
          })
        }

        protected override onTransition(
          transition: Transition<TestEvent, TestState>,
        ): void {
          throw new Error("ontransition error")
        }

        protected override onError(error: Error): void {
          expect(error.message).toBe("ontransition error")
          bloc.close()
          done()
        }
      }

      const testBloc = new TestBloc()
      testBloc.add(new TestEvent())
    })
  })

  describe("isBlocInstance", () => {
    it("should return true if provided an instance of a bloc", () => {
      expect(isBlocInstance(bloc)).toBe(true)
      const cubit = new CounterCubit()
      expect(isBlocInstance(cubit)).toBe(false)
    })
  })
})
