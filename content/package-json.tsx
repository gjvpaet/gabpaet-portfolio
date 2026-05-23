const HTML = `<pre class="src">{
  <span class="tk-str">"name"</span>: <span class="tk-str">"gabpaet"</span>,
  <span class="tk-str">"version"</span>: <span class="tk-str">"1.0.0"</span>,
  <span class="tk-str">"description"</span>: <span class="tk-str">"senior programmer · 9y shipping · ai · automation · web"</span>,
  <span class="tk-str">"main"</span>: <span class="tk-str">"about.md"</span>,
  <span class="tk-str">"homepage"</span>: <span class="tk-str">"https://gabpaet.dev"</span>,
  <span class="tk-str">"author"</span>: {
    <span class="tk-str">"name"</span>:  <span class="tk-str">"Gabriel Joshua Paet"</span>,
    <span class="tk-str">"email"</span>: <span class="tk-str">"gjvpaet@gmail.com"</span>,
    <span class="tk-str">"url"</span>:   <span class="tk-str">"https://gabpaet.dev"</span>
  },
  <span class="tk-str">"keywords"</span>: [
    <span class="tk-str">"node"</span>, <span class="tk-str">"express"</span>, <span class="tk-str">"react"</span>, <span class="tk-str">"next.js"</span>,
    <span class="tk-str">"postgres"</span>, <span class="tk-str">"aws"</span>, <span class="tk-str">"ai"</span>, <span class="tk-str">"automation"</span>, <span class="tk-str">"devops"</span>
  ],
  <span class="tk-str">"scripts"</span>: {
    <span class="tk-str">"hire"</span>:     <span class="tk-str">"mailto:gjvpaet@gmail.com"</span>,
    <span class="tk-str">"linkedin"</span>: <span class="tk-str">"open https://www.linkedin.com/in/gjvpaet/"</span>,
    <span class="tk-str">"github"</span>:   <span class="tk-str">"open https://github.com/gjvpaet"</span>,
    <span class="tk-str">"portfolio"</span>:<span class="tk-str">"open https://gabpaet.dev"</span>
  },
  <span class="tk-str">"engines"</span>: {
    <span class="tk-str">"coffee"</span>: <span class="tk-str">">=1 cup/day"</span>,
    <span class="tk-str">"sleep"</span>:  <span class="tk-str">">=7 hours/night"</span>
  },
  <span class="tk-str">"availability"</span>: <span class="tk-str">"not actively looking"</span>,
  <span class="tk-str">"license"</span>: <span class="tk-str">"MIT"</span>
}</pre>`;

export default function PackageJsonBody() {
  return <div dangerouslySetInnerHTML={{ __html: HTML }} />;
}
