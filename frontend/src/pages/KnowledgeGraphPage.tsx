import { useState } from 'react';

interface GraphNode {
  id: string;
  label: string;
  cx: number;
  cy: number;
  r: number;
  color: string;
  category: string;
  connectedCount: number;
  docsCount: number;
  description: string;
}

const initialNodes: GraphNode[] = [
  {
    id: 'center',
    label: 'Machine Learning',
    cx: 260,
    cy: 200,
    r: 44,
    color: '#000000',
    category: 'Artificial Intelligence',
    connectedCount: 12,
    docsCount: 28,
    description:
      'Core discipline focused on algorithms that learn patterns from training data to make automated predictions.',
  },
  {
    id: 'neural',
    label: 'Neural Networks',
    cx: 140,
    cy: 100,
    r: 28,
    color: '#10B981',
    category: 'Deep Learning',
    connectedCount: 8,
    docsCount: 14,
    description:
      'Interconnected layers of synthetic artificial neurons that model non-linear high-dimensional features.',
  },
  {
    id: 'training',
    label: 'Model Training',
    cx: 260,
    cy: 70,
    r: 26,
    color: '#10B981',
    category: 'Optimization',
    connectedCount: 6,
    docsCount: 11,
    description:
      'Iterative gradient descent and backpropagation optimization over batched tensor parameters.',
  },
  {
    id: 'deep',
    label: 'Deep Learning',
    cx: 390,
    cy: 110,
    r: 28,
    color: '#10B981',
    category: 'Representation Learning',
    connectedCount: 10,
    docsCount: 19,
    description:
      'Multi-layered architectures including CNNs, RNNs, and Transformers for hierarchical feature extraction.',
  },
  {
    id: 'unsupervised',
    label: 'Unsupervised Learning',
    cx: 410,
    cy: 220,
    r: 30,
    color: '#10B981',
    category: 'Pattern Discovery',
    connectedCount: 7,
    docsCount: 12,
    description:
      'Clustering, dimensionality reduction, and autoencoders operating on unlabelled vector embeddings.',
  },
  {
    id: 'rl',
    label: 'Reinforcement Learning',
    cx: 360,
    cy: 310,
    r: 30,
    color: '#10B981',
    category: 'Decision Processes',
    connectedCount: 5,
    docsCount: 9,
    description:
      'Markov decision processes with policy gradients and Q-learning driven by reward maximization.',
  },
  {
    id: 'algorithms',
    label: 'Algorithms',
    cx: 260,
    cy: 340,
    r: 26,
    color: '#10B981',
    category: 'Core Logic',
    connectedCount: 15,
    docsCount: 22,
    description:
      'Decision trees, SVMs, random forests, and boosting algorithms for structured tabular analysis.',
  },
  {
    id: 'feature',
    label: 'Feature Engineering',
    cx: 150,
    cy: 310,
    r: 28,
    color: '#10B981',
    category: 'Data Preprocessing',
    connectedCount: 6,
    docsCount: 16,
    description:
      'Transforming raw attributes into normalized, one-hot encoded, and polynomial vector signals.',
  },
  {
    id: 'classification',
    label: 'Classification',
    cx: 110,
    cy: 200,
    r: 28,
    color: '#10B981',
    category: 'Supervised Learning',
    connectedCount: 9,
    docsCount: 20,
    description:
      'Assigning input instances to discrete qualitative categories and probability distributions.',
  },
];

