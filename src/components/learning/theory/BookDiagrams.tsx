import { ArrowDown, ArrowRight, RefreshCw, ShieldCheck, Zap } from 'lucide-react'
import InlineText from './InlineText'

/**
 * Qo'llanmadagi TikZ sxemalarining brauzerdagi muqobili.
 *
 * Oqim sxemalari HTML/flex bilan chizilgan — kichik ekranda ustunga o'tadi va
 * matn har doim o'qiladigan kattalikda qoladi.
 */

function Node({ title, sub, tone }: { title: string; sub?: string; tone?: string }) {
  return (
    <div className={tone ? `book-diagram-node book-diagram-node-${tone}` : 'book-diagram-node'}>
      <span className="book-diagram-node-title"><InlineText text={title} /></span>
      {sub && <span className="book-diagram-node-sub"><InlineText text={sub} /></span>}
    </div>
  )
}

function Link({ label, vertical }: { label?: string; vertical?: boolean }) {
  const Icon = vertical ? ArrowDown : ArrowRight
  return (
    <div className={vertical ? 'book-diagram-link-v' : 'book-diagram-link'}>
      <Icon size={16} className="book-diagram-arrow" />
      {label && <span className="book-diagram-link-label">{label}</span>}
    </div>
  )
}

interface Step {
  title: string
  sub?: string
  label?: string
  tone?: string
}

/** Yonma-yon (mobil ekranda ustun) oqim. */
function Flow({ steps }: { steps: Step[] }) {
  return (
    <div className="book-diagram-flow">
      {steps.map((step, i) => (
        <div key={i} className="book-diagram-flow-item">
          {i > 0 && (
            <>
              <div className="hidden sm:flex"><Link label={step.label} /></div>
              <div className="flex sm:hidden"><Link label={step.label} vertical /></div>
            </>
          )}
          <Node title={step.title} sub={step.sub} tone={step.tone} />
        </div>
      ))}
    </div>
  )
}

