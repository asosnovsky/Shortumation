import { AutomationData } from "~/automations/types";
import { AutomationTrigger } from "~/automations/types/triggers";
import { getDescriptionFromAutomationNode } from "~/automations/utils";
import useWindowSize from "~/utils/useWindowSize";
import AutoInfoBox from "./AutoInfoBox";
import { NODE_HEIGHT, NODE_WIDTH } from "./constants";
import DAGEdge from "./DAGEdge";
import DAGNode from "./DAGNode";
import { SequenceNodes } from "./SequenceNodes";
import { useEditorStyles } from "./styles";
import { Point } from "./types";
import { AutomationSequenceNode } from '../../automations/types/index';

interface Props {
  automation: AutomationData;
  onUpdate: (auto: AutomationData) => void;
}
export default function AutomationEditor({
  automation,
  onUpdate,
}: Props) {

  // state
  const { ratioWbh } = useWindowSize();
  const { classes, theme } = useEditorStyles({});

  // alias
  const nHDF = 1.5 // node horizontal distance factor (aspect ratio)
  const graphHeight = 300;
  const graphWidth = Math.round(graphHeight * ratioWbh);
  const pointTrigToCond: Point = [NODE_WIDTH * nHDF, NODE_HEIGHT / 2]
  const updateSequence = (i: number, node: AutomationSequenceNode | null) => {
    const update = (sequence: AutomationSequenceNode[]) => onUpdate({
      ...automation,
      sequence,
    })
    if (node === null) {
      update([
        ...automation.sequence.slice(0, i),
        ...automation.sequence.slice(i + 1),
      ])
    } else {
      update([
        ...automation.sequence.slice(0, i),
        node,
        ...automation.sequence.slice(i + 1),
      ])
    }
  };

  // render funcs
  const renderTrigger = (trigger: AutomationTrigger, i: number) => {
    const nodeLoc: Point = [0, i * NODE_HEIGHT];
    return <>
      <DAGNode key={`node.${i}`}
        loc={nodeLoc}
        text={getDescriptionFromAutomationNode(trigger)}
        color="red"
        onXClick={() => {
          onUpdate({
            ...automation,
            trigger: [
              ...automation.trigger.slice(0, i),
              ...automation.trigger.slice(i + 1),
            ]
          })
        }}
      />
      <DAGEdge
        key={`edge.${i}`}
        p1={[NODE_WIDTH, nodeLoc[1] + 0.5 * NODE_HEIGHT]}
        p2={pointTrigToCond}
        className={classes.dagEdge}
        direction="1->2"
      />
    </>
  }

  // render
  return <div className={classes.root} style={{
    flexDirection: ratioWbh >= 0.75 ? 'row' : 'column'
  }}>
    <AutoInfoBox
      className={classes.infoBox}
      metadata={automation.metadata}
      onUpdate={metadata => onUpdate({ ...automation, metadata })}
    />
    <div className={classes.dag}>
      <svg
        className={classes.svg}
        viewBox={[0, 0, graphWidth, graphHeight].join(" ")}
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <marker id="arrow" viewBox="0 0 10 10" refX="10" refY="5"
            markerWidth="6" markerHeight="6"
            orient="auto-start-reverse">
            <path d="M 0 0 L 10 5 L 0 10 z" fill={theme.secondaryAccent} />
          </marker>
        </defs>
        <g className="triggers">
          {automation.trigger.map(renderTrigger)}
        </g>
        <SequenceNodes
          styles={{ classes, theme }}
          sequence={automation.sequence}
          onUpdate={updateSequence}
          nHDF={nHDF}
          nodeHeight={NODE_HEIGHT}
          nodeWidth={NODE_WIDTH}
          triggerPoint={pointTrigToCond}
        />
        <circle className={classes.circle} cx={pointTrigToCond[0]} cy={pointTrigToCond[1]} r={2} />
        <g className="actions">
        </g>
      </svg>
    </div>
  </div>
}
