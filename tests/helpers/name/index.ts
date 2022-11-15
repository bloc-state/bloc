import { Cubit } from "../../../src"

export class NameBloc extends Cubit<string> {
  constructor() {
    super("Bob")
  }
}

export class UpperCaseBloc extends Cubit<string> {
  constructor() {
    super("")
  }

  toUpperCase(stringToUppercase: string) {
    this.emit(stringToUppercase.toUpperCase())
  }
}
