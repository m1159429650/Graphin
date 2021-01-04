import * as React from 'react';
import { GraphinContext } from '@antv/graphin';
import { ContextMenu } from '@antv/graphin-components';
import { manageExpandCollapseArray, getMixedGraph, icons } from './utils';

const { Menu } = ContextMenu;
const AntColor = '#3D2D70';

interface CustomMenuProps {
  updateState: any;
  aggregatedNodeMap: {};
  nodeMap: {};
  state: any;
}
let collapseArray = [];
let expandArray = [];

const CustomMenu: React.FunctionComponent<CustomMenuProps> = props => {
  const { updateState, state, nodeMap, aggregatedNodeMap } = props;
  const graphin = React.useContext(GraphinContext);
  const { clusteredData, source } = state;

  const { contextmenu, graph } = graphin;
  const model = contextmenu.node.item.getModel();

  const isCluster = Boolean(model.nodes);
  const handleClose = () => {
    contextmenu.node.handleClose();
  };
  /** 展开 Cluster */
  const handleExpandCluster = () => {
    const { length } = graph.getNodes();

    const newArray = manageExpandCollapseArray(length, model, collapseArray, expandArray);

    // eslint-disable-next-line prefer-destructuring
    expandArray = newArray.expandArray;
    // eslint-disable-next-line prefer-destructuring
    collapseArray = newArray.collapseArray;
    const mixedGraphData = getMixedGraph(clusteredData, source, nodeMap, aggregatedNodeMap, expandArray, collapseArray);

    mixedGraphData.nodes.forEach(node => {
      if (!node.type) {
        node.type = 'graphin-circle';
        node.style = {
          fill: AntColor,
          strokeWidth: 2,
          stroke: AntColor,
          size: [20, 20],
          label: {
            value: `${node.id}`,
          },
          icon: {
            fontFamily: 'graphin',
            type: 'font',
            value: icons.user,
            fill: '#fff',
            size: 15,
          },
          badges: [],
        };
      }
    });
    updateState({
      ...state,
      data: {
        ...mixedGraphData,
      },
    });

    handleClose();
  };
  const handleCollapse = () => {
    const aggregatedNode = aggregatedNodeMap[model.clusterId];

    collapseArray.push(aggregatedNode);
    for (let i = 0; i < expandArray.length; i++) {
      if (expandArray[i].id === model.clusterId) {
        expandArray.splice(i, 1);
        break;
      }
    }
    const mixedGraphData = getMixedGraph(clusteredData, source, nodeMap, aggregatedNodeMap, expandArray, collapseArray);
    updateState({
      ...state,
      data: {
        ...mixedGraphData,
      },
    });
    handleClose();
  };
  if (isCluster) {
    return (
      <Menu bindType="node">
        <Menu.Item onClick={handleExpandCluster}>Expand the Cluster</Menu.Item>
        <Menu.Item>Hide the Node</Menu.Item>
      </Menu>
    );
  }
  return (
    <Menu bindType="node">
      <Menu.Item onClick={handleCollapse}>Collapse the Cluster</Menu.Item>
      <Menu.Item>Find 1-degre Neighbors</Menu.Item>
      <Menu.Item>Find 2-degre Neighbors</Menu.Item>
      <Menu.Item>Find 3-degre Neighbors</Menu.Item>
      <Menu.Item>Hide the Node</Menu.Item>
    </Menu>
  );
};

export default CustomMenu;
