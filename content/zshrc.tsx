const HTML = `<pre class="src"><span class="tk-cmt"># ~/.zshrc — just the good parts</span>

<span class="tk-cmt"># --- editor + shell ---</span>
<span class="tk-kw">export</span> EDITOR=code
<span class="tk-kw">export</span> PAGER=<span class="tk-str">"less -FX"</span>
<span class="tk-kw">setopt</span> HIST_IGNORE_DUPS HIST_IGNORE_SPACE INC_APPEND_HISTORY

<span class="tk-cmt"># --- node / pnpm ---</span>
<span class="tk-kw">export</span> NVM_DIR=<span class="tk-str">"$HOME/.nvm"</span>
[ -s <span class="tk-str">"$NVM_DIR/nvm.sh"</span> ] &amp;&amp; <span class="tk-kw">source</span> <span class="tk-str">"$NVM_DIR/nvm.sh"</span>
<span class="tk-fn">alias</span> n=<span class="tk-str">"node"</span>
<span class="tk-fn">alias</span> ni=<span class="tk-str">"pnpm install"</span>
<span class="tk-fn">alias</span> nd=<span class="tk-str">"pnpm dev"</span>
<span class="tk-fn">alias</span> nb=<span class="tk-str">"pnpm build"</span>
<span class="tk-fn">alias</span> nt=<span class="tk-str">"pnpm test"</span>
<span class="tk-fn">alias</span> nx=<span class="tk-str">"pnpm dlx"</span>

<span class="tk-cmt"># --- git + github ---</span>
<span class="tk-fn">alias</span> g=<span class="tk-str">"git"</span>
<span class="tk-fn">alias</span> gs=<span class="tk-str">"git status -sb"</span>
<span class="tk-fn">alias</span> gl=<span class="tk-str">"git log --oneline --graph --decorate -20"</span>
<span class="tk-fn">alias</span> gco=<span class="tk-str">"git checkout"</span>
<span class="tk-fn">alias</span> gp=<span class="tk-str">"git push"</span>

<span class="tk-cmt"># --- aws / devops ---</span>
<span class="tk-fn">alias</span> awl=<span class="tk-str">"aws sso login"</span>
<span class="tk-fn">alias</span> awsls=<span class="tk-str">"aws s3 ls"</span>
<span class="tk-fn">alias</span> eb=<span class="tk-str">"eb"</span>     <span class="tk-cmt"># elastic beanstalk cli</span>

<span class="tk-cmt"># --- helpers ---</span>
<span class="tk-fn">mkcd</span>() { mkdir -p <span class="tk-str">"$1"</span> &amp;&amp; cd <span class="tk-str">"$1"</span>; }
<span class="tk-fn">weather</span>() { curl <span class="tk-str">"wttr.in/\${1:-pasay}?format=3"</span>; }
<span class="tk-fn">port</span>()    { lsof -nP -iTCP:<span class="tk-str">$1</span> -sTCP:LISTEN; }</pre>`;

export default function ZshrcBody() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
