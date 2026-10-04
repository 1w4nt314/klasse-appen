import { AnimalArt, type AnimalKind } from "./animals";
import { JungleBackground } from "./JungleBackground";

const CAST: { kind: AnimalKind; left: number; bottom: number; height: number; flip?: boolean }[] = [
  { kind: "elephant", left: 8, bottom: 16, height: 44 },
  { kind: "monkey", left: 52, bottom: 22, height: 26, flip: true },
  { kind: "tiger", left: 60, bottom: 6, height: 30, flip: true },
  { kind: "toucan", left: 40, bottom: 8, height: 18 },
  { kind: "frog", left: 85, bottom: 4, height: 12, flip: true },
];

export function Thumbnail() {
  return (
    <div className="relative h-full w-full overflow-hidden">
      <JungleBackground className="absolute inset-0 h-full w-full" animated={false} />
      {CAST.map((a) => (
        <AnimalArt
          key={a.kind}
          kind={a.kind}
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
