"use client";
/* eslint-disable react-hooks/set-state-in-effect, @next/next/no-img-element */
import {useEffect,useMemo,useState} from "react";
import {ArrowLeft,BookOpen,Check,ChevronRight,Compass,Grape,House,Library,NotebookPen,Search,Sparkles,Utensils,Wine} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Progress} from "@/components/ui/progress";
import {Tabs,TabsContent,TabsList,TabsTrigger} from "@/components/ui/tabs";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Slider} from "@/components/ui/slider";
import {Switch} from "@/components/ui/switch";
import {chapters,chapterParts,type Chapter as ChapterType} from "@/content/chapters";
import {grapes,glossary,pairings,type Grape as GrapeType} from "@/content/wine-data";
import {wineRepository,type Tasting} from "@/repositories/wine-repository";

type Section="home"|"learn"|"explore"|"practice"|"journey"|"library";
const PROGRESS_KEY="vinho-sem-misterio:completed-chapters";
const NAV:{id:Section;label:string;icon:typeof House}[]=[
  {id:"home",label:"Início",icon:House},{id:"learn",label:"Aprender",icon:BookOpen},
  {id:"explore",label:"Explorar",icon:Compass},{id:"practice",label:"Praticar",icon:Wine},
  {id:"journey",label:"Jornada",icon:Sparkles},{id:"library",label:"Biblioteca",icon:Library}
];
const scoreDots=(value:number)=><span className="score" aria-label={`${value} de 5`}>{Array.from({length:5},(_,i)=><i key={i} className={i<value?"on":""}/>)}</span>;

export default function Home(){
  const[section,setSection]=useState<Section>("home");
  const[completed,setCompleted]=useState<string[]>([]);
  const[tastings,setTastings]=useState<Tasting[]>([]);
  useEffect(()=>{
    const old=localStorage.getItem("vinho-sem-misterio:chapter-1")==="done"?[chapters[0].slug]:[];
    try{setCompleted(JSON.parse(localStorage.getItem(PROGRESS_KEY)||JSON.stringify(old)))}catch{setCompleted(old)}
    setTastings(wineRepository.findAll());
  },[]);
  const complete=(slug:string)=>setCompleted(prev=>{
    const next=prev.includes(slug)?prev:[...prev,slug];localStorage.setItem(PROGRESS_KEY,JSON.stringify(next));return next;
  });
  return <main>
    <Header section={section} go={setSection}/>
    {section==="home"&&<HomeView completed={completed} go={setSection}/>} 
    {section==="learn"&&<Learn completed={completed} complete={complete}/>} 
    {section==="explore"&&<Explore/>} 
    {section==="practice"&&<Practice onSaved={()=>setTastings(wineRepository.findAll())}/>} 
    {section==="journey"&&<Journey tastings={tastings} completed={completed} practice={()=>setSection("practice")} learn={()=>setSection("learn")}/>} 
    {section==="library"&&<Glossary/>}
    <nav className="mobile-nav" aria-label="Navegação móvel">{NAV.slice(0,5).map(({id,label,icon:Icon})=><button key={id} className={section===id?"active":""} onClick={()=>setSection(id)}><Icon/><span>{label}</span></button>)}</nav>
  </main>;
}

function Header({section,go}:{section:Section;go:(s:Section)=>void}){return <header className="topbar">
  <button className="brand" onClick={()=>go("home")} aria-label="Ir para o início"><Wine/><span>VINHO <em>SEM MISTÉRIO</em></span></button>
  <nav className="desktop-nav" aria-label="Navegação principal">{NAV.map(n=><button key={n.id} className={section===n.id?"active":""} onClick={()=>go(n.id)}>{n.label}</button>)}</nav>
  <button className="search-pill" onClick={()=>go("library")}><Search/><span>Buscar</span><kbd>⌘ K</kbd></button>
</header>}

