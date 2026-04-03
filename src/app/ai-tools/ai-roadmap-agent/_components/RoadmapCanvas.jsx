"use client"
import { Background, Controls, ReactFlow, useNodesState, useEdgesState } from '@xyflow/react'
import React, { useEffect } from 'react'
import dagre from 'dagre'
import TurboNode from './TurboNode'
import '@xyflow/react/dist/style.css'

const nodeTypes = {
  default: TurboNode,
};

// --- Auto-Layout Logic using Dagre ---
const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 260; // TurboNode ki width (w-64 is approx 256px)
const nodeHeight = 180; // Estimated height

const getLayoutedElements = (nodes, edges) => {
  dagreGraph.setGraph({ rankdir: 'TB', nodesep: 70, ranksep: 100 }); // TB = Top to Bottom

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  return nodes.map((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    return {
      ...node,
      position: {
        x: nodeWithPosition.x - nodeWidth / 2,
        y: nodeWithPosition.y - nodeHeight / 2,
      },
    };
  });
};

function RoadmapCanvas({ initialNodes = [], initialEdges = [] }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  useEffect(() => {
    if (initialNodes.length > 0) {
      const layouted = getLayoutedElements(initialNodes, initialEdges);
      setNodes(layouted);
      setEdges(initialEdges);
    }
  }, [initialNodes, initialEdges]);

  return (
    <div style={{ width: '100%', height: '100%' }} className="bg-slate-50 dark:bg-transparent">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitView
        minZoom={0.2}
        maxZoom={1.5}
        proOptions={{ hideAttribution: true }}
      >
        <Controls className='bg-white border-none text-black shadow-lg' />
        <Background variant="dots" gap={20} size={1} color="#94a3b8" opacity={0.2} />
      </ReactFlow>
    </div>
  )
}

export default RoadmapCanvas