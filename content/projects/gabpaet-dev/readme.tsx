export default function ProjectsReadmeBody() {
  return (
    <>
      <div className="h1">
        <span className="hash">#</span>gabpaet.dev
      </div>
      <div className="sub">this portfolio · v1 · 2026</div>

      <p>
        <span className="com">&gt;</span> What you&apos;re looking at right now.
      </p>

      <div className="h2">
        <span className="hash">##</span>
        <span>idea</span>
        <span className="h2-rule" />
      </div>
      <p>
        Render the whole portfolio as an IDE — sidebar, tabs, command palette, the works. Each
        section is a file you open. Reads honest, feels familiar for the audience.
      </p>

      <div className="h2">
        <span className="hash">##</span>
        <span>stack</span>
        <span className="h2-rule" />
      </div>
      <div className="grid">
        <div className="k">framework</div>
        <div className="v">next.js 15 · react 19</div>
        <div className="k">styles</div>
        <div className="v">tailwind + tokens</div>
        <div className="k">deploy</div>
        <div className="v">vercel</div>
        <div className="k">repo</div>
        <div className="v">
          <a
            className="lnk"
            href="https://github.com/gjvpaet"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/gjvpaet
          </a>
        </div>
      </div>

      <div className="h2">
        <span className="hash">##</span>
        <span>todo</span>
        <span className="h2-rule" />
      </div>
      <ul>
        <li>more projects in the sidebar (write-once-render-anywhere file format)</li>
        <li>print-to-pdf CV export from the same data</li>
        <li>search across file contents (not just filenames)</li>
        <li>switch to using actual file contents from the repo at build time</li>
      </ul>
    </>
  );
}
