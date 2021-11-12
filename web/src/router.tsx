import { useState } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import Tooltip from "./tooltip";
import { TooltipContext, TooltipState } from "./tooltip/context";

export default function App() {
  const [tooltipState, updateState] = useState<TooltipState>({
      updateState(s) { updateState(s) },
      searchResults: [
        "Option #1"
      ],
  });
  return (
    <Router>
      <TooltipContext.Provider value={tooltipState}>
        <div>
          <Switch>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
        <Tooltip {...tooltipState}/>
      </TooltipContext.Provider>
    </Router>
  );
}
