import type { MouseEvent } from "react";
import type { AtlasModuleFamily } from "../../content/types";
import { resolveStellarColor } from "../constellation/stellarPalette";

interface ApplicationKitModuleArcProps {
  family: AtlasModuleFamily;
  x: number;
  y: number;
  angle: number;
  orbitRadius: number;
  color: string;
}

function wrapModuleTitle(title: string, maxCharacters = 18) {
  const words = title.split(" ");
  const lines: string[] = [];

  words.forEach((word) => {
    const current = lines[lines.length - 1];
    if (!current || current.length + word.length + 1 > maxCharacters) {
      lines.push(word);
    } else {
      lines[lines.length - 1] = `${current} ${word}`;
    }
  });

  return lines.slice(0, 3);
}

export default function ApplicationKitModuleArc({
  family,
  x,
  y,
  angle,
  orbitRadius,
  color,
}: ApplicationKitModuleArcProps) {
  return (
    <g
      onClick={(event: MouseEvent<SVGGElement>) => event.stopPropagation()}
      style={{ cursor: "default" }}
    >
      {family.modules.map((module, moduleIndex) => {
        const moduleCount = family.modules.length;
        const arcSweep = moduleCount > 3 ? Math.PI * 0.82 : Math.PI * 0.68;
        const moduleAngle =
          angle +
          (moduleCount === 1
            ? 0
            : -arcSweep / 2 + (moduleIndex / (moduleCount - 1)) * arcSweep);
        const arcRadius = Math.min(94, orbitRadius * 0.4);
        const moduleX = x + Math.cos(moduleAngle) * arcRadius;
        const moduleY = y + Math.sin(moduleAngle) * arcRadius;
        const moduleColor = resolveStellarColor(module.stellarType, color);
        const labelX = moduleX + Math.cos(moduleAngle) * 16;
        const labelY = moduleY + Math.sin(moduleAngle) * 16;
        const labelAnchor =
          Math.cos(moduleAngle) > 0.25
            ? "start"
            : Math.cos(moduleAngle) < -0.25
              ? "end"
              : "middle";
        const labelLines = wrapModuleTitle(module.title);

        return (
          <g key={module.id}>
            <path
              d={`M ${x + Math.cos(moduleAngle) * 25} ${y + Math.sin(moduleAngle) * 25} L ${moduleX} ${moduleY}`}
              fill="none"
              stroke={moduleColor}
              strokeWidth="0.55"
              strokeOpacity="0.28"
              strokeDasharray="2 5"
              pointerEvents="none"
            />
            <circle
              cx={moduleX}
              cy={moduleY}
              r="13"
              fill={moduleColor}
              opacity="0.055"
              filter="url(#fo-glow-sm)"
            />
            <circle
              cx={moduleX}
              cy={moduleY}
              r="7.5"
              fill="none"
              stroke={moduleColor}
              strokeWidth="0.65"
              strokeOpacity="0.42"
              strokeDasharray="2 4"
            />
            <circle
              cx={moduleX}
              cy={moduleY}
              r="3.2"
              fill={moduleColor}
              opacity="0.94"
              filter="url(#fo-glow-sm)"
            />
            <circle cx={moduleX} cy={moduleY} r="14" fill="transparent" />
            <text
              x={labelX}
              y={labelY - (labelLines.length - 1) * 4.5}
              textAnchor={labelAnchor}
              fontSize="8.5"
              fontFamily="'DM Mono',monospace"
              letterSpacing="0.55"
              fill={moduleColor}
              opacity="0.86"
              pointerEvents="none"
            >
              {labelLines.map((line, lineIndex) => (
                <tspan key={`${module.id}-${lineIndex}`} x={labelX} dy={lineIndex === 0 ? 0 : 10}>
                  {line}
                </tspan>
              ))}
            </text>
          </g>
        );
      })}
    </g>
  );
}
