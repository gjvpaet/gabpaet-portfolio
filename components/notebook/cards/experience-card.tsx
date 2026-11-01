import { DrawnLink } from "@/components/drawn-link";
import { profile } from "@/content/profile";
import { handRange } from "@/lib/dates";

// Notebook card: Experience (notebook spec 3). One row per role: company,
// current title, dates and work mode, and its one line. The full history is
// on the résumé.
export function ExperienceCard() {
  return (
    <div className="grid gap-2">
      <ol className="grid">
        {profile.roles.map((role) => (
          <li key={role.company} className="grid gap-1 border-t-2 border-ink py-4 first:border-t-0 first:pt-0">
            <h3 className="text-lg leading-tight font-bold">{role.company}</h3>
            <p className="type-meta text-ink-soft">
              {role.titles[0].title} · {handRange(role)} · {role.mode}
            </p>
            <p>{role.homeLine}</p>
          </li>
        ))}
      </ol>
      <DrawnLink href="/resume" className="w-fit">
        Full history on the résumé
      </DrawnLink>
    </div>
  );
}
