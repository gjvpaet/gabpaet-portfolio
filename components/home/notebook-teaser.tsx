import { ArrowRight } from "@phosphor-icons/react/ssr";

import { ButtonLink } from "@/components/button";
import { PaperCard } from "@/components/paper-card";
import { Reveal } from "@/components/reveal";

// Notebook spec 11: the home page's closing note, the way into /notebook.
// VERIFY: all copy.
export function NotebookTeaser() {
  return (
    <section aria-labelledby="notebook-h" className="pb-20 md:pb-24 print:hidden">
      <Reveal className="mx-auto max-w-[520px]">
        <PaperCard rotate={-0.8} tape="top" className="px-5 pt-9 pb-7 sm:px-7">
          <h2 id="notebook-h" className="type-h3">
            This page is the tidy half.
          </h2>
          <p className="mt-3 text-ink-soft">
            The rest of the notebook is loose pages on a desk: drag them around, zoom out, doodle in the margins.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3">
            <ButtonLink href="/notebook" variant="primary" icon={<ArrowRight size={20} weight="bold" />}>
              Open the notebook
            </ButtonLink>
            <p aria-hidden="true" className="type-hand -rotate-2 text-pen">
              bring a pencil
            </p>
          </div>
        </PaperCard>
      </Reveal>
    </section>
  );
}
