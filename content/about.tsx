import Link from "next/link";

export default function AboutBody() {
  return (
    <>
      <div className="h1">
        <span className="hash">#</span>Gabriel Joshua Paet
      </div>
      <div className="sub">
        senior programmer · pasay city, ph · 9 years shipping
        <span className="caret-blink" />
      </div>

      <div className="status-pill">
        <span
          className="pulse"
          style={{ background: "var(--orange)", boxShadow: "0 0 6px var(--orange)" }}
        />
        currently @ Lumora Capital · not actively looking
      </div>

      <p>
        <span className="com">&gt; </span>Always view problems as an opportunity.
      </p>

      <div className="h2">
        <span className="hash">##</span>
        <span>about</span>
        <span className="h2-rule" />
        <span className="annot">// the basics</span>
      </div>
      <div className="grid">
        <div className="k">name</div>
        <div className="v">
          <span className="str">&quot;Gabriel Joshua Paet&quot;</span>
        </div>
        <div className="k">role</div>
        <div className="v">
          <span className="str">&quot;senior programmer&quot;</span>
        </div>
        <div className="k">based_in</div>
        <div className="v">
          <span className="str">&quot;pasay city, philippines&quot;</span>{" "}
          <span style={{ color: "var(--fg-dim)" }}>// utc+8</span>
        </div>
        <div className="k">years_shipping</div>
        <div className="v">9</div>
        <div className="k">primary_stack</div>
        <div className="v">
          [<span className="str">&quot;node.js&quot;</span>,{" "}
          <span className="str">&quot;express&quot;</span>,{" "}
          <span className="str">&quot;react&quot;</span>,{" "}
          <span className="str">&quot;next.js&quot;</span>,{" "}
          <span className="str">&quot;postgres&quot;</span>]
        </div>
        <div className="k">currently_at</div>
        <div className="v">
          <span className="str">&quot;lumora capital&quot;</span>{" "}
          <span style={{ color: "var(--fg-dim)" }}>// senior programmer</span>
        </div>
      </div>

      <div className="h2">
        <span className="hash">##</span>
        <span>focus</span>
        <span className="h2-rule" />
        <span className="annot">// where i spend my time</span>
      </div>
      <ul>
        <li>
          <b>AI development</b> — putting LLMs and agents into real product workflows, not demos
        </li>
        <li>
          <b>Workflow automation</b> — replacing manual ops with tight, observable pipelines
        </li>
        <li>
          <b>DevOps</b> — AWS, CI/CD on GitHub, Elastic Beanstalk, S3, infra you can read in one sitting
        </li>
        <li>
          <b>Web development</b> — full-stack node + react + next.js, postgres at rest
        </li>
      </ul>

      <div className="h2">
        <span className="hash">##</span>
        <span>currently</span>
        <span className="h2-rule" />
        <span className="annot">// what i&apos;m shipping</span>
      </div>
      <div className="quote">
        Senior programmer at <span className="em">Lumora Capital</span>, based in NCR, Philippines.
        Heads-down on internal tooling and product work.{" "}
        <span className="em">Not actively looking</span>, but always happy to chat about interesting
        problems.
      </div>

      <div className="qa-row">
        <Link href="/contact" className="qa primary">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          say hello
        </Link>
        <Link href="/work" className="qa">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M3 7h18M3 12h18M3 17h12" />
          </svg>
          see work
        </Link>
        <a
          className="qa"
          href="https://github.com/gjvpaet"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M12 .5A11.5 11.5 0 0 0 .5 12c0 5.08 3.29 9.39 7.86 10.91.57.1.78-.25.78-.55v-1.92c-3.2.7-3.87-1.54-3.87-1.54-.52-1.32-1.27-1.67-1.27-1.67-1.04-.71.08-.7.08-.7 1.15.08 1.76 1.18 1.76 1.18 1.02 1.76 2.69 1.25 3.34.96.1-.74.4-1.25.73-1.54-2.55-.29-5.24-1.28-5.24-5.69 0-1.26.45-2.28 1.18-3.09-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.78 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.12 3.04.73.81 1.18 1.83 1.18 3.09 0 4.42-2.7 5.4-5.27 5.69.42.36.79 1.07.79 2.15v3.19c0 .31.21.66.79.55A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
          </svg>
          github
        </a>
      </div>
    </>
  );
}