function HomeView({completed,go}:{completed:string[];go:(s:Section)=>void}){
  const percent=Math.round(completed.length/chapters.length*100);
  const next=chapters.find(c=>!completed.includes(c.slug))||chapters[0];
  return <>
    <section className="hero"><img src="/wine-hero.jpg" alt="Taça de vinho e videira em composição editorial"/><div className="hero-shade"/><div className="hero-copy"><p className="eyebrow">UM LIVRO VIVO SOBRE VINHOS</p><h1>Vinho sem<br/><i>mistério.</i></h1><p>Aprenda a escolher, degustar, entender e harmonizar vinhos em uma jornada prática e visual.</p><div className="hero-actions"><Button size="lg" onClick={()=>go("learn")}>{completed.length?"Continuar aprendendo":"Começar a aprender"}<ChevronRight/></Button><button className="text-button" onClick={()=>go("practice")}><Wine/> Registrar uma taça</button></div></div><div className="hero-note"><span>{String(completed.length+1).padStart(2,"0")}</span><p><b>Seu próximo capítulo</b>{next.title}</p></div></section>
    <section className="content-shell welcome-grid"><div><p className="eyebrow burgundy">SUA JORNADA COMPLETA</p><h2>Conhecimento que cresce<br/>a cada taça.</h2><p className="lead">Agora o livro reúne {chapters.length} capítulos, dos fundamentos ao nível avançado — sempre com linguagem clara e experiência prática.</p></div><div className="progress-card"><div className="progress-head"><div><span>{completed.length<19?"NÍVEL 1":"EM EVOLUÇÃO"}</span><strong>{completed.length<19?"Curioso":"Apreciador"}</strong></div><b>{percent}%</b></div><Progress value={percent}/><div className="progress-row"><span>Capítulos <b>{completed.length} / {chapters.length}</b></span><span>Restam <b>{chapters.length-completed.length}</b></span></div></div></section>
    <section className="content-shell"><p className="eyebrow burgundy">O LIVRO COMPLETO</p><h2>Oito partes. Uma jornada.</h2><div className="part-summary">{chapterParts.map(part=><button key={part.id} onClick={()=>go("learn")}><span>{part.label}</span><strong>{part.title}</strong><small>{chapters.filter(c=>c.part===part.id).length} capítulos</small><ChevronRight/></button>)}</div></section>
  </>;
}

function Learn({completed,complete}:{completed:string[];complete:(slug:string)=>void}){
  const[active,setActive]=useState<ChapterType|null>(null);
  const[part,setPart]=useState(chapterParts[0].id);
  if(active)return <ChapterReader chapter={active} completed={completed.includes(active.slug)} finish={()=>complete(active.slug)} back={()=>setActive(null)} next={()=>{const i=chapters.findIndex(c=>c.slug===active.slug);setActive(chapters[(i+1)%chapters.length])}}/>;
  const list=chapters.filter(c=>c.part===part);
  return <section className="content-shell page-space chapter-library">
    <p className="eyebrow burgundy">APRENDER</p><h1 className="page-title">Todos os <i>capítulos.</i></h1><p className="lead">Escolha uma parte, avance no seu ritmo e conclua cada leitura. O progresso fica salvo neste aparelho.</p>
    <div className="library-progress"><div><strong>{completed.length}</strong><span>de {chapters.length} concluídos</span></div><Progress value={completed.length/chapters.length*100}/></div>
    <div className="part-tabs" role="tablist" aria-label="Partes do livro">{chapterParts.map(p=><button role="tab" aria-selected={part===p.id} className={part===p.id?"active":""} key={p.id} onClick={()=>setPart(p.id)}><span>{p.label}</span>{p.title}</button>)}</div>
    <div className="chapter-list"><div className="chapter-list-title"><span>{chapterParts.find(p=>p.id===part)?.label}</span><h2>{chapterParts.find(p=>p.id===part)?.title}</h2><b>{list.length} capítulos</b></div>{list.map((c,index)=><button key={c.slug} onClick={()=>setActive(c)}><span className="chapter-number">{String(index+1).padStart(2,"0")}</span><div><h3>{c.title}</h3><p>{c.intro}</p></div><span className={`chapter-status ${completed.includes(c.slug)?"done":""}`}>{completed.includes(c.slug)?<Check/>:<ChevronRight/>}</span></button>)}</div>
  </section>;
}

