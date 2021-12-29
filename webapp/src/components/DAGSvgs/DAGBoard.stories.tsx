import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { DAGBoard, DAGElement, DAGNodeElm } from "./DAGBoard";
import { NODE_HEIGHT, NODE_WIDTH, ADD_HEIGHT, ADD_WIDTH, DISTANCE_FACTOR, CIRCLE_SIZE } from './constants';
import { AutomationAction } from 'types/automations/actions';
import { arrayToIter } from "utils/iter";


export default {
  title: 'DAGSvgs/DAGBoard',
  component: DAGBoard,
  parameters: { actions: { argTypesRegex: '^on.*' } },
  args: {
    zoomLevel: 1,
    settings: {
      nodeHeight: NODE_HEIGHT,
      nodeWidth: NODE_WIDTH,
      addHeight: ADD_HEIGHT,
      addWidth: ADD_WIDTH,
      circleSize: CIRCLE_SIZE,
      distanceFactor: DISTANCE_FACTOR,
      edgeChildColor: 'blue',
      edgeNextColor: 'white',
    },
  }
} as ComponentMeta<typeof DAGBoard>;


const nodeFromPoint = ([x, y, add = true]: any): DAGNodeElm => ({
  type: 'node',
  loc: [x, y],
  onRemove() { },
  onAdd: add ? () => { } : undefined,
  node: ({
    alias: `${x},${y}`,
    "$smType": "action",
    "action": "wait",
    "action_data": {
      "wait_template": "",
    }
  } as AutomationAction)
});

function* makeDummyData(pts: Array<any>, extras: DAGElement[]): Generator<DAGElement> {
  for (const p of pts) {
    yield nodeFromPoint(p);
  };
  for (const e of extras) {
    yield e;
  }
}


export const Simple: ComponentStory<typeof DAGBoard> = args => <DAGBoard {...args} />
Simple.args = {
  ...Simple.args,
  elements: makeDummyData(
    [
      [0, 0, false],
      [1, 0, false],
      [2, 1, false],
    ],
    [
      {
        type: 'edge',
        p1: [0, 0],
        p2: [1, 0],
        direction: '1->2'
      },
      {
        type: 'edge',
        p1: [2, 1],
        p2: [2, 3],
        direction: '1->2'
      },
      {
        type: 'circle',
        icon: 'blank',
        loc: [2, 3]
      },
      {
        type: 'edge',
        p1: [2, 1],
        p2: [2, 2],
        direction: '1->2'
      },
      {
        type: 'circle',
        loc: [2, 2],
        icon: 'color',
        color: 'red',
      }
    ])
}


export const Complex: ComponentStory<typeof DAGBoard> = args => <DAGBoard {...args} />
Complex.args = {
  ...Complex.args,
  elements: makeDummyData(
    [
      [0, 0, false],
      [1, 0, false],
      [2, 1, false],
      [4, 1],
      [3, 2],
      [2, 3],
      [5, 0, false],
      [6, 0],
      [0, 6],
    ],
    [
      {
        type: 'edge',
        p1: [0, 0],
        p2: [1, 0],
        direction: '1->2'
      },
      {
        type: 'edge',
        p1: [2, 1],
        p2: [4, 1],
        direction: '1->2',
      },
      {
        type: 'edge',
        p1: [1, 0],
        p2: [2, 1],
        direction: '1->2',
      },
      {
        type: 'edge',
        p1: [2, 1],
        p2: [3, 2],
        direction: '1->2',
      },
      {
        type: 'edge',
        p1: [1, 0],
        p2: [2, 3],
        direction: '1->2',
      },
      {
        type: 'edge',
        p1: [1, 0],
        p2: [5, 0],
        direction: '1->2'
      },
    ]
  )
}


