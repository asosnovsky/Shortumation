import { OptionManager } from "./OptionManager";


export const Generic: OptionManager<any> = {
  defaultState: () => ({}),
  isReady: _ => true,
  renderOptionList: () => <div className="state-manager-options">
    <b>THIS IS NOT SUPPORTED YET!</b>
  </div>
}