function ChapterReader({chapter,completed,finish,back,next}:{chapter:ChapterType;completed:boolean;finish:()=>void;back:()=>void;next:()=>void}){
  const[answers,setAnswers]=useState<Record<number,number>>({});
  const answered=Object.keys(answers).length;
  const score=chapter.quiz.reduce((total,q,index)=>total+(answers[index]===q.correct?1:0),0);
  return <article className="chapter content-shell">
    <button className="back-link" onClick={back}><ArrowLeft/> Todos os capítulos</button>
    <div className="chapter-hero"><p className="eyebrow burgundy">{chapter.partTitle.toUpperCase()}</p><span>LEITURA · {chapter.readingTime} MIN</span><h1>{chapter.title}</h1><p>{chapter.intro}</p></div>
    <div className="reading-column">
      <section className="learning-objectives"><span>AO FINAL, VOCÊ SERÁ CAPAZ DE</span><ul>{chapter.objectives.map(item=><li key={item}><Check/>{item}</li>)}</ul></section>
      <p className="dropcap">{chapter.essential}</p>
      <p>{chapter.detail}</p>
      <h2>Por que isso importa</h2><p>{chapter.whyItMatters}</p>
      <aside><span>EM POUCAS PALAVRAS</span><b>{chapter.takeaway}</b><p>Use esta ideia como ponto de partida. O vinho ganha sentido quando conceito e experiência se encontram na taça.</p></aside>
      <div className="mistake-box"><span>UM ERRO COMUM</span><h3>Evite conclusões automáticas</h3><p>{chapter.commonMistake}</p></div>
      <h2>Como perceber na prática</h2><p>Degustar com atenção permite transformar informação em memória. Compare exemplos, registre a primeira impressão e volte às anotações depois. A repetição consciente revela padrões sem apagar a surpresa de cada garrafa.</p>
      <div className="practical"><p className="eyebrow">EXPERIÊNCIA PRÁTICA</p><h3>Aprenda pela comparação</h3><p>{chapter.practice}</p><ul><li>Prepare os exemplos nas mesmas condições.</li><li>Observe antes de julgar e use palavras simples.</li><li>Registre a diferença mais evidente.</li><li>Repita a experiência em outro momento.</li></ul></div>
      <div className="quiz chapter-quiz"><div className="quiz-heading"><div><p className="eyebrow burgundy">QUIZ DO CAPÍTULO</p><h3>Confira o que ficou.</h3></div><span>{answered}/{chapter.quiz.length}</span></div>{chapter.quiz.map((question,qIndex)=><section className="quiz-question" key={question.question}><h4><span>{qIndex+1}</span>{question.question}</h4>{question.options.map((option,oIndex)=>{const chosen=answers[qIndex]===oIndex;const revealed=answers[qIndex]!==undefined;return <button key={option} disabled={revealed} className={chosen?(oIndex===question.correct?"correct":"wrong"):(revealed&&oIndex===question.correct?"correct muted-answer":"")} onClick={()=>setAnswers(prev=>({...prev,[qIndex]:oIndex}))}><span>{String.fromCharCode(65+oIndex)}</span>{option}{revealed&&oIndex===question.correct&&<Check/>}</button>})}{answers[qIndex]!==undefined&&<p className="feedback">{answers[qIndex]===question.correct?"Resposta correta. ":"Ainda não. "}{question.explanation}</p>}</section>)}{answered===chapter.quiz.length&&<div className="quiz-result"><strong>{score}/{chapter.quiz.length}</strong><div><b>{score===chapter.quiz.length?"Excelente percepção.":score>=2?"Muito bem.":"Vale revisitar os pontos-chave."}</b><span>As explicações ficam disponíveis para revisão.</span></div></div>}</div>
      <div className="chapter-summary"><span>LEVE COM VOCÊ</span><h2>{chapter.takeaway}</h2><p>Conhecimento de vinho não é uma coleção de certezas. É a capacidade de perceber, comparar e explicar o que muda de uma taça para outra.</p></div>
      <div className="chapter-actions"><Button variant="outline" onClick={back}>Voltar ao índice</Button><Button size="lg" disabled={answered<chapter.quiz.length} onClick={()=>{finish();next()}}>{answered<chapter.quiz.length?"Responda ao quiz":completed?"Próximo capítulo":"Concluir e continuar"}<ChevronRight/></Button></div>
    </div>
  </article>;
}

