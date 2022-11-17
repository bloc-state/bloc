import { Observable, tap } from "rxjs"
import { Cubit, Change } from "../src"
import { CounterCubit } from "./helpers/counter/counter.cubit"

describe("Cubit", () => {
  let cubit: CounterCubit
  let state$: Observable<number>

  beforeEach(() => {
    cubit = new CounterCubit()
    state$ = cubit.state$
  })

  it("should create a new Cubit instance", () => {
    expect(cubit).toBeInstanceOf(Cubit)
  })

  it("should close a cubit", (done) => {
    cubit.close()
    cubit.state$.subscribe({
      complete: () => done(),
    })
  })

  it("should return new state from actions", (done) => {
    const states: number[] = []
    state$.pipe(tap((state) => states.push(state))).subscribe({
      complete: () => {
        const [first, second] = states
        expect(states.length).toBe(2)
        expect(first).toBe(1)
        expect(second).toBe(2)
        done()
      },
    })
    cubit.increment()
    cubit.increment()
    cubit.close()
  })

  it("should handle async actions", (done) => {
    void (async () => {
      const states: number[] = []
      state$.pipe(tap((state) => states.push(state))).subscribe({
        complete: () => {
          const [first, second, third] = states
          expect(states.length).toBe(3)
          expect(first).toBe(1)
          expect(second).toBe(0)
          expect(third).toBe(1)
          done()
        },
      })
      await cubit.asyncIncrement()
      cubit.close()
    })()
  })

  describe("Cubit.onError", () => {
    let errors: Error[] = []

    class OnEmitError extends Error {
      override message = "emit error"
    }

    class OnChangeError extends Error {
      override message = "onchange error"
    }

    class ErrorTestBloc extends Cubit<number> {
      constructor() {
        super(0)
      }

      triggerError() {
        try {
          this.emit((state) => {
            throw new OnEmitError()
          })
        } catch (e) {}
      }

      triggerChange() {
        this.emit(1)
      }

      protected override onChange(change: Change<number>): void {
        throw new OnChangeError()
      }

      protected override onError(error: Error): void {
        errors.push(error)
        super.onError(error)
      }
    }

    let errorBloc: ErrorTestBloc

    beforeEach(() => {
      errorBloc = new ErrorTestBloc()
      errors = []
    })

    afterEach(() => {
      errorBloc.close()
    })

    it("should be invoked when an error is thrown from BlocBase.emit", () => {
      errorBloc.triggerError()
      const [a] = errors

      expect(a.message).toBe("emit error")
    })

    it("should be invoked when an error is thrown from BlocBase.onChange", () => {
      try {
        errorBloc.triggerChange()
      } catch (e) {}

      const [a] = errors

      expect(a.message).toBe("onchange error")
    })
  })

  it("should not emit values if the bloc is closed", (done) => {
    const states: number[] = []
    cubit.state$.subscribe({
      next: (state) => states.push(state),
    })

    cubit.emit(2)
    cubit.emit((previous) => previous + 1)

    cubit.close()

    cubit.emit(4)
    cubit.emit((previous) => previous + 1)

    const [a, b] = states

    expect(states.length).toBe(2)
    expect(a).toBe(2)
    expect(b).toBe(3)
    done()
  })
})
