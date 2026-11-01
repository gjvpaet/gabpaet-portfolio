import { Highlight } from "@/components/ink/highlight";
import { Tape } from "@/components/ink/tape";
import { profile } from "@/content/profile";

// Notebook card: About (notebook spec 3). The bio with its key phrase under
// the highlighter, the motto taped on as a sticky, and where Gabriel is.
export function AboutCard() {
  const [before, after] = profile.bio.split(profile.bioMark);
  return (
    <div className="grid gap-6">
      <p>
        {before}
        <Highlight>{profile.bioMark}</Highlight>
        {after}
      </p>
      <div className="relative mx-2 rotate-[-2deg] rounded-paper bg-note px-5 pt-6 pb-4 text-on-note shadow-lift print:rotate-0">
        <Tape className="-top-3 left-1/2 h-6 w-16 -ml-8" style={{ rotate: "-4deg" }} />
        <p className="type-hand-lg">{profile.motto}</p>
        <p className="type-hand mt-2">my motto, for what it&apos;s worth</p>
      </div>
      <p className="type-meta text-ink-soft">
        {profile.location}. {profile.status}.
      </p>
    </div>
  );
}
