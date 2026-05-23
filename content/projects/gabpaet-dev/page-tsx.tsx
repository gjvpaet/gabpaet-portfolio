const HTML = `<pre class="src"><span class="tk-cmt">// app/page.tsx — gabpaet.dev portfolio root.</span>
<span class="tk-cmt">// next.js 15 · react 19 · tailwind. shipped solo, 2026.</span>

<span class="tk-kw">import</span> { <span class="tk-typ">Metadata</span> } <span class="tk-kw">from</span> <span class="tk-str">"next"</span>;
<span class="tk-kw">import</span> { <span class="tk-typ">FileTree</span> } <span class="tk-kw">from</span> <span class="tk-str">"@/components/file-tree"</span>;
<span class="tk-kw">import</span> { <span class="tk-typ">Editor</span> } <span class="tk-kw">from</span> <span class="tk-str">"@/components/editor"</span>;
<span class="tk-kw">import</span> { <span class="tk-typ">CommandPalette</span> } <span class="tk-kw">from</span> <span class="tk-str">"@/components/command-palette"</span>;
<span class="tk-kw">import</span> { files, fileOrder } <span class="tk-kw">from</span> <span class="tk-str">"@/content/files"</span>;

<span class="tk-kw">export const</span> <span class="tk-var">metadata</span>: <span class="tk-typ">Metadata</span> = {
  title:       <span class="tk-str">"Gabriel Joshua Paet — Senior Programmer"</span>,
  description: <span class="tk-str">"9 years shipping. AI · automation · DevOps · web."</span>,
};

<span class="tk-kw">export default function</span> <span class="tk-fn">Page</span>() {
  <span class="tk-kw">return</span> (
    &lt;<span class="tk-tag">main</span> <span class="tk-var">className</span>=<span class="tk-str">"ide grid h-screen"</span>&gt;
      &lt;<span class="tk-tag">TitleBar</span> <span class="tk-var">path</span>=<span class="tk-str">"~/portfolio"</span> /&gt;

      &lt;<span class="tk-tag">FileTree</span>
        <span class="tk-var">order</span>={fileOrder}
        <span class="tk-var">files</span>={files}
        <span class="tk-var">onOpen</span>={(id) =&gt; <span class="tk-fn">openFile</span>(id)}
      /&gt;

      &lt;<span class="tk-tag">Editor</span>
        <span class="tk-var">active</span>={active}
        <span class="tk-var">tabs</span>={openTabs}
        <span class="tk-var">file</span>={files[active]}
      /&gt;

      &lt;<span class="tk-tag">CommandPalette</span>
        <span class="tk-var">shortcut</span>={[<span class="tk-str">"mod+k"</span>, <span class="tk-str">"mod+p"</span>]}
        <span class="tk-var">items</span>={fileOrder.<span class="tk-fn">map</span>((id) =&gt; files[id])}
      /&gt;

      &lt;<span class="tk-tag">StatusBar</span> <span class="tk-var">where</span>=<span class="tk-str">"pasay · utc+8"</span> /&gt;
    &lt;/<span class="tk-tag">main</span>&gt;
  );
}

<span class="tk-cmt">// see ./components/* for the actual rendering. this is the assembly.</span></pre>`;

export default function ProjectsPageTsxBody() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
