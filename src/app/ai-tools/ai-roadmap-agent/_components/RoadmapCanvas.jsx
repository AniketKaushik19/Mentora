"use client"

import { Background, Controls, MiniMap, ReactFlow } from '@xyflow/react'
import React from 'react'
import TurboNode from './TurboNode'
import '@xyflow/react/dist/style.css'

// Utility to normalize node positions
const normalizeNodePositions = (nodes = [], spacingX = 1, spacingY = 1) => {
  if (!Array.isArray(nodes) || nodes.length === 0) return []

  const minX = Math.min(...nodes.map(n => n.position?.x ?? 0))
  const minY = Math.min(...nodes.map(n => n.position?.y ?? 0))

  return nodes.map(n => ({
    ...n,
    position: {
      x: (n.position?.x ?? 0 - minX) * spacingX + 50,
      y: (n.position?.y ?? 0 - minY) * spacingY + 50
    }
  }))
}

function RoadmapCanvas({ initialNodes, initialEdges }) {
  const nodeTypes = {
    default: TurboNode,
    input: TurboNode,
    output: TurboNode,
  }

  const rawNodes = initialNodes?.map(node => ({
    id: node.id,
    type: node.type,
    position: node.position,
    data: node.data,
  }))

  const nodes = normalizeNodePositions(rawNodes)

  const edges = initialEdges?.map(edge => ({
    id: edge.id,
    source: edge.source,
    target: edge.target,
  }))

  return (
    <div style={{ width: '100%', height: '100vh' }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        fitView
        proOptions={{ hideAttribution: true }}

      >
        <Controls className='text-black' />
        {/* <MiniMap /> */}
        <Background variant="dots" gap={12} size={1} />
      </ReactFlow>
    </div>
  )
}

export default RoadmapCanvas