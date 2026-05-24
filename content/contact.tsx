export default function ContactBody() {
  return (
    <>
      <div className="h1">
        <span className="hash">#</span>Contact
      </div>
      <div className="sub">say hi · i actually read these</div>

      <p>
        <span className="com">&gt; </span>Plain email works best. LinkedIn for formal stuff. Not
        actively looking but always happy to chat about interesting problems.
      </p>

      <div className="h2">
        <span className="hash">##</span>
        <span>direct</span>
        <span className="h2-rule" />
      </div>
      <div className="contact-grid">
        <div className="row">
          <span className="k">email</span>
          <a className="v" href="mailto:gjvpaet@gmail.com">
            gjvpaet@gmail.com
          </a>
        </div>
        <div className="row">
          <span className="k">mobile</span>
          <span className="v" style={{ color: "var(--fg)" }}>
            +63 976 003 6773
          </span>
        </div>
      </div>

      <div className="h2">
        <span className="hash">##</span>
        <span>online</span>
        <span className="h2-rule" />
      </div>
      <div className="contact-grid">
        <div className="row">
          <span className="k">github</span>
          <a
            className="v"
            href="https://github.com/gjvpaet"
            target="_blank"
            rel="noopener noreferrer"
          >
            github.com/gjvpaet
          </a>
        </div>
        <div className="row">
          <span className="k">linkedin</span>
          <a
            className="v"
            href="https://www.linkedin.com/in/gjvpaet/"
            target="_blank"
            rel="noopener noreferrer"
          >
            in/gjvpaet
          </a>
        </div>
        <div className="row">
          <span className="k">portfolio</span>
          <a
            className="v"
            href="https://gabpaet.dev/"
            target="_blank"
            rel="noopener noreferrer"
          >
            gabpaet.dev
          </a>
        </div>
      </div>

      <div className="h2">
        <span className="hash">##</span>
        <span>availability</span>
        <span className="h2-rule" />
      </div>
      <div className="quote">
        currently <span className="em">senior programmer @ Lumora Capital</span>.<br />
        <span className="em">not actively looking</span> — feel free to reach out anyway, especially
        for AI / automation / web work conversations.
      </div>

      <div className="qa-row">
        <a className="qa primary" href="mailto:gjvpaet@gmail.com">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <rect x="3" y="5" width="18" height="14" rx="2" />
            <path d="m3 7 9 6 9-6" />
          </svg>
          send mail
        </a>
        <a
          className="qa"
          href="https://www.linkedin.com/in/gjvpaet/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg viewBox="0 0 24 24" fill="currentColor">
            <path d="M4.98 3.5a2.5 2.5 0 1 1 0 5.01 2.5 2.5 0 0 1 0-5Zm.02 6.5h-.04A2 2 0 0 0 3 12v8.5c0 .55.45 1 1 1h2c.55 0 1-.45 1-1V12a2 2 0 0 0-2-2Zm6 0a2 2 0 0 0-2 2v8.5c0 .55.45 1 1 1h2c.55 0 1-.45 1-1v-4.5c0-1.65 1.35-3 3-3s3 1.35 3 3v4.5c0 .55.45 1 1 1h2c.55 0 1-.45 1-1V14.5c0-3-2.5-5.5-5.5-5.5-1.42 0-2.71.54-3.7 1.41V11c0-.55-.45-1-1-1h-1.8Z" />
          </svg>
          message on linkedin
        </a>
      </div>
    </>
  );
}
