import { OptionManager } from "./OptionManager";


export const Generic: OptionManager<any> = {
  defaultState: () => ({}),
  isReady: _ => true,
  renderOptionList: () => <>
    <b>THIS IS NOT SUPPORTED YET!</b>
  </>
}