/** Har doim ustun ko'rinishidagi raqamlangan bosqichlar. */
function Steps({ items }: { items: string[] }) {
  return (
    <div className="book-diagram-steps">
      {items.map((item, i) => (
        <div key={i} className="book-diagram-step-row">
          {i > 0 && <Link vertical />}
          <div className="book-diagram-step">
            <span className="book-diagram-step-num">{i + 1}</span>
            <span><InlineText text={item} /></span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ─── Qo'llanmadan qanday foydalaniladi: o'qish sikli ─────────────
function ReadingCycle() {
  return (
    <div className="space-y-3">
      <Steps items={[
        'Tushunchani o‘qish',
        'Qarama-qarshi atamani farqlash',
        'Misol va formulada qo‘llash',
        'Tezkor testni izohlab yechish',
      ]} />
      <p className="book-diagram-note">
        <RefreshCw size={14} className="book-diagram-arrow" />
        xato bo‘lsa — 1-bosqichga qaytiladi
      </p>
    </div>
  )
}

// ─── Ma'lumot → Axborot → Bilim ──────────────────────────────────
function DikFlow() {
  return (
    <Flow steps={[
      { title: "Ma’lumot", sub: '`27`' },
      { title: 'Axborot', sub: '“xona harorati $27^\\circ$C”', label: 'kontekst + mazmun', tone: 'teal' },
      { title: 'Bilim', sub: '“sovitishni yoqish kerak”', label: 'tajriba + qoida', tone: 'green' },
    ]} />
  )
}

// ─── Aloqa modeli: manba → kodlovchi → kanal → dekodlovchi → qabul ─
function CommModel() {
  return (
    <div className="space-y-3">
      <Flow steps={[
        { title: 'Manba' },
        { title: 'Kodlovchi', label: 'xabar', tone: 'teal' },
        { title: 'Kanal', label: 'signal', tone: 'gold' },
        { title: 'Dekodlovchi', tone: 'purple' },
        { title: 'Qabul qiluvchi', label: 'tiklangan xabar', tone: 'green' },
      ]} />
      <div className="book-diagram-notes">
        <p className="book-diagram-note book-diagram-note-warn">
          <Zap size={14} /> Shovqin kanalga ta’sir qiladi
        </p>
        <p className="book-diagram-note">
          <RefreshCw size={14} className="book-diagram-arrow" /> Qabul qiluvchidan manbaga — qayta aloqa
        </p>
      </div>
    </div>
  )
}

// ─── Shovqinli kanal (kengaytirilgan model) ──────────────────────
function CommNoise() {
  return (
    <div className="space-y-3">
      <Flow steps={[
        { title: 'Manba' },
        { title: 'Kodlovchi / uzatuvchi', tone: 'teal' },
        { title: 'Aloqa kanali', tone: 'gold' },
        { title: 'Qabul / dekodlash', tone: 'purple' },
        { title: 'Qabul qiluvchi', tone: 'green' },
      ]} />
      <div className="book-diagram-notes">
        <p className="book-diagram-note book-diagram-note-warn">
          <Zap size={14} /> Shovqin / xalaqit — aloqa kanalida
        </p>
        <p className="book-diagram-note">
          <RefreshCw size={14} className="book-diagram-arrow" /> Teskari aloqa — qabul qiluvchidan manbaga
        </p>
      </div>
    </div>
  )
}

// ─── Axborotning hayot sikli (yopiq halqa) ───────────────────────
function InfoLifecycle() {
  const stages = [
    'Yaratish / yig‘ish',
    'Qayd etish / kiritish',
    'Saqlash / tashkil etish',
    'Qidirish / olish',
    'Qayta ishlash / tahlil',
    'Uzatish / taqdim etish',
  ]
  return (
    <div className="space-y-3">
      <div className="book-diagram-cycle">
        {stages.map((stage, i) => (
          <div key={stage} className="book-diagram-cycle-item">
            <span className="book-diagram-step-num">{i + 1}</span>
            <span>{stage}</span>
          </div>
        ))}
      </div>
      <p className="book-diagram-note">
        <RefreshCw size={14} className="book-diagram-arrow" />
        oxirgi bosqichdan yana birinchisiga qaytiladi
      </p>
      <p className="book-diagram-note book-diagram-note-warn">
        <ShieldCheck size={14} />
        Himoyalash, nazorat, zaxira va yo‘q qilish barcha bosqichlarga taalluqli
      </p>
    </div>
  )
}

// ─── Axborot bilan ishlash bosqichlari (tarmoqlanuvchi) ──────────
function InfoWorkflow() {
  return (
    <div className="space-y-3">
      <Flow steps={[
        { title: 'Yaratish / yig‘ish' },
        { title: 'Tekshirish', tone: 'teal' },
        { title: 'Qayta ishlash', tone: 'gold' },
        { title: 'Saqlash', tone: 'purple' },
      ]} />
      <div className="hidden sm:flex justify-center"><Link vertical /></div>
      <Flow steps={[
        { title: 'Ulashish / qo‘llash', tone: 'coral' },
        { title: 'Yangilash', label: 'tekshirishga qaytadi' },
        { title: 'Arxiv / yo‘q qilish', label: 'yoki', tone: 'muted' },
      ]} />
    </div>
  )
}

// ─── Validatsiya → verifikatsiya → audit ─────────────────────────
function ValidationChain() {
  return (
    <Flow steps={[
      { title: 'To‘g‘ri savol va manba' },
      { title: 'Validatsiya', tone: 'teal' },
      { title: 'Verifikatsiya', tone: 'purple' },
      { title: 'Xato aniqlash va audit', tone: 'gold' },
    ]} />
  )
}

// ─── Belgi → kod nuqtasi → UTF-8 → bayt ──────────────────────────
function UnicodeUtf8() {
  return (
    <Flow steps={[
      { title: 'Belgi', sub: '`A`' },
      { title: 'Kod nuqtasi', sub: 'U+0041', tone: 'teal' },
      { title: 'Kodlash', sub: 'UTF-8', tone: 'purple' },
      { title: 'Bayt', sub: '$41_{16}$', tone: 'green' },
    ]} />
  )
}

// ─── Raqamlashtirish zanjiri ─────────────────────────────────────
function DigitizationChain() {
  return (
    <Flow steps={[
      { title: 'Real obyekt yoki mazmun' },
      { title: 'O‘lchash yoki kiritish', tone: 'teal' },
      { title: 'Namunalash', tone: 'gold' },
      { title: 'Kvantlash', tone: 'purple' },
      { title: 'Kodlash', tone: 'green' },
      { title: 'Fayl', tone: 'coral' },
    ]} />
  )
}

// ─── Formula tanlashning tezkor daraxti ──────────────────────────
function FormulaTree() {
  const branches = [
    { q: 'Xom media parametrlari', f: 'Matn: $Ki$\nRasm: $WHd$\nAudio: $f_sbct$\nVideo: $WHdft$' },
    { q: 'Tayyor bitrate', f: '$V=Rt$' },
    { q: 'Sig‘im / uzatish', f: '$t=V/R$\n$n=\\lfloor S/F\\rfloor$' },
  ]
  return (
    <div className="space-y-3">
      <div className="book-diagram-question-row">
        <span className="book-diagram-question">Nima berilgan?</span>
      </div>
      <div className="book-diagram-leaves">
        {branches.map(branch => (
          <div key={branch.q} className="book-diagram-leaf">
            <span className="book-diagram-leaf-q">{branch.q}</span>
            <span className="book-diagram-leaf-f">
              {branch.f.split('\n').map((line, i) => (
                <span key={i} className="block"><InlineText text={line} /></span>
              ))}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}


/**
 * TASK-220 — V2 manbadagi uchta haqiqiy TikZ sxemasining mobilga mos
 * semantik muqobillari. N001: frame/IP path, N002: star/ring, N003: LAN.
 */
function NetworkPacketPath() {
  return <Flow steps={[
    { title: 'Kompyuter A' },
    { title: 'Switch', label: 'MAC freym', tone: 'teal' },
    { title: 'Router' },
    { title: 'Boshqa tarmoq', label: 'IP paket' },
  ]} />
}

function NetworkTopologies() {
  const center = {x: 120,y: 95}
  const nodes = Array.from({length:5},(_,i)=>{
    const angle=(i*72-90)*Math.PI/180
    return {x:center.x+67*Math.cos(angle),y:center.y+67*Math.sin(angle)}
  })
  const ring = Array.from({length:5},(_,i)=>{
    const angle=(i*72-90)*Math.PI/180
    return {x:375+67*Math.cos(angle),y:95+67*Math.sin(angle)}
  })
  return (
    <svg viewBox="0 0 500 215" className="w-full max-w-2xl" role="img"
      aria-label="Yulduz topologiyasi: markaziy switchga beshta tugun ulanadi; halqa topologiyasi: beshta tugun yopiq zanjir bo‘lib ulanadi">
      <g stroke="currentColor" strokeWidth="2" opacity=".65">
        {nodes.map((p,i)=><line key={i} x1={center.x} y1={center.y} x2={p.x} y2={p.y}/>)}
        {ring.map((p,i)=><line key={i} x1={p.x} y1={p.y} x2={ring[(i+1)%5].x} y2={ring[(i+1)%5].y}/>)}
      </g>
      {nodes.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="13" fill="#dbeafe" stroke="#2563eb" strokeWidth="2"/>)}
      <circle cx={center.x} cy={center.y} r="17" fill="#99f6e4" stroke="#0f766e" strokeWidth="2"/>
      <text x={center.x} y={center.y+5} textAnchor="middle" fontSize="15">S</text>
      {ring.map((p,i)=><circle key={i} cx={p.x} cy={p.y} r="13" fill="#dbeafe" stroke="#0f766e" strokeWidth="2"/>)}
      <g fill="currentColor" fontSize="14" textAnchor="middle">
        <text x="120" y="195">Yulduz: markaziy switch</text>
        <text x="375" y="195">Halqa: yopiq zanjir</text>
      </g>
    </svg>
  )
}

function NetworkSchoolLan() {
  const center = {x:270,y:120}
  const devices=[
    {x:85,y:30,name:'PC-A'},
    {x:270,y:30,name:'Server'},
    {x:455,y:30,name:'PC-B'},
    {x:120,y:205,name:'Printer'},
    {x:420,y:205,name:'Router'},
  ]
  return (
    <svg viewBox="0 0 540 255" className="w-full max-w-2xl" role="img"
      aria-label="Maktab lokal tarmog‘i: PC-A, server, PC-B, printer va router markaziy switchga ulanadi">
      <g stroke="currentColor" opacity=".65" strokeWidth="2">
        {devices.map((p,i)=><line key={i} x1={center.x} y1={center.y} x2={p.x} y2={p.y}/>)}
      </g>
      <rect x="220" y="100" width="100" height="40" rx="9" fill="#99f6e4" stroke="#0f766e" strokeWidth="2"/>
      <text x="270" y="124" textAnchor="middle" fontSize="16">Switch</text>
      {devices.map((p,i)=><g key={i}>
        <rect x={p.x-42} y={p.y-16} width="84" height="32" rx="7" fill="#dbeafe" stroke="#2563eb" strokeWidth="2"/>
        <text x={p.x} y={p.y+5} textAnchor="middle" fontSize="13">{p.name}</text>
      </g>)}
    </svg>
  )
}

export const BOOK_DIAGRAMS: Record<string, () => JSX.Element> = {
  NET01: NetworkPacketPath,
  NET02: NetworkTopologies,
  NET03: NetworkSchoolLan,
  'reading-cycle': ReadingCycle,
  'dik-flow': DikFlow,
  'comm-model': CommModel,
  'comm-noise': CommNoise,
  'info-lifecycle': InfoLifecycle,
  'info-workflow': InfoWorkflow,
  'validation-chain': ValidationChain,
  'unicode-utf8': UnicodeUtf8,
  'digitization-chain': DigitizationChain,
  'formula-tree': FormulaTree,
}
