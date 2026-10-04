import { jungle } from "./themes/jungle";
import { CreatureArt } from "./themes/shared";

const CAST: { kind: string; left: number; bottom: number; height: number; flip?: boolean }[] = [
  { kind: "elephant", left: 8, bottom: 16, height: 44 },
  { kind: "monkey", left: 52, bottom: 22, height: 26, flip: true },
  { kind: "tiger", left: 60, bottom: 6, height: 30, flip: true },
  { kind: "toucan", left: 40, bottom: 8, height: 18 },
  { kind: "frog", left: 85, bottom: 4, height: 12, flip: true },
];

export function Thumbnail() {
  const { Background } = jungle;
  return (
    <div className="relative h-full w-full overflow-hidden">
      <Background className="absolute inset-0 h-full w-full" animated={false} />
      {CAST.map((a) => (
        <CreatureArt
          key={a.kind}
          spec={jungle.creatures[a.kind]}
          className="absolute w-auto"
          style={{
            left: `${a.left}%`,
            bottom: `${a.bottom}%`,
            height: `${a.height}%`,
            transform: a.flip ? "scaleX(-1)" : undefined,
          }}
        />
      ))}
    </div>
  );
}
