import AutomationDAG from "../components/AutomationDAG";
import AutomationEditor from "../components/AutomationEditor";
import sample from "../sample/auto_01.yaml";

export function Home() {
  return (
    <div id="page--home" className="page">
        <AutomationDAG
          nodes={[
            {text: '1', loc:[-10,-50]},
            {text: '2', loc:[0,50]},
            {text: '3', loc:[-10,200]},
          ]}
          edges={[
            {
              from: 0, to: 1,
              direction: '1->2',
            },
            {
              from: 0, to: 2,
              direction: '1->2',
            },
        ]}
        />
      {/* <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100vw"
        }}
      >
        <AutomationEditor automation={sample}/>
      </div> */}
    </div>
  );
}
