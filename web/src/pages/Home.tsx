import AutomationEditor from "../components/AutomationEditor";
import sample from "../sample/auto_01.yaml";

export function Home() {
  return (
    <div id="page--home" className="page">
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-around",
          alignItems: "center",
          width: "100vw"
        }}
      >
        <AutomationEditor automation={sample}/>
      </div>
    </div>
  );
}