const KnowledgeGraphPage = () => {
  const [selectedNode, setSelectedNode] = useState<GraphNode>(initialNodes[0]);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const centerNode = initialNodes[0];
  const outerNodes = initialNodes.slice(1);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Knowledge Graph
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Visualize connections between concepts.
        </p>
      </div>

      {/* Main Grid: Visual Graph Canvas + Details Sidebar */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left / Main SVG Graph Canvas Card (2 spans) */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between min-h-[480px]">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-base">🕸️</span>
              <h3 className="text-sm font-bold text-slate-900">Concept Map</h3>
            </div>
            <span className="text-xs font-semibold text-slate-400">
              Click any node to inspect details
            </span>
          </div>

          {/* Interactive Graph SVG matching reference design */}
          <div className="relative flex-1 flex items-center justify-center py-4">
            <svg
              className="w-full h-[380px] select-none"
              viewBox="0 0 520 400"
              fill="none"
            >
              {/* Radial Connection Lines */}
              {outerNodes.map((node) => {
                const isConnectedToSelected =
                  selectedNode.id === node.id || selectedNode.id === 'center';
                return (
                  <line
                    key={`line-${node.id}`}
                    x1={centerNode.cx}
                    y1={centerNode.cy}
                    x2={node.cx}
                    y2={node.cy}
                    stroke={isConnectedToSelected ? '#10B981' : '#E2E8F0'}
                    strokeWidth={isConnectedToSelected ? '2' : '1.5'}
                    strokeDasharray={selectedNode.id === node.id ? 'none' : '4 3'}
                    className="transition-colors duration-300"
                  />
                );
              })}

              {/* Central Purple Node (Machine Learning) */}
              <g
                className="cursor-pointer transition-transform duration-300"
                onClick={() => setSelectedNode(centerNode)}
                onMouseEnter={() => setHoveredNode(centerNode.id)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                {/* Glow ring */}
                <circle
                  cx={centerNode.cx}
                  cy={centerNode.cy}
                  r={centerNode.r + 6}
                  fill="#000000"
                  fillOpacity="0.15"
                />
                <circle
                  cx={centerNode.cx}
                  cy={centerNode.cy}
                  r={centerNode.r}
                  fill="#000000"
                  className="shadow-lg"
                />
                <text
                  x={centerNode.cx}
                  y={centerNode.cy - 4}
                  fill="#FFFFFF"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Machine
                </text>
                <text
                  x={centerNode.cx}
                  y={centerNode.cy + 10}
                  fill="#FFFFFF"
                  fontSize="11"
                  fontWeight="bold"
                  textAnchor="middle"
                >
                  Learning
                </text>
              </g>

              {/* Connected Outer Green Nodes */}
              {outerNodes.map((node) => {
                const isSelected = selectedNode.id === node.id;
                const isHovered = hoveredNode === node.id;

                return (
                  <g
                    key={node.id}
                    className="cursor-pointer transition-all duration-300 group"
                    onClick={() => setSelectedNode(node)}
                    onMouseEnter={() => setHoveredNode(node.id)}
                    onMouseLeave={() => setHoveredNode(null)}
                  >
                    {/* Node Highlight Circle */}
                    {(isSelected || isHovered) && (
                      <circle
                        cx={node.cx}
                        cy={node.cy}
                        r={node.r + 5}
                        fill="#10B981"
                        fillOpacity="0.2"
                      />
                    )}

                    <circle
                      cx={node.cx}
                      cy={node.cy}
                      r={node.r}
                      fill={isSelected ? '#10B981' : '#E6FBF3'}
                      stroke="#10B981"
                      strokeWidth="2"
                      className="transition-colors"
                    />

                    {/* Node Label Text */}
                    <text
                      x={node.cx}
                      y={node.cy + 3}
                      fill={isSelected ? '#FFFFFF' : '#065F46'}
                      fontSize="8"
                      fontWeight="bold"
                      textAnchor="middle"
                    >
                      {node.label.length > 14
                        ? node.label.slice(0, 12) + '..'
                        : node.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-xs text-slate-400">
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#000000]" /> Central Theme
            </span>
            <span className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-[#10B981]" /> Sub-Concepts
            </span>
          </div>
        </div>

        {/* Right Details Card matching reference */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 border-b border-slate-100 pb-3">
              Details
            </h3>

            <div className="mt-5 space-y-4">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Concept Name
                </p>
                <h4 className="mt-1 text-xl font-extrabold text-slate-900">
                  {selectedNode.label}
                </h4>
              </div>

              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Category
                </p>
                <p className="mt-0.5 text-sm font-semibold text-[#000000]">
                  {selectedNode.category}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5 text-center">
                  <p className="text-xs text-slate-400 font-medium">
                    Connected Concepts
                  </p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">
                    {selectedNode.connectedCount}
                  </p>
                </div>
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3.5 text-center">
                  <p className="text-xs text-slate-400 font-medium">Documents</p>
                  <p className="text-2xl font-extrabold text-slate-900 mt-1">
                    {selectedNode.docsCount}
                  </p>
                </div>
              </div>

              <div className="pt-2">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                  Summary
                </p>
                <p className="text-xs leading-relaxed text-slate-600">
                  {selectedNode.description}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <button
              type="button"
              className="w-full rounded-xl bg-[#000000] py-3 text-center text-sm font-semibold text-white shadow-[0_4px_16px_rgba(0,0,0,0.35)] transition hover:bg-[#000000] active:scale-[0.98]"
            >
              Explore More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default KnowledgeGraphPage;
