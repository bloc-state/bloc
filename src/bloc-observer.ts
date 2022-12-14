import { Bloc, BlocBase, Transition } from "./"
import { Change } from "./"

export class BlocObserver {
  onCreate(bloc: BlocBase<any>): void {
    return
  }

  onEvent(bloc: Bloc<any, any>, event: any): void {
    return
  }

  onTransition(bloc: Bloc<any, any>, transition: Transition<any, any>): void {
    return
  }

  onError(bloc: BlocBase<any>, error: any): void {
    return
  }

  onChange(bloc: BlocBase<any>, change: Change<any>) {
    return
  }

  onClose(bloc: BlocBase<any>): void {
    return
  }
}