function Explore(){
  const[selected,setSelected]=useState<GrapeType>(grapes[0]);const[compare,setCompare]=useState<string[]>([grapes[0].slug,grapes[1].slug]);const compared=grapes.filter(g=>compare.includes(g.slug));
  return <section className="content-shell page-space"><p className="eyebrow burgundy">ENCICLOPÉDIA VISUAL</p><h1 className="page-title">Conheça as <i>uvas.</i></h1><p className="lead">Cada variedade tem uma assinatura. Compare sem pressa e descubra o que chama sua atenção.</p><div className="grape-grid">{grapes.map(g=><button key={g.slug} className={`grape-tile ${selected.slug===g.slug?"selected":""}`} onClick={()=>setSelected(g)} style={{"--grape":g.accent} as React.CSSProperties}><span>{g.color}</span><Grape/><h3>{g.name}</h3><p>{g.origin}</p></button>)}</div><div className="grape-detail"><div><p className="eyebrow">EM DESTAQUE</p><h2>{selected.name}</h2><p>{selected.summary}</p><div className="aromas">{selected.aromas.map(a=><span key={a}>{a}</span>)}</div></div><div className="metrics">{[["Corpo",selected.body],["Tanino",selected.tannin],["Acidez",selected.acidity],["Álcool",selected.alcohol]].map(([l,v])=><div key={l as string}><span>{l}</span>{scoreDots(v as number)}</div>)}<small>Servir a {selected.temperature}</small></div></div><div className="compare"><p className="eyebrow burgundy">COMPARADOR</p><h2>Perceba as diferenças.</h2><div className="compare-options">{grapes.map(g=><label key={g.slug}><input type="checkbox" checked={compare.includes(g.slug)} onChange={()=>setCompare(p=>p.includes(g.slug)?(p.length>2?p.filter(x=>x!==g.slug):p):(p.length<3?[...p,g.slug]:p))}/> {g.name.split(" ")[0]}</label>)}</div><div className="compare-table"><div/><b>Corpo</b><b>Tanino</b><b>Acidez</b>{compared.map(g=><div className="compare-row" key={g.slug}><strong>{g.name}</strong>{scoreDots(g.body)}{scoreDots(g.tannin)}{scoreDots(g.acidity)}</div>)}</div></div></section>;
}

function Practice({onSaved}:{onSaved:()=>void}){
  const[dish,setDish]=useState("Carne de sol");const[saved,setSaved]=useState(false);const[form,setForm]=useState({wineName:"",producer:"",country:"",grape:"",vintage:"",aromas:"",acidity:3,tannin:3,body:3,persistence:3,rating:8,buyAgain:true});
  const set=(k:string,v:string|number|boolean)=>setForm(p=>({...p,[k]:v}));const save=()=>{if(!form.wineName.trim())return;wineRepository.create(form);setSaved(true);onSaved();setForm(p=>({...p,wineName:"",producer:"",aromas:""}));setTimeout(()=>setSaved(false),2500)};
  return <section className="content-shell page-space"><p className="eyebrow burgundy">APRENDA FAZENDO</p><h1 className="page-title">Pratique com a <i>sua taça.</i></h1><Tabs defaultValue="tasting" className="practice-tabs"><TabsList variant="line"><TabsTrigger value="tasting"><NotebookPen/> Degustação</TabsTrigger><TabsTrigger value="pairing"><Utensils/> Harmonizador</TabsTrigger></TabsList><TabsContent value="tasting"><div className="tasting-sheet"><div className="form-intro"><span>FICHA DE DEGUSTAÇÃO</span><h2>Registre o que você percebeu.</h2><p>Não há resposta errada. Memória sensorial se constrói voltando às próprias impressões.</p></div><div className="fields"><Field l="Vinho *"><Input value={form.wineName} onChange={e=>set("wineName",e.target.value)} placeholder="Nome do rótulo"/></Field><Field l="Produtor"><Input value={form.producer} onChange={e=>set("producer",e.target.value)} placeholder="Quem produziu"/></Field><Field l="País"><Input value={form.country} onChange={e=>set("country",e.target.value)} placeholder="Ex.: Brasil"/></Field><Field l="Uva"><Input value={form.grape} onChange={e=>set("grape",e.target.value)} placeholder="Ex.: Merlot"/></Field><Field l="Safra"><Input value={form.vintage} onChange={e=>set("vintage",e.target.value)} placeholder="2022"/></Field><Field l="Aromas percebidos"><Input value={form.aromas} onChange={e=>set("aromas",e.target.value)} placeholder="Frutas, flores, especiarias…"/></Field></div><div className="sliders">{[["Acidez","acidity"],["Tanino","tannin"],["Corpo","body"],["Persistência","persistence"],["Minha nota","rating"]].map(([l,k])=><div key={k}><Label>{l} <b>{form[k as keyof typeof form] as number}{k==="rating"?"/10":"/5"}</b></Label><Slider min={1} max={k==="rating"?10:5} step={1} value={[form[k as keyof typeof form] as number]} onValueChange={v=>set(k,v[0])}/></div>)}</div><div className="save-row"><label><Switch checked={form.buyAgain} onCheckedChange={v=>set("buyAgain",v)}/> Compraria novamente</label><Button size="lg" onClick={save} disabled={!form.wineName.trim()}>{saved?<><Check/> Degustação salva</>:"Salvar degustação"}</Button></div></div></TabsContent><TabsContent value="pairing"><div className="pairing-tool"><div><p className="eyebrow">O QUE VOCÊ VAI COMER?</p><h2>Harmonizar é criar equilíbrio.</h2><div className="dish-list">{Object.keys(pairings).map(d=><button className={dish===d?"active":""} key={d} onClick={()=>setDish(d)}>{d}</button>)}</div></div><div className="pairing-result"><span>BOAS COMPANHIAS</span><h3>{dish}</h3>{pairings[dish].wines.map(w=><div key={w}><Wine/>{w}</div>)}<p>{pairings[dish].why}</p><small>Harmonização não é regra absoluta. Use como ponto de partida e vale experimentar.</small></div></div></TabsContent></Tabs></section>;
}
function Field({l,children}:{l:string;children:React.ReactNode}){return <div><Label>{l}</Label>{children}</div>}

