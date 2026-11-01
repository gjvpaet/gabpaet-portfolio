import { DownloadSimple, FileText } from "@phosphor-icons/react/ssr";

import { ButtonLink } from "@/components/button";
import { profile } from "@/content/profile";

// Notebook card: Résumé (notebook spec 3). The way to the formal version
// and its PDF.
export function ResumeCard() {
  return (
    <div className="grid gap-4">
      {/* VERIFY */}
      <p>The formal version, with the full history.</p>
      <div className="grid gap-2.5">
        <ButtonLink href="/resume" variant="primary" icon={<FileText size={20} weight="bold" />}>
          Open résumé
        </ButtonLink>
        <ButtonLink href={profile.resumePdf} icon={<DownloadSimple size={20} weight="bold" />} download>
          Download PDF
        </ButtonLink>
      </div>
    </div>
  );
}
