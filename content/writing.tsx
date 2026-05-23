export default function WritingBody() {
  return (
    <>
      <div className="h1">
        <span className="hash">#</span>Writing
      </div>
      <div className="sub">coming soon</div>
      <p>
        <span className="com">&gt;</span> Not publishing yet — placeholder until i have something
        worth posting.
      </p>
      <div className="quote">
        To enable this in the sidebar, set <span className="em">hidden: false</span> on the{" "}
        <span className="em">writing.md</span> entry in{" "}
        <span className="em">content/files.ts</span>.
      </div>
    </>
  );
}
