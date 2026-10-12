import { Card } from "@/components/card";
import { ChipList } from "@/components/chip";
import { Reveal } from "@/components/reveal";
import { SectionHeading } from "@/components/section-heading";
import { profile } from "@/content/profile";

// Spec 7.4: bio column (5 cols) + skills panel (7 cols).
export function About() {
  return (
    <section id="about" aria-labelledby="about-h" className="py-16 md:py-24">
      <div className="grid items-start gap-10 md:grid-cols-12 md:gap-10">
        <Reveal className="grid gap-6 md:col-span-5">
          <SectionHeading id="about-h">About</SectionHeading>
          <p className="max-w-[65ch]">{profile.bio}</p>
          <p className="type-h3">
            <mark className="bg-yellow px-1.5 text-on-accent [box-decoration-break:clone]">{profile.motto}</mark>
          </p>
        </Reveal>
        <Reveal index={1} className="md:col-span-7">
          <Card className="grid gap-6">
            {profile.skills.map((group) => (
              <div key={group.label} className="grid gap-3">
                <h3 className="font-bold [font-stretch:110%]">{group.label}</h3>
                <ChipList items={group.items} />
              </div>
            ))}
          </Card>
        </Reveal>
      </div>
    </section>
  );
}
