import { NEBULAE } from "../../utils/atlasParticles";

interface AtlasBackgroundProps {
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
}

export default function AtlasBackground({ canvasRef }: AtlasBackgroundProps) {
  return (
    <>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {NEBULAE.map((nebula, index) => (
          <div
            key={index}
            className="absolute"
            style={{
              left: `${nebula.cx}%`,
              top: `${nebula.cy}%`,
              width: `${nebula.w}%`,
              height: `${nebula.h}%`,
              transform: "translate(-50%,-50%)",
              background: `radial-gradient(ellipse at center,${nebula.color} 0%,transparent 70%)`,
              filter: `blur(${nebula.blur}px)`,
            }}
          />
        ))}
      </div>
      <canvas ref={canvasRef} className="absolute inset-0" />
    </>
  );
}
