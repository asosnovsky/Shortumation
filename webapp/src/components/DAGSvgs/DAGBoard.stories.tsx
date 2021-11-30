import React from "react";
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { DAGBoard, DAGElement, DAGNodeElm } from "./DAGBoard";
import { NODE_HEIGHT, NODE_WIDTH, ADD_HEIGHT, ADD_WIDTH, DISTANCE_FACTOR } from './constants';


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
      distanceFactor: DISTANCE_FACTOR,
      edgeChildColor: 'blue',
      edgeNextColor: 'white',
    },
  }
} as ComponentMeta<typeof DAGBoard>;


const nodeFromPoint = ([x, y, add = true]: any): DAGNodeElm => ({
  type: 'node',
  key: `${x},${y}`,
  loc: [x, y],
  onRemove() { },
  onAdd: add ? () => { } : undefined,
  node: {
    $smType: 'action',
    alias: `${x},${y}`,
    action: 'template',
    action_data: {
      value_template: ""
    }
  }
})

export const Simple: ComponentStory<typeof DAGBoard> = args => <DAGBoard {...args} />
Simple.args = {
  ...Simple.args,
  elements: [
    [0, 0, false],
    [1, 0, false],
    [2, 1, false],
  ].map<DAGElement>(nodeFromPoint).concat([
    {
      type: 'edge',
      key: 'e1',
      p1: [0, 0],
      p2: [1, 0],
      direction: '1->2'
    },
  ])
}


export const Complex: ComponentStory<typeof DAGBoard> = args => <DAGBoard {...args} />
Complex.args = {
  ...Complex.args,
  elements: [
    [0, 0, false],
    [1, 0, false],
    [2, 1, false],
    [4, 1],
    [3, 2],
    [2, 3],
    [5, 0, false],
    [6, 0],
    [0, 6],
  ].map<DAGElement>(nodeFromPoint).concat([
    {
      type: 'edge',
      key: 'e1',
      p1: [0, 0],
      p2: [1, 0],
      direction: '1->2'
    },
    {
      type: 'edge',
      key: 'e2',
      p1: [2, 1],
      p2: [4, 1],
      direction: '1->2',
    },
    {
      type: 'edge',
      key: 'e3',
      p1: [1, 0],
      p2: [2, 1],
      direction: '1->2',
      toChild: true,
    },
    {
      type: 'edge',
      key: 'e4',
      p1: [2, 1],
      p2: [3, 2],
      direction: '1->2',
      toChild: true,
    },
    {
      type: 'edge',
      key: 'e5',
      p1: [1, 0],
      p2: [2, 3],
      direction: '1->2',
      toChild: true,
    },
    {
      type: 'edge',
      key: 'e6',
      p1: [1, 0],
      p2: [5, 0],
      direction: '1->2'
    },
  ])
}


