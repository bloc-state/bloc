import { Change } from "../src/change"
import { CounterState } from "./helpers/counter/counter.state"

describe("change", () => {
  it("should create a change object", () => {
    const current = new CounterState(0)
    const next = current.ready(1)
    const change = new Change(current, next)

    expect(change.currentState).toBe(current)
    expect(change.nextState).toBe(next)
  })
})
