import React, { useState } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import NewNodeModal from "./components/AutomationEditor/NewNodeModal";
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
              {/* <Home /> */}
              <NewNodeModal
                node_type="action"
                onClose={()=>{}}
                onCreate={()=>{}}
              />
            </Route>
          </Switch>
        </div>
        <Tooltip {...tooltipState}/>
      </TooltipContext.Provider>
    </Router>
  );
}
