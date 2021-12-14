import { BaseOptionManager } from "./BaseOptionManager";


export default class Generic extends BaseOptionManager<any> {
  defaultState = () => ({})
  isReady(state: any): boolean {
    return true;
  }
  renderOptionList(state: any): JSX.Element {
    return <div className="state-manager-options">
      <b>THIS IS NOT SUPPORTED YET!</b>
    </div>
  }
}
