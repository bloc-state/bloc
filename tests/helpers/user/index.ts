import { BlocState } from "@bloc-state/state"
import { Bloc } from "../../../src/bloc"
import { BlocEvent } from "../../../src/event"

export interface User {
  name: {
    first: string
    last: string
  }
  age: number
}

export class UserState extends BlocState<User> {}

export class UserEvent extends BlocEvent {}

export class UserNameChangedEvent extends UserEvent {
  constructor(public name: { first: string; last: string }) {
    super()
  }
}

export class UserAgeChangedEvent extends UserEvent {
  constructor(public age: number) {
    super()
  }
}

export class UserBloc extends Bloc<UserEvent, UserState> {
  constructor() {
    super(
      new UserState({
        name: {
          first: "",
          last: "",
        },
        age: 0,
      }),
    )

    this.on(UserNameChangedEvent, (event, emit) => {
      emit(
        this.state.ready((data) => {
          data.name = event.name
        }),
      )
    })

    this.on(UserAgeChangedEvent, (event, emit) => {
      emit(
        this.state.ready((data) => {
          data.age = event.age
        }),
      )
    })
  }
}
