import { useId } from "react";
import type { ConstellationConnection } from "../../types/atlas";
import type { ResolvedConstellationNode } from "../constellation/constellationGeometry";

interface ConstellationConnectionsProps {
  nodes: ResolvedConstellationNode[];
  connections?: ConstellationConnection[];
  centerX: number;
  centerY: number;
  domainColor: string;
  showCenterConnections?: boolean;
  activeStarId?: string | null;
}

function connectionPath(
  from: ResolvedConstellationNode,
  to: ResolvedConstellationNode,
) {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const distance = Math.hypot(dx, dy);
  const bend = Math.min(22, distance * 0.08);
  const midpointX = (from.x + to.x) / 2 - (dy / Math.max(distance, 1)) * bend;
  const midpointY = (from.y + to.y) / 2 + (dx / Math.max(distance, 1)) * bend;

  return `M ${from.x} ${from.y} Q ${midpointX} ${midpointY} ${to.x} ${to.y}`;
}

export default function ConstellationConnections({
  nodes,
  connections = [],
  centerX,
  centerY,
  domainColor,
  showCenterConnections = true,
  activeStarId,
}: ConstellationConnectionsProps) {
  const idPrefix = useId().replace(/:/g, "");
  const nodeMap = new Map(nodes.map((node) => [node.star.id, node]));
  const resolvedConnections = connections.flatMap((connection, index) => {
    const from = nodeMap.get(connection.from);
    const to = nodeMap.get(connection.to);
    return from && to ? [{ connection, from, to, index }] : [];
  });

  return (
    <g fill="none" pointerEvents="none">
      {resolvedConnections.length > 0 && (
        <defs>
          {resolvedConnections.map(({ from, to, index }) => (
            <linearGradient
              key={`gradient-${index}`}
              id={`${idPrefix}-connection-${index}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0%" stopColor={from.nodeColor} stopOpacity="0.82" />
              <stop offset="50%" stopColor={domainColor} stopOpacity="0.5" />
              <stop offset="100%" stopColor={to.nodeColor} stopOpacity="0.82" />
            </linearGradient>
          ))}
        </defs>
      )}

      {showCenterConnections &&
        nodes.map(({ star, x, y, nodeColor }) => {
          const focused = activeStarId === star.id;
          const dimmed = Boolean(activeStarId) && !focused;
          return (
            <line
              key={`center-${star.id}`}
              x1={centerX}
              y1={centerY}
              x2={x}
              y2={y}
              stroke={nodeColor}
              strokeWidth={focused ? 1.15 : 0.55}
              strokeOpacity={dimmed ? 0.025 : focused ? 0.62 : 0.11}
              strokeDasharray="2 9"
              style={{
                transition:
                  "stroke-opacity 0.3s cubic-bezier(0.16,1,0.3,1), stroke-width 0.3s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          );
        })}

      {resolvedConnections.map(({ connection, from, to, index }) => {
        const primary = connection.strength === "primary";
        const focused =
          activeStarId === connection.from || activeStarId === connection.to;
        const dimmed = Boolean(activeStarId) && !focused;
        return (
          <path
            key={`${connection.from}-${connection.to}`}
            d={connectionPath(from, to)}
            stroke={`url(#${idPrefix}-connection-${index})`}
            strokeWidth={
              focused ? (primary ? 1.6 : 1.1) : primary ? 1 : 0.65
            }
            strokeOpacity={
              dimmed
                ? 0.035
                : focused
                  ? primary
                    ? 0.82
                    : 0.52
                  : primary
                    ? 0.34
                    : 0.18
            }
            strokeDasharray={primary ? undefined : "3 7"}
            style={{
              transition:
                "stroke-opacity 0.3s cubic-bezier(0.16,1,0.3,1), stroke-width 0.3s cubic-bezier(0.16,1,0.3,1)",
            }}
          />
        );
      })}
    </g>
  );
}
