import { AutomationManagerAuto } from "../types";

export const filterAutomations = (
  autos: AutomationManagerAuto[],
  searchText: string
): AutomationManagerAuto[] =>
  autos.filter((a) => {
    if (searchText.length > 0) {
      if (
        !(
          (a.description ?? "").toLocaleLowerCase().includes(searchText) ||
          (a.title ?? "").toLocaleLowerCase().includes(searchText)
        )
      ) {
        return false;
      }
    }
    return true;
  });
