import { Cubit } from "../../../src/cubit"
import { delay } from "./delay"

export class CounterCubit extends Cubit<number> {
  constructor() {
    super(0)
  }

  increment() {
    this.emit(this.state + 1)
  }

  async asyncIncrement() {
    this.emit((state) => state + 1)
    this.emit(this.state - 1)
    await delay(3000)
    this.emit(this.state + 1)
  }
}