function Journey({tastings,completed,practice,learn}:{tastings:Tasting[];completed:string[];practice:()=>void;learn:()=>void}){
  const avg=tastings.length?(tastings.reduce((s,t)=>s+t.rating,0)/tastings.length).toFixed(1):"—";const unique=new Set(tastings.map(t=>t.grape).filter(Boolean)).size;
  return <section className="content-shell page-space"><p className="eyebrow burgundy">MINHA JORNADA</p><h1 className="page-title">Sua curiosidade em <i>movimento.</i></h1><div className="stat-grid"><Stat icon={Wine} n={tastings.length} l="Vinhos degustados"/><Stat icon={Grape} n={unique} l="Uvas experimentadas"/><Stat icon={Sparkles} n={avg} l="Média das notas"/><Stat icon={BookOpen} n={completed.length} l="Capítulos concluídos"/></div><div className="journey-progress"><div><h2>Progresso no livro</h2><strong>{Math.round(completed.length/chapters.length*100)}%</strong></div><Progress value={completed.length/chapters.length*100}/><Button variant="outline" onClick={learn}>Continuar aprendendo</Button></div>{tastings.length===0?<div className="empty-state"><Wine/><h2>Sua primeira taça ainda está por vir.</h2><p>Registre um vinho e comece a construir sua memória sensorial.</p><Button onClick={practice}>Registrar meu primeiro vinho</Button></div>:<div className="tasting-list"><div className="section-head"><h2>Degustações recentes</h2><Button variant="outline" onClick={practice}>Nova degustação</Button></div>{tastings.map(t=><article key={t.id}><div><span>{t.country||"Origem não informada"}{t.vintage&&` · ${t.vintage}`}</span><h3>{t.wineName}</h3><p>{[t.producer,t.grape].filter(Boolean).join(" · ")}</p></div><strong>{t.rating}<small>/10</small></strong></article>)}</div>}</section>;
}
function Stat({icon:Icon,n,l}:{icon:typeof Wine;n:string|number;l:string}){return <div><Icon/><b>{n}</b><span>{l}</span></div>}

function Glossary(){const[q,setQ]=useState("");const results=useMemo(()=>glossary.filter(g=>`${g.term} ${g.text}`.toLowerCase().includes(q.toLowerCase())),[q]);return <section className="content-shell page-space"><p className="eyebrow burgundy">BIBLIOTECA</p><h1 className="page-title">Palavras sem <i>complicação.</i></h1><div className="glossary-search"><Search/><Input value={q} onChange={e=>setQ(e.target.value)} placeholder="Busque acidez, tanino, terroir…" autoFocus/></div><div className="glossary-list">{results.map(g=><article key={g.term}><span>{g.term[0]}</span><div><h2>{g.term}</h2><p>{g.text}</p></div></article>)}</div>{!results.length&&<div className="empty-state"><Search/><h2>Nenhum termo encontrado.</h2><p>Tente uma palavra mais curta.</p></div>}</section>}
