import { NEBULAE } from "../../utils/atlasParticles";

interface AtlasBackgroundProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
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
              background: `radial-gradient(ellipse at center,${nebula.color} 0%,transparent 72%)`,
              filter: `blur(${nebula.blur}px)`,
            }}
          />
        ))}

        <div
          aria-hidden="true"
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 50% 48%, rgba(0,0,0,0.02) 0%, rgba(0,0,0,0.08) 44%, rgba(0,0,0,0.24) 100%)",
          }}
        />

        <div
          aria-hidden="true"
          className="absolute"
          style={{
            left: "50%",
            top: "48%",
            width: "34vw",
            height: "34vw",
            minWidth: 420,
            minHeight: 420,
            transform: "translate(-50%,-50%)",
            background:
              "radial-gradient(circle, rgba(3,3,7,0.3) 0%, rgba(3,3,7,0.16) 42%, transparent 72%)",
          }}
        />
      </div>

      <canvas ref={canvasRef} className="absolute inset-0" />
    </>
  );
}
