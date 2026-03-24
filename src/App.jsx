import { useState, useEffect, useRef } from "react";
import {
  AreaChart, Area, LineChart, Line, ComposedChart,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine, Bar
} from "recharts";
import {
  Globe, Cpu, Bot, TrendingUp, Package, X, Send,
  Download, Activity, Plane, Database, FileText,
  Mail, CheckCircle, Clock, AlertCircle, ChevronRight,
  Zap, User, Radio, ArrowUpRight, ArrowDownRight,
  Anchor, Navigation, Eye
} from "lucide-react";

const C = {
  bg:"#020C18", surface:"#060F1E", card:"#091828", elevated:"#0C2038",
  border:"rgba(0,190,255,0.12)", borderHi:"rgba(0,205,255,0.35)",
  cyan:"#00C8FF", orange:"#FF7A2E", green:"#00FF85",
  yellow:"#FFD600", red:"#FF4566", purple:"#A855F7",
  textPrimary:"#C8E4F4", textSecondary:"#3C6882", textMuted:"#1A3550",
};
const raj={fontFamily:"'Rajdhani',sans-serif"};
const mono={fontFamily:"'JetBrains Mono',monospace"};

const GS = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');
    *{box-sizing:border-box;margin:0;padding:0}
    ::-webkit-scrollbar{width:3px;height:3px}
    ::-webkit-scrollbar-track{background:#060F1E}
    ::-webkit-scrollbar-thumb{background:rgba(0,190,255,0.25);border-radius:2px}
    @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
    @keyframes fadeUp{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
    @keyframes dot{0%,80%,100%{transform:scale(0);opacity:.5}40%{transform:scale(1);opacity:1}}
    @keyframes gpsBlink{0%,100%{opacity:1}50%{opacity:0.15}}
    @keyframes catFlash{0%,100%{background:rgba(255,69,102,0.08);border-color:rgba(255,69,102,0.3)}50%{background:rgba(255,69,102,0.22);border-color:rgba(255,69,102,0.7)}}
    @keyframes lidarB{0%,100%{opacity:0.1}50%{opacity:0.5}}
    @keyframes rFlow{from{stroke-dashoffset:100}to{stroke-dashoffset:0}}
    .fu{animation:fadeUp .35s ease-out}
    .live{animation:pulse 2s ease-in-out infinite}
    .d1{display:inline-block;width:7px;height:7px;border-radius:50%;background:#00C8FF;animation:dot 1.4s ease-in-out infinite}
    .d2{display:inline-block;width:7px;height:7px;border-radius:50%;background:#00C8FF;animation:dot 1.4s ease-in-out .2s infinite}
    .d3{display:inline-block;width:7px;height:7px;border-radius:50%;background:#00C8FF;animation:dot 1.4s ease-in-out .4s infinite}
    .gj{animation:gpsBlink 0.7s ease-in-out infinite}
    .cw{animation:catFlash 1.1s ease-in-out infinite}
    .nb{width:100%;display:flex;align-items:center;gap:10px;padding:10px 16px;background:none;border:none;border-right:2px solid transparent;cursor:pointer;text-align:left;transition:all .15s}
    .nb:hover{background:rgba(0,200,255,0.06)}
    .nb.act{background:rgba(0,200,255,0.1);border-right:2px solid #00C8FF}
    .ab{cursor:pointer;transition:all .15s;border:1px solid rgba(0,200,255,0.3);background:rgba(0,200,255,0.06);color:#00C8FF;padding:7px 16px;border-radius:4px;font-family:'Rajdhani',sans-serif;font-size:14px;font-weight:700;letter-spacing:.06em}
    .ab:hover{background:rgba(0,200,255,0.15);border-color:#00C8FF;box-shadow:0 0 14px rgba(0,200,255,0.2)}
    .ab.or{border-color:rgba(255,122,46,.35);background:rgba(255,122,46,.06);color:#FF7A2E}
    .ab.or:hover{background:rgba(255,122,46,.16);border-color:#FF7A2E}
    .ci{flex:1;background:rgba(0,200,255,0.04);border:1px solid rgba(0,190,255,0.2);border-radius:6px;padding:8px 12px;color:#C8E4F4;font-family:'Rajdhani',sans-serif;font-size:14px;outline:none}
    .ci:focus{border-color:rgba(0,200,255,0.5)}
    .ci::placeholder{color:rgba(0,200,255,0.3)}
    .tr{border-bottom:1px solid rgba(0,190,255,0.12);transition:background .1s}
    .tr:hover{background:rgba(0,200,255,0.04)}
    .sb{display:flex;align-items:center;gap:6px;padding:6px 14px;border-radius:4px;cursor:pointer;font-family:'Rajdhani',sans-serif;font-weight:600;font-size:13px;transition:all .15s}
    .tb{cursor:pointer;padding:6px 16px;border-radius:4px;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:13px;transition:all .15s;border:none}
  `}</style>
);

/* DATA */
const ingD=Array.from({length:24},(_,h)=>({t:`${String(h).padStart(2,"0")}:00`,ais:Math.floor(18000+Math.sin(h*.3)*6000+h*180),wx:Math.floor(12000+Math.cos(h*.4)*3800+h*90),acars:Math.floor(8000+Math.sin(h*.5+1)*2800+h*60)}));
const routD=Array.from({length:30},(_,d)=>({d:`D${d+1}`,planned:Math.floor(88+Math.sin(d*.2)*4),actual:Math.floor(82+Math.sin(d*.25)*7),optimized:Math.floor(93+Math.sin(d*.15)*3)}));
const salesD=[{m:"Jan",copper:145,iron:89,lng:67,bdi:320},{m:"Feb",copper:152,iron:92,lng:71,bdi:335},{m:"Mar",copper:148,iron:88,lng:69,bdi:328},{m:"Apr",copper:161,iron:95,lng:74,bdi:355},{m:"May",copper:158,iron:97,lng:78,bdi:362},{m:"Jun",copper:172,iron:103,lng:82,bdi:389},{m:"Jul",copper:168,iron:99,lng:80,bdi:378},{m:"Aug",copper:175,iron:107,lng:85,bdi:402},{m:"Sep",copper:182,iron:112,lng:89,bdi:421},{m:"Oct",copper:178,iron:108,lng:87,bdi:415},{m:"Nov",copper:190,iron:118,lng:93,bdi:438},{m:"Dec",copper:195,iron:122,lng:97,bdi:452}];
const _s=(n)=>((n*1234567+891011)%1000000)/1000000;
const SWARM=Array.from({length:70},(_,i)=>({x1:_s(i*7)*80,y1:15+_s(i*11)*170,cx1:80+_s(i*13)*200,cy1:_s(i*17)*190-40,cx2:280+_s(i*19)*200,cy2:_s(i*23)*190-40,x2:520+_s(i*29)*80,y2:15+_s(i*31)*170,dur:(1.8+_s(i*37)*3.5).toFixed(2),delay:(-_s(i*41)*5).toFixed(2),dashLen:(4+_s(i*43)*7).toFixed(1),type:i<5?"opt":i<8?"jet":i<11?"ocean":"norm",alpha:(i<5?0.9:i<11?0.65:0.08+_s(i*47)*0.22).toFixed(2)}));



/* SHARED */
const Card=({children,style={}})=>(<div style={{background:C.card,border:`1px solid ${C.border}`,borderRadius:6,...style}}>{children}</div>);
const ST=({icon:I,title,sub,accent=C.cyan})=>(<div style={{display:"flex",alignItems:"center",gap:10,marginBottom:12}}>{I&&<I size={14} color={accent}/>}<div><div style={{...raj,fontWeight:700,fontSize:13,color:accent,letterSpacing:"0.09em",textTransform:"uppercase"}}>{title}</div>{sub&&<div style={{...mono,fontSize:9,color:C.textSecondary,marginTop:1}}>{sub}</div>}</div></div>);
const Met=({label,value,change,unit=""})=>(<div style={{background:C.elevated,border:`1px solid ${C.border}`,borderRadius:6,padding:"11px 14px"}}><div style={{...mono,fontSize:9,color:C.textSecondary,letterSpacing:"0.1em",textTransform:"uppercase",marginBottom:5}}>{label}</div><div style={{display:"flex",alignItems:"baseline",gap:4}}><span style={{...mono,fontSize:20,fontWeight:500,color:C.textPrimary}}>{value}</span>{unit&&<span style={{fontSize:11,color:C.textSecondary}}>{unit}</span>}</div>{change!==undefined&&<div style={{display:"flex",alignItems:"center",gap:3,marginTop:3}}>{change>=0?<ArrowUpRight size={11} color={C.green}/>:<ArrowDownRight size={11} color={C.red}/>}<span style={{...mono,fontSize:10,color:change>=0?C.green:C.red}}>{change>=0?"+":""}{change}%</span></div>}</div>);
const SDot=({s="active"})=>{const col=s==="active"?C.green:s==="warning"?C.yellow:C.red;return <span className={s==="active"?"live":""} style={{display:"inline-block",width:7,height:7,borderRadius:"50%",background:col,flexShrink:0}}/>;};
const Tag=({children,color=C.cyan,bg="rgba(0,200,255,0.1)"})=>(<span style={{...mono,fontSize:10,color,background:bg,padding:"2px 7px",borderRadius:3}}>{children}</span>);
const CT=({active,payload,label})=>{if(!active||!payload?.length)return null;return(<div style={{background:"#0A1A2E",border:`1px solid ${C.borderHi}`,borderRadius:4,padding:"7px 11px"}}><div style={{...mono,fontSize:10,color:C.textSecondary,marginBottom:3}}>{label}</div>{payload.map((p,i)=>(<div key={i} style={{...mono,fontSize:11,color:p.color,marginTop:2}}>{p.name}: <span style={{color:C.textPrimary}}>{typeof p.value==="number"?p.value.toLocaleString():p.value}</span></div>))}</div>);};

/* GPS PHASES */
const GPS_PHASES=[
  {label:"NOMINAL",sub:"Full GPS constellation lock",gs:"active",gc:"STANDBY",col:C.green},
  {label:"INTERFERENCE",sub:"Signal anomaly on 2 satellites",gs:"warning",gc:"MONITORING",col:C.yellow},
  {label:"GPS JAMMED/HACKED",sub:"Spoofing attack — GPS unreliable",gs:"jammed",gc:"ACTIVATING",col:C.red},
  {label:"QUANTUM GRAVITY LOCK",sub:"Autonomous via gravity gradient",gs:"jammed",gc:"LOCKED",col:C.cyan},
];
const GPS_SATS=[{id:"GPS-IIF-14",az:52,el:68},{id:"GPS-III-4",az:135,el:42},{id:"GPS-IIF-9",az:224,el:57},{id:"GPS-III-7",az:318,el:35}];

const QNavMod=()=>{
  const [ph,setPh]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setPh(p=>(p+1)%4),3000);return()=>clearInterval(t);},[]);
  const P=GPS_PHASES[ph];
  const cx=110,cy=95,r=68;
  return(
    <Card style={{padding:16,marginBottom:14}}>
      <ST icon={Navigation} title="Quantum Gravity Navigation — The Inner Compass" sub="Sub-8cm accuracy · GPS-independent positioning"/>
      <div style={{display:"grid",gridTemplateColumns:"220px 1fr",gap:16,alignItems:"start"}}>
        <svg viewBox="0 0 220 190" width="100%" style={{background:C.elevated,borderRadius:5,border:`1px solid ${C.border}`}}>
          {[25,42,58,72].map(rr=><circle key={rr} cx={cx} cy={cy} r={rr} fill="none" stroke="rgba(0,200,255,0.07)" strokeWidth="0.5"/>)}
          <line x1={cx-80} y1={cy} x2={cx+80} y2={cy} stroke="rgba(0,200,255,0.06)" strokeWidth="0.5"/>
          <line x1={cx} y1={10} x2={cx} y2={180} stroke="rgba(0,200,255,0.06)" strokeWidth="0.5"/>
          {GPS_SATS.map((s,i)=>{const ang=(s.az-90)*Math.PI/180;const d=52+s.el*.35;const sx=cx+d*Math.cos(ang),sy=cy+d*Math.sin(ang);const isJ=P.gs==="jammed"||(P.gs==="warning"&&i<2);const isW=P.gs==="warning"&&i>=2;const col=isJ?C.red:isW?C.yellow:C.green;return(<g key={s.id} className={isJ?"gj":""}><line x1={cx} y1={cy} x2={sx} y2={sy} stroke={col} strokeWidth="0.6" opacity="0.4"/><rect x={sx-8} y={sy-5} width={16} height={10} rx="2" fill={isJ?"rgba(255,69,102,0.15)":isW?"rgba(255,214,0,0.12)":"rgba(0,255,133,0.1)"} stroke={col} strokeWidth="0.8"/><text x={sx} y={sy+1.5} textAnchor="middle" dominantBaseline="middle" fill={col} fontSize="4.5" fontFamily="JetBrains Mono,monospace">SAT</text>{isJ&&<text x={sx} y={sy+13} textAnchor="middle" fill={C.red} fontSize="4" fontFamily="JetBrains Mono,monospace">JAM</text>}</g>);})}
          <circle cx={cx} cy={cy} r={12} fill={P.gc==="LOCKED"?"rgba(0,200,255,0.12)":"rgba(0,255,133,0.06)"} stroke={P.gc==="LOCKED"?C.cyan:C.green} strokeWidth="1.2"/>
          <circle cx={cx} cy={cy} r={3.5} fill={P.gc==="LOCKED"?C.cyan:C.green}/>
          {P.gc==="LOCKED"&&(<><circle cx={cx} cy={cy} r={18} fill="none" stroke={C.cyan} strokeWidth="0.5" strokeDasharray="3 3" opacity="0.5"><animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`360 ${cx} ${cy}`} dur="7s" repeatCount="indefinite"/></circle><circle cx={cx} cy={cy} r={28} fill="none" stroke={C.cyan} strokeWidth="0.3" strokeDasharray="2 5" opacity="0.3"><animateTransform attributeName="transform" type="rotate" from={`360 ${cx} ${cy}`} to={`0 ${cx} ${cy}`} dur="11s" repeatCount="indefinite"/></circle></>)}
          <rect x="3" y="168" width="106" height="18" rx="2" fill="rgba(0,0,0,0.5)" stroke="rgba(0,200,255,0.15)" strokeWidth="0.5"/>
          <text x="8" y="175" fill={C.textSecondary} fontSize="4.5" fontFamily="JetBrains Mono,monospace">POSITION</text>
          <text x="8" y="182" fill={P.gc==="LOCKED"?C.cyan:C.green} fontSize="5" fontFamily="JetBrains Mono,monospace">1.3521°N 103.8198°E</text>
          <rect x="112" y="168" width="104" height="18" rx="2" fill="rgba(0,0,0,0.5)" stroke="rgba(0,200,255,0.15)" strokeWidth="0.5"/>
          <text x="117" y="175" fill={C.textSecondary} fontSize="4.5" fontFamily="JetBrains Mono,monospace">DRIFT</text>
          <text x="117" y="182" fill={C.green} fontSize="5" fontFamily="JetBrains Mono,monospace">&lt;8cm · 99.97% conf.</text>
        </svg>
        <div>
          <div style={{padding:"8px 12px",borderRadius:4,border:`1px solid ${C.border}`,background:ph>=2?"rgba(255,69,102,0.05)":ph===1?"rgba(255,214,0,0.04)":"rgba(0,255,133,0.03)",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:3}}><span className={ph===2?"gj":""} style={{width:7,height:7,borderRadius:"50%",background:P.col,display:"inline-block"}}/><span style={{...raj,fontWeight:700,fontSize:14,color:P.col}}>{P.label}</span></div>
            <div style={{...mono,fontSize:10,color:C.textSecondary}}>{P.sub}</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:7,marginBottom:10}}>
            {GPS_SATS.map((s,i)=>{const isJ=P.gs==="jammed"||(P.gs==="warning"&&i<2);const isW=P.gs==="warning"&&i>=2;return(<div key={s.id} style={{background:C.elevated,borderRadius:3,padding:"6px 9px",border:`1px solid ${isJ?C.red:isW?C.yellow:C.border}`}} className={isJ?"gj":""}><div style={{...mono,fontSize:9,color:C.textSecondary,marginBottom:1}}>{s.id}</div><div style={{...mono,fontSize:10,color:isJ?C.red:isW?C.yellow:C.green}}>{isJ?"◼ JAMMED":isW?"▲ INTERFERENCE":"● OK"}</div></div>);})}
          </div>
          <div style={{background:C.elevated,borderRadius:4,padding:"9px 12px",border:`1px solid ${ph>=3?C.cyan:C.border}`}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}><span style={{...mono,fontSize:10,color:C.textSecondary}}>QUANTUM GRAVITY SENSOR</span><Tag color={ph>=3?C.cyan:ph>=2?C.orange:C.textSecondary} bg={ph>=3?"rgba(0,200,255,0.12)":ph>=2?"rgba(255,122,46,0.1)":"transparent"}>{P.gc}</Tag></div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:5}}>
              {[["Conf.","99.97%",C.green],["Layers","147",C.cyan],["Drift","<8cm",C.green]].map(([k,v,c])=>(<div key={k}><div style={{...mono,fontSize:8,color:C.textMuted}}>{k}</div><div style={{...raj,fontWeight:700,fontSize:14,color:c}}>{v}</div></div>))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

/* SWARM */
const QSwarmMod=()=>{
  const [cnt,setCnt]=useState(312847);
  const [opt,setOpt]=useState(17);
  useEffect(()=>{const t=setInterval(()=>{setCnt(c=>{const n=c+Math.floor(Math.random()*9000+4000);if(n>=1000000){setOpt(v=>v+1);return 312847;}return n;});},100);return()=>clearInterval(t);},[]);
  const pct=((cnt/1000000)*100).toFixed(1);
  const gc=(tp)=>tp==="opt"?C.cyan:tp==="jet"?"rgba(255,214,0,0.85)":tp==="ocean"?"rgba(100,220,255,0.7)":"rgba(0,80,160,0.18)";
  const gw=(tp)=>tp==="opt"?2.2:tp==="jet"?1.5:tp==="ocean"?1.5:0.6;
  return(
    <Card style={{padding:16,marginBottom:14}}>
      <ST icon={Cpu} title="Quantum Swarm — The Million-Path Brain" sub="Supercomputer evaluating 1,000,000 routes · Jet stream & ocean current assist"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8,marginBottom:12}}>
        {[[`${cnt.toLocaleString()}`,"Routes","/ 1M",C.cyan],[`${opt}`,"Optimal","this cycle",C.green],["3 active","Jet Streams","FL340-FL400",C.yellow],["$38K","Fuel Saved","per voyage",C.orange]].map(([v,l,s,c],i)=>(<div key={i} style={{background:C.elevated,borderRadius:4,padding:"9px 11px",border:`1px solid ${C.border}`}}><div style={{...mono,fontSize:8,color:C.textSecondary,letterSpacing:"0.07em",textTransform:"uppercase",marginBottom:3}}>{l}</div><div style={{...mono,fontSize:14,fontWeight:500,color:c}}>{v}</div><div style={{...mono,fontSize:8,color:C.textMuted,marginTop:1}}>{s}</div></div>))}
      </div>
      <div style={{marginBottom:10}}>
        <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}><span style={{...mono,fontSize:9,color:C.textSecondary}}>SWARM PROGRESS</span><span style={{...mono,fontSize:10,color:C.cyan}}>{pct}%</span></div>
        <div style={{height:4,background:C.elevated,borderRadius:2,overflow:"hidden"}}><div style={{height:"100%",background:`linear-gradient(90deg,${C.cyan},rgba(168,85,247,0.8))`,borderRadius:2,width:`${pct}%`,transition:"width .1s"}}/></div>
      </div>
      <div style={{borderRadius:5,overflow:"hidden",border:`1px solid ${C.border}`}}>
        <svg viewBox="0 0 600 180" width="100%" style={{display:"block",background:C.elevated}}>
          <style>{SWARM.map((r,i)=>`.rp${i}{animation:rFlow ${r.dur}s linear ${r.delay}s infinite}`).join('')}</style>
          {Array.from({length:16},(_,i)=><line key={`v${i}`} x1={i*40} y1={0} x2={i*40} y2={180} stroke="rgba(0,150,200,0.04)" strokeWidth="0.5"/>)}
          {Array.from({length:5},(_,i)=><line key={`h${i}`} x1={0} y1={i*40} x2={600} y2={i*40} stroke="rgba(0,150,200,0.04)" strokeWidth="0.5"/>)}
          {SWARM.map((r,i)=>(<path key={i} d={`M ${r.x1},${r.y1} C ${r.cx1},${r.cy1} ${r.cx2},${r.cy2} ${r.x2},${r.y2}`} fill="none" stroke={gc(r.type)} strokeWidth={gw(r.type)} opacity={r.alpha} pathLength="100" strokeDasharray={r.type==="opt"?"none":`${r.dashLen} ${100-r.dashLen}`} className={`rp${i}`}/>))}
          <rect x="6" y="6" width="172" height="46" rx="3" fill="rgba(2,12,24,0.88)" stroke="rgba(0,200,255,0.15)" strokeWidth="0.5"/>
          <circle cx="15" cy="19" r="3.5" fill={C.cyan}/><text x="23" y="22" fill={C.textSecondary} fontSize="7.5" fontFamily="JetBrains Mono,monospace">Optimal routes ({opt} found)</text>
          <line x1="10" y1="33" x2="21" y2="33" stroke={C.yellow} strokeWidth="1.5" strokeDasharray="3 2"/><text x="23" y="36" fill={C.textSecondary} fontSize="7.5" fontFamily="JetBrains Mono,monospace">Jet stream corridor</text>
          <line x1="10" y1="46" x2="21" y2="46" stroke="rgba(100,220,255,0.7)" strokeWidth="1.5" strokeDasharray="3 2"/><text x="23" y="49" fill={C.textSecondary} fontSize="7.5" fontFamily="JetBrains Mono,monospace">Ocean current assist</text>
          <text x="300" y="14" textAnchor="middle" fill="rgba(255,214,0,0.6)" fontSize="7" fontFamily="JetBrains Mono,monospace">— JET STREAM FL380 +185KT —</text>
          <text x="300" y="174" textAnchor="middle" fill="rgba(100,220,255,0.55)" fontSize="7" fontFamily="JetBrains Mono,monospace">— KUROSHIO CURRENT +2.1KT FREE PUSH —</text>
        </svg>
      </div>
    </Card>
  );
};

/* EAGLE EYE */
const BLOBS=[{cx:90,cy:76,r:13,col:"rgba(0,255,133,0.7)",az:"042°",st:"Cat-2",int:"HIGH"},{cx:138,cy:114,r:9,col:"rgba(0,200,100,0.55)",az:"118°",st:"Cat-1",int:"MED"},{cx:56,cy:130,r:7,col:"rgba(100,255,180,0.45)",az:"231°",st:"Cat-1",int:"LOW"},{cx:168,cy:72,r:10,col:"rgba(0,255,150,0.6)",az:"337°",st:"Cat-1",int:"MED"},{cx:110,cy:148,r:6,col:"rgba(0,200,120,0.4)",az:"189°",st:"Calm",int:"LOW"}];
const EagleMod=()=>{
  const [view,setView]=useState("maritime");
  const [phase,setPhase]=useState("clear");
  const [cd,setCd]=useState(null);
  const [ang,setAng]=useState(0);
  useEffect(()=>{const t=setInterval(()=>setAng(a=>(a+1.8)%360),16);return()=>clearInterval(t);},[]);
  useEffect(()=>{const t=setTimeout(()=>{setPhase("detected");setCd(30);},2500);return()=>clearTimeout(t);},[]);
  useEffect(()=>{
    if(cd===null)return;
    if(cd<=0){setPhase("complete");const t=setTimeout(()=>{setPhase("adjusting");setTimeout(()=>{setPhase("clear");setCd(null);setTimeout(()=>{setPhase("detected");setCd(30);},8000);},3500);},1500);return()=>clearTimeout(t);}
    const t=setTimeout(()=>setCd(c=>c-1),1000);return()=>clearTimeout(t);
  },[cd]);
  const cx=115,cy=115,r=85;
  const sr=(ang-90)*Math.PI/180;
  const sx=cx+r*Math.cos(sr),sy=cy+r*Math.sin(sr);
  return(
    <Card style={{padding:16,marginBottom:14}}>
      <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:12}}>
        <ST icon={Eye} title="Eagle Eye — Advanced Sensing" sub="Maritime bioluminescence + Aviation LiDAR CAT"/>
        <div style={{display:"flex",background:C.elevated,borderRadius:4,padding:3,gap:3,border:`1px solid ${C.border}`}}>
          {[["maritime","🌊 Maritime"],["aviation","✈️ Aviation"]].map(([id,lb])=>(<button key={id} className="tb" onClick={()=>setView(id)} style={{color:view===id?C.bg:C.textSecondary,background:view===id?(id==="maritime"?C.green:C.cyan):"transparent",padding:"4px 12px",fontSize:12}}>{lb}</button>))}
        </div>
      </div>
      {view==="maritime"?(
        <div style={{display:"grid",gridTemplateColumns:"230px 1fr",gap:16,alignItems:"start"}}>
          <svg viewBox="0 0 230 230" width="100%" style={{background:C.elevated,borderRadius:5,border:`1px solid ${C.border}`}}>
            {[22,43,63,83].map(rr=><circle key={rr} cx={cx} cy={cy} r={rr} fill="none" stroke="rgba(0,255,133,0.1)" strokeWidth="0.7"/>)}
            <line x1={cx-88} y1={cy} x2={cx+88} y2={cy} stroke="rgba(0,255,133,0.07)" strokeWidth="0.5"/>
            <line x1={cx} y1={cx-88} x2={cx} y2={cx+88} stroke="rgba(0,255,133,0.07)" strokeWidth="0.5"/>
            {[-18,-12,-6,0].map((o,i)=>{const a=((ang+o-90)%360)*Math.PI/180;const lx=cx+r*Math.cos(a),ly=cy+r*Math.sin(a);return <line key={i} x1={cx} y1={cy} x2={lx} y2={ly} stroke={C.green} strokeWidth="1.5" opacity={(i+1)*0.14}/>;} )}
            <line x1={cx} y1={cy} x2={sx} y2={sy} stroke={C.green} strokeWidth="2" opacity="0.9"/>
            {BLOBS.map((b,i)=>(<g key={i}><circle cx={b.cx} cy={b.cy} r={b.r*1.8} fill={b.col} opacity="0.1"/><circle cx={b.cx} cy={b.cy} r={b.r} fill={b.col} opacity="0.55"><animate attributeName="r" values={`${b.r};${b.r*1.4};${b.r}`} dur={`${1.4+i*.35}s`} repeatCount="indefinite"/><animate attributeName="opacity" values="0.35;0.8;0.35" dur={`${1.4+i*.35}s`} repeatCount="indefinite"/></circle><circle cx={b.cx} cy={b.cy} r="2" fill="white" opacity="0.55"/></g>))}
            <circle cx={cx} cy={cy} r="4" fill={C.green}/><circle cx={cx} cy={cy} r="2" fill="white"/>
            <text x={cx} y={cx+103} textAnchor="middle" fill="rgba(0,255,133,0.45)" fontSize="5.5" fontFamily="JetBrains Mono,monospace">BIOLUMINESCENCE RADAR</text>
          </svg>
          <div>
            <div style={{...mono,fontSize:9,color:C.textSecondary,marginBottom:8,letterSpacing:"0.08em"}}>DETECTED EVENTS</div>
            {BLOBS.map((b,i)=>(<div key={i} style={{display:"flex",alignItems:"center",gap:10,padding:"7px 0",borderBottom:`1px solid ${C.border}`}}><div style={{width:9,height:9,borderRadius:"50%",background:b.col,flexShrink:0}}/><div style={{flex:1}}><div style={{...raj,fontWeight:700,fontSize:12,color:C.textPrimary}}>Bearing {b.az} · {b.st}</div><div style={{...mono,fontSize:9,color:C.textSecondary}}>Dinoflagellate plume detected</div></div><Tag color={b.int==="HIGH"?C.orange:b.int==="MED"?C.yellow:C.textSecondary} bg={b.int==="HIGH"?"rgba(255,122,46,0.1)":b.int==="MED"?"rgba(255,214,0,0.08)":"transparent"}>{b.int}</Tag></div>))}
            <div style={{marginTop:10,padding:"9px 12px",background:C.elevated,borderRadius:4,border:`1px solid ${C.border}`}}><div style={{...mono,fontSize:9,color:C.textSecondary,marginBottom:5}}>NAVIGATOR RECOMMENDATION</div><div style={{...raj,fontSize:13,color:C.textPrimary,lineHeight:1.6}}>8° starboard deviation recommended. Two low-resistance upwelling corridors mapped.</div></div>
          </div>
        </div>
      ):(
        <div>
          {phase==="detected"&&<div className="cw" style={{padding:"10px 16px",borderRadius:4,border:"1px solid",marginBottom:12,display:"flex",alignItems:"center",justifyContent:"space-between"}}><div style={{display:"flex",alignItems:"center",gap:9}}><AlertCircle size={16} color={C.red}/><div><div style={{...raj,fontWeight:700,fontSize:14,color:C.red}}>⚡ CLEAR AIR TURBULENCE — 22 MILES AHEAD</div><div style={{...mono,fontSize:10,color:C.textSecondary}}>FL360 · EDR 0.35 m²/³s⁻¹ MOD · 8nm width · Jet shear boundary</div></div></div><div style={{textAlign:"right",flexShrink:0}}><div style={{...mono,fontSize:9,color:C.textSecondary}}>AUTO ADJUST IN</div><div style={{...mono,fontSize:26,fontWeight:500,color:C.red}}>{String(Math.floor((cd||0)/60)).padStart(2,"0")}:{String((cd||0)%60).padStart(2,"0")}</div></div></div>}
          {phase==="complete"&&<div style={{padding:"9px 16px",borderRadius:4,border:`1px solid ${C.green}`,background:"rgba(0,255,133,0.06)",marginBottom:12,display:"flex",alignItems:"center",gap:9}}><CheckCircle size={14} color={C.green}/><span style={{...raj,fontWeight:700,fontSize:13,color:C.green}}>ALTITUDE ADJUSTMENT COMPLETE — FL380 · Turbulence avoided · ETA +3 min</span></div>}
          {phase==="adjusting"&&<div style={{padding:"9px 16px",borderRadius:4,border:`1px solid ${C.cyan}`,background:"rgba(0,200,255,0.06)",marginBottom:12,display:"flex",alignItems:"center",gap:9}}><Navigation size={14} color={C.cyan}/><span style={{...raj,fontWeight:700,fontSize:13,color:C.cyan}}>AUTOPILOT — Climbing FL360 → FL380 · 1,800 fpm · Seatbelt sign ON</span></div>}
          <div style={{display:"grid",gridTemplateColumns:"1fr 220px",gap:16}}>
            <div style={{borderRadius:5,overflow:"hidden",border:`1px solid ${C.border}`}}>
              <svg viewBox="0 0 440 185" width="100%" style={{display:"block",background:C.elevated}}>
                <rect x="12" y="88" width="26" height="10" rx="2" fill="rgba(0,200,255,0.15)" stroke={C.cyan} strokeWidth="0.7"/>
                <polygon points="38,93 52,90 38,88" fill={C.cyan} opacity="0.5"/>
                <line x1="23" y1="88" x2="23" y2="80" stroke={C.cyan} strokeWidth="0.7" opacity="0.5"/>
                <line x1="23" y1="98" x2="23" y2="106" stroke={C.cyan} strokeWidth="0.7" opacity="0.5"/>
                <polygon points="52,68 418,8 418,178 52,120" fill="rgba(0,200,255,0.04)" stroke="rgba(0,200,255,0.18)" strokeWidth="0.5"/>
                {Array.from({length:16},(_,i)=><line key={i} x1="54" y1={70+i*3.2} x2="414" y2={10+i*9.4} stroke={C.cyan} strokeWidth="0.4" opacity="0.18" style={{animation:`lidarB ${1+i*.07}s ease-in-out ${i*.05}s infinite`}}/>)}
                {(phase==="detected"||phase==="adjusting")&&(<g><polygon points="305,44 374,16 374,90 305,106" fill="rgba(255,69,102,0.15)" stroke={C.red} strokeWidth="0.8" strokeDasharray="3 2"/><polygon points="305,106 374,90 374,176 305,148" fill="rgba(255,122,46,0.1)" stroke={C.orange} strokeWidth="0.8" strokeDasharray="3 2"/><text x="340" y="76" textAnchor="middle" fill={C.red} fontSize="7" fontFamily="JetBrains Mono,monospace" fontWeight="500">CAT MOD</text><text x="340" y="125" textAnchor="middle" fill={C.orange} fontSize="7" fontFamily="JetBrains Mono,monospace">SHEAR</text></g>)}
                {[5,10,15,20,25].map((n,i)=>{const x=54+(414-54)*((i+1)/6);return(<g key={n}><line x1={x} y1={0} x2={x} y2={185} stroke="rgba(0,200,255,0.07)" strokeWidth="0.5" strokeDasharray="2 4"/><text x={x} y="181" textAnchor="middle" fill="rgba(0,200,255,0.35)" fontSize="6.5" fontFamily="JetBrains Mono,monospace">{n}nm</text></g>);})}
                <text x="414" y="94" textAnchor="end" fill={C.cyan} fontSize="6.5" fontFamily="JetBrains Mono,monospace">FL360 ◀</text>
                <text x="228" y="12" textAnchor="middle" fill="rgba(0,200,255,0.3)" fontSize="7" fontFamily="JetBrains Mono,monospace">LiDAR CAT RADAR — SQ322 FORWARD VIEW</text>
              </svg>
            </div>
            <div>
              <div style={{...mono,fontSize:9,color:C.textSecondary,marginBottom:8}}>CAT PARAMETERS</div>
              {[["Type","Clear Air Turbulence"],["Altitude","FL340-FL370"],["EDR","0.35 m²/³s⁻¹ MOD"],["Distance","22 nm ahead"],["Width","~8 nm"],["Confidence","94.1%"],["Auto action","FL360→FL380"]].map(([k,v])=>(<div key={k} style={{display:"flex",justifyContent:"space-between",padding:"5px 0",borderBottom:`1px solid ${C.border}`}}><span style={{...mono,fontSize:10,color:C.textSecondary}}>{k}</span><span style={{...raj,fontWeight:600,fontSize:12,color:C.textPrimary,textAlign:"right",maxWidth:110}}>{v}</span></div>))}
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

/* CSV */
const PN=["Port of Singapore","Port of Shanghai","Port of Rotterdam","Port of Busan","Port of Hamburg","Port of Los Angeles","Port of Jebel Ali","Port Klang","Port of Antwerp","Port of Ningbo"];
const AN=["Singapore Airlines","Emirates","Qatar Airways","Cathay Pacific","Lufthansa","British Airways","Delta Air Lines","United Airlines","Air France","KLM"];
const genRow=(i)=>{const isP=i%3!==2;const nm=isP?PN[i%PN.length]:AN[i%AN.length];const lat=(((i*1.37+90)%180)-90).toFixed(4);const lon=(((i*2.73+180)%360)-180).toFixed(4);const vol=((i*12347+1000000)%49000000)+1000000;const st=["ACTIVE","ACTIVE","ACTIVE","MAINTENANCE","MONITORING"][i%5];const tr=["TIER-1","TIER-2","TIER-3"][i%3];return`${i+1},${isP?"MARITIME_PORT":"AIRLINE_HUB"},"${nm}",${["Singapore","China","Netherlands","South Korea","UAE","Germany","USA"][i%7]},${lat},${lon},${vol},${st},${tr}\n`;};
const dlCSV=async(setDl)=>{setDl({l:true,p:0});const TOTAL=10000,CHUNK=400;const hdr="ID,Type,Name,Country,Latitude,Longitude,Volume,Status,Tier\n";const parts=[hdr];for(let i=0;i<TOTAL;i+=CHUNK){await new Promise(r=>setTimeout(r,0));let c="";for(let j=i;j<Math.min(i+CHUNK,TOTAL);j++)c+=genRow(j);parts.push(c);setDl({l:true,p:Math.min(Math.round(((i+CHUNK)/TOTAL)*100),99)});}const b=new Blob(parts,{type:"text/csv"});const u=URL.createObjectURL(b);const a=document.createElement("a");a.href=u;a.download="AeroSeaNexus_Archive_10000.csv";document.body.appendChild(a);a.click();document.body.removeChild(a);setTimeout(()=>URL.revokeObjectURL(u),2000);setDl({l:false,p:100});setTimeout(()=>setDl({l:false,p:0}),4000);};

/* PAGES */
const FEEDS=[{id:"AIS",name:"Maritime AIS Grid",provider:"MarineTraffic + ExactEarth",s:"active",rate:"24,218",lat:47,pts:"2.4M",col:C.cyan},{id:"WX",name:"METAR Weather Grid",provider:"NOAA + ECMWF + MetOffice",s:"active",rate:"16,840",lat:52,pts:"1.6M",col:C.orange},{id:"ACARS",name:"Airline ACARS Feed",provider:"SITA Network · ARINC",s:"warning",rate:"8,920",lat:140,pts:"892K",col:C.yellow},{id:"PORT",name:"Port Authority Data",provider:"IMO GISIS · PortNet",s:"active",rate:"5,312",lat:38,pts:"534K",col:C.green}];

const P1=()=>{
  const [dl,setDl]=useState({l:false,p:0});
  return(
    <div className="fu" style={{padding:20,maxWidth:1200}}>
      <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:18,padding:"6px 12px",background:"rgba(0,255,133,0.06)",border:"1px solid rgba(0,255,133,0.15)",borderRadius:4,width:"fit-content"}}><SDot/><span style={{...mono,fontSize:11,color:C.green}}>ALL SYSTEMS OPERATIONAL</span><span style={{...mono,fontSize:10,color:C.textSecondary,marginLeft:6}}>47 feeds · 2,847 endpoints · 0.3s ago</span></div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}><Met label="Records/Hr" value="55.3K" change={18} unit="rec/hr"/><Met label="AIS Coverage" value="99.2" unit="%" change={0.4}/><Met label="Endpoints" value="2,847" change={3}/><Met label="Latency" value="47" unit="ms" change={-12}/></div>
      <QNavMod/>
      <ST icon={Radio} title="Live API Feeds" sub="Real-time ingestion status"/>
      <div style={{display:"grid",gridTemplateColumns:"repeat(2,1fr)",gap:10,marginBottom:20}}>
        {FEEDS.map(f=>(<Card key={f.id} style={{padding:14}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}><div><div style={{display:"flex",alignItems:"center",gap:7,marginBottom:2}}><SDot s={f.s}/><span style={{...raj,fontWeight:700,fontSize:14,color:C.textPrimary}}>{f.name}</span></div><span style={{...mono,fontSize:10,color:C.textSecondary}}>{f.provider}</span></div><div style={{textAlign:"right"}}><div style={{...mono,fontSize:18,fontWeight:500,color:f.s==="active"?C.green:C.yellow}}>{f.rate}</div><div style={{...mono,fontSize:9,color:C.textSecondary}}>rec/hr</div></div></div><div style={{display:"flex",gap:12,fontSize:11}}><span style={{color:C.textSecondary}}>Lat: <span style={{...mono,color:f.lat<100?C.green:C.yellow}}>{f.lat}ms</span></span><span style={{color:C.textSecondary}}>Pts: <span style={{...mono,color:f.col}}>{f.pts}</span></span><span style={{marginLeft:"auto"}}><Tag color={f.s==="active"?C.green:C.yellow} bg={f.s==="active"?"rgba(0,255,133,0.08)":"rgba(255,214,0,0.08)"}>{f.s.toUpperCase()}</Tag></span></div></Card>))}
      </div>
      <ST icon={Activity} title="24-Hour Ingestion Volume"/>
      <Card style={{padding:14,marginBottom:20}}>
        <ResponsiveContainer width="100%" height={170}>
          <AreaChart data={ingD}>
            <defs>{[["gA",C.cyan],["gW",C.orange],["gC",C.green]].map(([id,col])=>(<linearGradient key={id} id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={col} stopOpacity={0.25}/><stop offset="95%" stopColor={col} stopOpacity={0}/></linearGradient>))}</defs>
            <CartesianGrid strokeDasharray="2 4" stroke={C.border}/>
            <XAxis dataKey="t" tick={{fill:C.textSecondary,fontSize:9,fontFamily:"JetBrains Mono,monospace"}} tickLine={false} axisLine={{stroke:C.border}} interval={5}/>
            <YAxis tick={{fill:C.textSecondary,fontSize:9,fontFamily:"JetBrains Mono,monospace"}} tickLine={false} axisLine={false} tickFormatter={v=>`${(v/1000).toFixed(0)}K`}/>
            <Tooltip content={<CT/>}/>
            <Area type="monotone" dataKey="ais" name="AIS" stroke={C.cyan} fill="url(#gA)" strokeWidth={1.8}/>
            <Area type="monotone" dataKey="wx" name="Weather" stroke={C.orange} fill="url(#gW)" strokeWidth={1.8}/>
            <Area type="monotone" dataKey="acars" name="ACARS" stroke={C.green} fill="url(#gC)" strokeWidth={1.8}/>
          </AreaChart>
        </ResponsiveContainer>
      </Card>
      <div style={{background:C.elevated,border:`1px solid ${C.borderHi}`,borderRadius:7,padding:20,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",inset:0,backgroundImage:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,200,255,0.012) 3px,rgba(0,200,255,0.012) 4px)",pointerEvents:"none"}}/>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:20,flexWrap:"wrap",position:"relative"}}>
          <div style={{flex:1}}>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:7}}><Database size={18} color={C.cyan}/><span style={{...raj,fontWeight:700,fontSize:18,color:C.cyan,letterSpacing:"0.09em",textTransform:"uppercase"}}>Massive Data Hub</span><Tag>v4.2.1</Tag><Tag color={C.green} bg="rgba(0,255,133,0.08)">LIVE</Tag></div>
            <p style={{...raj,color:C.textSecondary,fontSize:14,maxWidth:520,lineHeight:1.65,marginBottom:12}}>Master archive of global maritime ports, airline hubs, shipping lanes. 10,000+ entities with coordinates, throughput, tier classifications, and operational status.</p>
            <div style={{display:"flex",gap:16,flexWrap:"wrap"}}>{[["Records","10,000+"],["Fields","14"],["Format","CSV"],["Coverage","Global"]].map(([k,v])=>(<div key={k}><div style={{...mono,fontSize:9,color:C.textMuted,textTransform:"uppercase"}}>{k}</div><div style={{...raj,fontSize:14,color:C.textPrimary,fontWeight:600}}>{v}</div></div>))}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",alignItems:"flex-end",gap:10,minWidth:220}}>
            {dl.l&&(<div style={{width:"100%"}}><div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}><span style={{...mono,fontSize:10,color:C.textSecondary}}>Compiling…</span><span style={{...mono,fontSize:10,color:C.cyan}}>{dl.p}%</span></div><div style={{height:4,background:C.card,borderRadius:2}}><div style={{height:"100%",background:`linear-gradient(90deg,${C.cyan},rgba(0,200,255,0.5))`,borderRadius:2,width:`${dl.p}%`,transition:"width .1s"}}/></div></div>)}
            {!dl.l&&dl.p===100&&(<div style={{display:"flex",alignItems:"center",gap:5,...mono,fontSize:11,color:C.green}}><CheckCircle size={13}/> Download complete</div>)}
            <button className={`ab${dl.l?"":" or"}`} onClick={()=>!dl.l&&dlCSV(setDl)} disabled={dl.l} style={{display:"flex",alignItems:"center",gap:7,padding:"9px 16px",fontSize:13,opacity:dl.l?.6:1}}>
              <Download size={14}/>{dl.l?"Generating…":"Download Global Port & Airline Archive (10,000+ Datasets)"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SCENS=[{id:"suez",label:"Suez Closure",day:8,col:C.orange,delay:"8.2 days",opt:"3.1 days",save:"$2.4M"},{id:"typhoon",label:"Pacific Typhoon",day:18,col:C.yellow,delay:"11.4 days",opt:"5.7 days",save:"$3.1M"},{id:"strike",label:"USWC Port Strike",day:24,col:C.red,delay:"14.0 days",opt:"6.2 days",save:"$4.8M"}];
const P2=()=>{
  const [sc,setSc]=useState("suez");
  const S=SCENS.find(s=>s.id===sc);
  return(
    <div className="fu" style={{padding:20,maxWidth:1200}}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}><Met label="Scenarios" value="1,247" change={14}/><Met label="AI Routing Gain" value="+14.8" unit="%" change={14.8}/><Met label="Model Conf." value="91.2" unit="%" change={1.3}/><Met label="Swarm/s" value="58.3K" change={22}/></div>
      <QSwarmMod/>
      <EagleMod/>
      <ST icon={Cpu} title="Disruption Scenario Simulator"/>
      <div style={{display:"flex",gap:7,marginBottom:14}}>
        {SCENS.map(s=>(<button key={s.id} className="sb" onClick={()=>setSc(s.id)} style={{background:sc===s.id?"rgba(0,200,255,0.1)":C.card,border:`1px solid ${sc===s.id?C.borderHi:C.border}`,color:sc===s.id?C.cyan:C.textSecondary}}><AlertCircle size={11} color={sc===s.id?C.cyan:C.textSecondary}/>{s.label}</button>))}
      </div>
      <Card style={{padding:14,marginBottom:14}}>
        <ResponsiveContainer width="100%" height={190}>
          <LineChart data={routD}>
            <CartesianGrid strokeDasharray="2 4" stroke={C.border}/>
            <XAxis dataKey="d" tick={{fill:C.textSecondary,fontSize:9,fontFamily:"JetBrains Mono,monospace"}} tickLine={false} axisLine={{stroke:C.border}} interval={4}/>
            <YAxis domain={[70,100]} tick={{fill:C.textSecondary,fontSize:9,fontFamily:"JetBrains Mono,monospace"}} tickLine={false} axisLine={false} tickFormatter={v=>`${v}%`}/>
            <Tooltip content={<CT/>}/><Legend wrapperStyle={{fontSize:11,fontFamily:"JetBrains Mono,monospace",color:C.textSecondary}}/>
            <ReferenceLine x={`D${S.day}`} stroke={S.col} strokeDasharray="4 2"/>
            <Line type="monotone" dataKey="planned" name="Planned" stroke={C.textSecondary} strokeWidth={1.5} dot={false} strokeDasharray="4 2"/>
            <Line type="monotone" dataKey="actual" name="Actual" stroke={C.orange} strokeWidth={2} dot={false}/>
            <Line type="monotone" dataKey="optimized" name="AI Optimized" stroke={C.cyan} strokeWidth={2.5} dot={false}/>
          </LineChart>
        </ResponsiveContainer>
      </Card>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:10}}>
        {[{t:"Baseline Delay",v:S.delay,c:S.col},{t:"AI-Optimized",v:S.opt,c:C.cyan},{t:"Savings/Voyage",v:S.save,c:C.green}].map((item,i)=>(<Card key={i} style={{padding:14}}><div style={{...mono,fontSize:10,color:C.textSecondary,marginBottom:7}}>{item.t}</div><div style={{...mono,fontSize:24,fontWeight:500,color:item.c}}>{item.v}</div></Card>))}
      </div>
    </div>
  );
};

const CONTR=[{id:"C-001",v:"Maersk Line",type:"Trans-Pacific Charter",val:"$12.4M",exp:"14 days",st:"renew",pri:"high"},{id:"C-002",v:"MSC Mediterranean",type:"Asia-Europe Loop",val:"$8.7M",exp:"45 days",st:"active",pri:"med"},{id:"C-003",v:"CMA CGM",type:"Red Sea Corridor",val:"$6.2M",exp:"90 days",st:"active",pri:"low"},{id:"C-004",v:"Hapag-Lloyd",type:"Trans-Pacific Spot",val:"$3.1M",exp:"Opportunity",st:"negotiate",pri:"high"},{id:"C-005",v:"COSCO Shipping",type:"Intra-Asia Hub",val:"$4.8M",exp:"28 days",st:"renew",pri:"med"}];
const EMAILS=[{from:"ops@maersk.com",subj:"Rate Schedule Update Q2 2026",t:"2h ago",p:"high",d:false},{from:"booking@cma-cgm.com",subj:"Slot Confirmation: SHA→RTM W14",t:"3h ago",p:"med",d:true},{from:"legal@hapag-lloyd.com",subj:"Charter Party Amendment Clause 14",t:"5h ago",p:"high",d:false},{from:"ops@msc.com",subj:"Port Congestion Alert CNSHA Berth 7",t:"6h ago",p:"med",d:true},{from:"rates@cosco.com",subj:"Bunker Surcharge Revision Apr 1",t:"8h ago",p:"low",d:true}];
const P3=()=>(<div className="fu" style={{padding:20,maxWidth:1200}}><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}><Met label="Active Contracts" value="23" change={2}/><Met label="Auto-Resolved" value="94.2" unit="%" change={1.8}/><Met label="AI Savings" value="$340K" change={12}/><Met label="Pending" value="49" change={-8}/></div><ST icon={FileText} title="Supplier Contracts"/><Card style={{marginBottom:20,overflow:"hidden"}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{borderBottom:`1px solid ${C.border}`}}>{["ID","Vendor","Route","Value","Expires","Status"].map(h=>(<th key={h} style={{padding:"9px 12px",textAlign:"left",...mono,fontSize:9,color:C.textSecondary,fontWeight:500,letterSpacing:"0.09em",textTransform:"uppercase"}}>{h}</th>))}</tr></thead><tbody>{CONTR.map((c,i)=>(<tr key={c.id} className="tr" style={{background:i%2===0?"transparent":"rgba(0,200,255,0.02)"}}><td style={{padding:"9px 12px",...mono,fontSize:10,color:C.textSecondary}}>{c.id}</td><td style={{padding:"9px 12px",...raj,fontWeight:700,fontSize:13,color:C.textPrimary}}>{c.v}</td><td style={{padding:"9px 12px",fontSize:12,color:C.textSecondary}}>{c.type}</td><td style={{padding:"9px 12px",...mono,fontSize:12,color:C.cyan}}>{c.val}</td><td style={{padding:"9px 12px",...mono,fontSize:11,color:c.pri==="high"?C.orange:C.textSecondary}}>{c.exp}</td><td style={{padding:"9px 12px"}}><Tag color={c.st==="active"?C.green:c.st==="renew"?C.orange:C.yellow} bg={c.st==="active"?"rgba(0,255,133,0.08)":c.st==="renew"?"rgba(255,122,46,0.1)":"rgba(255,214,0,0.08)"}>{c.st.toUpperCase()}</Tag></td></tr>))}</tbody></table></Card><ST icon={Mail} title="Automated Email Queue" sub="847 processed today · 94.2% auto-resolved"/><div style={{display:"flex",flexDirection:"column",gap:7}}>{EMAILS.map((e,i)=>(<Card key={i} style={{padding:"10px 14px",display:"flex",alignItems:"center",gap:12}}><div style={{width:6,height:6,borderRadius:"50%",background:e.p==="high"?C.orange:e.p==="med"?C.yellow:C.textSecondary,flexShrink:0}}/><div style={{flex:1,minWidth:0}}><div style={{...mono,fontSize:10,color:C.textSecondary,marginBottom:1}}>{e.from}</div><div style={{...raj,fontWeight:600,fontSize:13,color:e.d?C.textSecondary:C.textPrimary,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{e.subj}</div></div><div style={{textAlign:"right",flexShrink:0}}><div style={{...mono,fontSize:10,color:C.textSecondary,marginBottom:3}}>{e.t}</div><Tag color={e.d?C.green:C.cyan} bg={e.d?"rgba(0,255,133,0.08)":"rgba(0,200,255,0.08)"}>{e.d?"AUTO-RESOLVED":"PENDING"}</Tag></div></Card>))}</div></div>);

const CLIENTS=[{n:"Pacific Basin Shipping",t:"Enterprise",m:"$48K",u:"99.2%",g:"+12%"},{n:"Cargill Ocean Transport",t:"Enterprise",m:"$42K",u:"97.8%",g:"+8%"},{n:"Koch Industries Marine",t:"Pro",m:"$28K",u:"94.1%",g:"+23%"},{n:"Glencore Logistics",t:"Enterprise",m:"$35K",u:"96.3%",g:"+5%"},{n:"Trafigura Shipping",t:"Pro",m:"$22K",u:"91.7%",g:"+16%"}];
const P4=()=>(<div className="fu" style={{padding:20,maxWidth:1200}}><div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10,marginBottom:20}}><Met label="Total ARR" value="$4.2M" change={34}/><Met label="Active Clients" value="127" change={8}/><Met label="DaaS Uptime" value="99.7" unit="%" change={0.2}/><Met label="Retention" value="96.4" unit="%" change={1.1}/></div><ST icon={TrendingUp} title="Commodity Shipping vs Market Indices" sub="12-month view"/><Card style={{padding:14,marginBottom:20}}><ResponsiveContainer width="100%" height={220}><ComposedChart data={salesD}><CartesianGrid strokeDasharray="2 4" stroke={C.border}/><XAxis dataKey="m" tick={{fill:C.textSecondary,fontSize:9,fontFamily:"JetBrains Mono,monospace"}} tickLine={false} axisLine={{stroke:C.border}}/><YAxis yAxisId="l" tick={{fill:C.textSecondary,fontSize:9,fontFamily:"JetBrains Mono,monospace"}} tickLine={false} axisLine={false}/><YAxis yAxisId="r" orientation="right" tick={{fill:C.textSecondary,fontSize:9,fontFamily:"JetBrains Mono,monospace"}} tickLine={false} axisLine={false}/><Tooltip content={<CT/>}/><Legend wrapperStyle={{fontSize:11,fontFamily:"JetBrains Mono,monospace",color:C.textSecondary}}/><Bar yAxisId="l" dataKey="copper" name="Copper" fill="rgba(255,122,46,0.5)" radius={[2,2,0,0]}/><Bar yAxisId="l" dataKey="iron" name="Iron Ore" fill="rgba(0,200,255,0.35)" radius={[2,2,0,0]}/><Bar yAxisId="l" dataKey="lng" name="LNG" fill="rgba(0,255,133,0.28)" radius={[2,2,0,0]}/><Line yAxisId="r" type="monotone" dataKey="bdi" name="Baltic Dry Index" stroke={C.yellow} strokeWidth={2.5} dot={false}/></ComposedChart></ResponsiveContainer></Card><ST icon={User} title="Top Enterprise Clients"/><Card style={{overflow:"hidden"}}><table style={{width:"100%",borderCollapse:"collapse"}}><thead><tr style={{borderBottom:`1px solid ${C.border}`}}>{["Client","Tier","MRR","API Usage","MoM"].map(h=>(<th key={h} style={{padding:"9px 12px",textAlign:"left",...mono,fontSize:9,color:C.textSecondary,fontWeight:500,letterSpacing:"0.09em",textTransform:"uppercase"}}>{h}</th>))}</tr></thead><tbody>{CLIENTS.map((c,i)=>(<tr key={i} className="tr" style={{background:i%2===0?"transparent":"rgba(0,200,255,0.02)"}}><td style={{padding:"9px 12px",...raj,fontWeight:700,fontSize:13,color:C.textPrimary}}>{c.n}</td><td style={{padding:"9px 12px"}}><Tag color={c.t==="Enterprise"?C.cyan:C.orange} bg={c.t==="Enterprise"?"rgba(0,200,255,0.1)":"rgba(255,122,46,0.08)"}>{c.t.toUpperCase()}</Tag></td><td style={{padding:"9px 12px",...mono,fontSize:12,color:C.green}}>{c.m}</td><td style={{padding:"9px 12px",...mono,fontSize:12,color:C.textPrimary}}>{c.u}</td><td style={{padding:"9px 12px",...mono,fontSize:12,color:C.green,display:"flex",alignItems:"center",gap:3}}><ArrowUpRight size={11}/>{c.g}</td></tr>))}</tbody></table></Card></div>);

const TS=({done,label,time,detail,last})=>(<div style={{display:"flex",gap:12,paddingBottom:last?0:16}}><div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0}}><div style={{width:26,height:26,borderRadius:"50%",background:done?C.green:"rgba(0,200,255,0.08)",border:`2px solid ${done?C.green:C.border}`,display:"flex",alignItems:"center",justifyContent:"center",zIndex:1}}>{done?<CheckCircle size={12} color={C.bg}/>:<Clock size={10} color={C.textSecondary}/>}</div>{!last&&<div style={{width:1,flex:1,background:C.border,marginTop:4}}/>}</div><div style={{paddingTop:3}}><div style={{...raj,fontWeight:600,fontSize:13,color:done?C.textPrimary:C.textSecondary}}>{label}</div><div style={{...mono,fontSize:10,color:done?C.cyan:C.textMuted,marginTop:1}}>{time}</div>{detail&&<div style={{fontSize:12,color:C.textSecondary,marginTop:2}}>{detail}</div>}</div></div>);
const P5=()=>(<div className="fu" style={{padding:20,maxWidth:980}}><div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20}}><div><ST icon={Plane} title="My Itinerary" sub="Personal flight tracker"/><Card style={{padding:18,marginBottom:12}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}><div><div style={{...mono,fontSize:10,color:C.textSecondary,marginBottom:2}}>SINGAPORE → LONDON HEATHROW</div><div style={{...raj,fontWeight:700,fontSize:22,color:C.textPrimary}}>SQ 322</div><div style={{fontSize:12,color:C.textSecondary}}>Singapore Airlines · A350-900ULR</div></div><Tag color={C.green} bg="rgba(0,255,133,0.1)">CONFIRMED</Tag></div><div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",gap:8,alignItems:"center",marginBottom:14}}><div><div style={{...mono,fontSize:22,fontWeight:500,color:C.textPrimary}}>23:55</div><div style={{...mono,fontSize:11,color:C.cyan}}>SIN · T3</div></div><div style={{textAlign:"center"}}><div style={{...mono,fontSize:9,color:C.textMuted,marginBottom:3}}>14h 05m</div><div style={{display:"flex",alignItems:"center",gap:4}}><div style={{flex:1,height:1,background:C.border}}/><Plane size={11} color={C.cyan}/><div style={{flex:1,height:1,background:C.border}}/></div><div style={{...mono,fontSize:9,color:C.textMuted,marginTop:3}}>Gate B14</div></div><div style={{textAlign:"right"}}><div style={{...mono,fontSize:22,fontWeight:500,color:C.textPrimary}}>06:00</div><div style={{...mono,fontSize:11,color:C.cyan}}>LHR · T2</div></div></div><div style={{borderTop:`1px solid ${C.border}`,paddingTop:10,display:"flex",gap:14,flexWrap:"wrap"}}>{[["Seat","11A Window"],["Class","Business"],["Meal","Asian Veg."],["Bags","2×23kg"]].map(([k,v])=>(<div key={k}><div style={{...mono,fontSize:9,color:C.textMuted}}>{k}</div><div style={{...raj,fontSize:13,color:C.textPrimary,fontWeight:600}}>{v}</div></div>))}</div></Card><Card style={{padding:12}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}><div><div style={{...mono,fontSize:9,color:C.textSecondary}}>RETURN · LHR → CDG</div><div style={{...raj,fontWeight:700,fontSize:14,color:C.textPrimary}}>BA 308 — April 4, 2026</div></div><Tag>UPCOMING</Tag></div><div style={{display:"flex",justifyContent:"space-between",...mono,fontSize:12}}><span style={{color:C.textPrimary}}>08:30 LHR</span><span style={{color:C.textSecondary,fontSize:10}}>1h 15m</span><span style={{color:C.textPrimary}}>11:45 CDG</span></div></Card></div><div><ST icon={Package} title="Package Tracker" sub="Live shipment tracking"/><Card style={{padding:18}}><div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}><div><div style={{...mono,fontSize:9,color:C.textSecondary,marginBottom:2}}>TRACKING NUMBER</div><div style={{...mono,fontSize:18,fontWeight:500,color:C.cyan}}>ASN-7743921</div></div><Tag color={C.orange} bg="rgba(255,122,46,0.1)">IN TRANSIT</Tag></div><div style={{...raj,fontSize:13,color:C.textSecondary,lineHeight:1.65,marginBottom:16}}>Consumer electronics · 2.4kg · Shanghai → London<br/><span style={{color:C.textPrimary}}>ETA: Tuesday March 25 — On schedule ✓</span></div><TS done label="Collected — CNSHA Warehouse B7" time="Mar 18 · 09:14 CST" detail="Pudong logistics hub · 9 docs verified"/><TS done label="Departed Shanghai Air Freight Hub" time="Mar 19 · 02:30 CST" detail="Air China cargo CA1022"/><TS done label="Dubai Transit Hub" time="Mar 20 · 16:45 GST" detail="Customs cleared"/><TS label="Frankfurt Cargo Hub (Next)" time="Est. Mar 23 · 06:00 CET"/><TS label="Delivered — London EC1A" time="Est. Mar 25 · 14:00 GMT" last/></Card></div></div></div>);

/* ══════════════════════════════════════════════════
   REAL AI CHAT — Anthropic API powered
══════════════════════════════════════════════════ */
const PAGE_CONTEXT = {
  ingestion: {
    name: "Data Ingestion & Integration — The Global Eyes",
    data: `LIVE DASHBOARD METRICS:
- 47 active API feeds | 2,847 endpoints | avg latency 47ms
- Maritime AIS: 24,218 rec/hr (+18% baseline) | MarineTraffic + ExactEarth
- METAR Weather: 16,840 rec/hr | NOAA + ECMWF + MetOffice
- Airline ACARS: 8,920 rec/hr (WARNING — 140ms latency) | SITA/ARINC
- Port Authority: 5,312 rec/hr | IMO GISIS + PortNet
- Quantum Gravity Sensor: STANDBY (GPS nominal) — sub-8cm accuracy, 147-layer gravity model, 99.97% confidence
- 10,000+ dataset archive available for download (ports + airlines, 14 fields, CSV)`
  },
  simulation: {
    name: "Simulation & Analytics — The Virtual Earth",
    data: `LIVE DASHBOARD METRICS:
- 1,247 disruption scenarios run | AI routing gain: +14.8% | model confidence: 91.2%
- Quantum Swarm: evaluating ~847K of 1,000,000 routes simultaneously
- Jet stream assists active: FL380 N.Pacific +185kt (saves 51min SFO→NRT), FL400 polar SHA→LAX (14.2% fuel / $38K), Atlantic LHR→JFK (38min + 2.1t fuel)
- Ocean current: +2.1kt Kuroshio on SIN→RTM = $12,400 bunker saving/voyage
- Eagle Eye MARITIME: Bioluminescence radar active — Cat-2 sea state at 042°, 5 plume events, 8° starboard deviation recommended
- Eagle Eye AVIATION LiDAR: CAT at FL360, 22nm ahead of SQ322 — EDR 0.35 m²/³s⁻¹ MODERATE, autopilot climbing to FL380
- Scenario results: Suez closure = 8.2d delay / AI optimised = 3.1d / saves $2.4M per voyage`
  },
  operations: {
    name: "Automated Operations — The AI Negotiator",
    data: `LIVE DASHBOARD METRICS:
- 23 active contracts | 847 emails processed today | 94.2% auto-resolved | AI savings: $340K
- Maersk Line C-001 ($12.4M Trans-Pacific Charter): expires in 14 DAYS — URGENT RENEWAL, +12% rate clause needs human review
- MSC Mediterranean C-002 ($8.7M Asia-Europe Loop): active, 45 days remaining
- CMA CGM C-003 ($6.2M Red Sea Corridor): active, 90 days remaining
- Hapag-Lloyd C-004 ($3.1M Trans-Pacific Spot): NEGOTIATE — opportunity slot available, est. $340K savings vs spot
- COSCO Shipping C-005 ($4.8M Intra-Asia): renew, 28 days remaining
- Pending emails: ops@maersk.com rate update (HIGH), legal@hapag-lloyd.com amendment (HIGH)`
  },
  sales: {
    name: "Enterprise Sales & DaaS — The Data Goldmine",
    data: `LIVE DASHBOARD METRICS:
- Total ARR: $4.2M (+34% YoY) | 127 active clients | DaaS uptime: 99.7% | retention: 96.4%
- Revenue by segment: DaaS APIs $1.8M (43%), Enterprise Contracts $1.2M (29%), Ops Automation $0.8M (19%), Consumer B2C $0.4M (9%)
- Quarterly 2025: Q1 $980K | Q2 $1.10M | Q3 $1.05M | Q4 $1.07M
- Gross margin: 68% | Net margin: ~33% ($1.4M net profit)
- Top clients: Pacific Basin Shipping ($48K MRR +12%), Cargill Ocean Transport ($42K +8%), Koch Industries ($28K +23%), Glencore ($35K +5%), Trafigura ($22K +16%)
- Baltic Dry Index up 41% YTD — 6 enterprise clients showing API expansion signals
- Pipeline: $2.1M qualified | 2026 trajectory: $5.8M ARR`
  },
  consumer: {
    name: "Consumer Products (B2C) — Personal Hub",
    data: `LIVE DASHBOARD METRICS:
- Flight SQ322 Singapore → London Heathrow CONFIRMED: departs 23:55 tonight Changi T3 Gate B14, arrives 06:00 LHR T2, 14h 05m non-stop A350-900ULR
- Seat 11A Window | Business Class | Asian vegetarian meal | 2×23kg bags
- Eagle Eye LiDAR: CAT at FL360 en route — autopilot climbing to FL380 ~3h into flight, full avoidance, ETA +3min only
- Return BA308 LHR→CDG April 4: 08:30→11:45, 1h 15m
- Package ASN-7743921 (consumer electronics, 2.4kg, Shanghai→London): IN TRANSIT
  - Collected CNSHA Mar 18, departed Shanghai air freight Mar 19, cleared Dubai Mar 20
  - Next: Frankfurt cargo hub Est. Mar 23 | Delivery London EC1A Est. Mar 25 14:00 GMT — ON SCHEDULE`
  }
};

const SYSTEM_PROMPT = (page) => {
  const ctx = PAGE_CONTEXT[page] || PAGE_CONTEXT.ingestion;
  return `You are the Aero-Sea Nexus AI Agent — an elite, highly intelligent operations assistant embedded in a cutting-edge maritime and aviation logistics platform. You are currently active on the "${ctx.name}" dashboard.

LIVE PLATFORM DATA YOU HAVE ACCESS TO:
${ctx.data}

PLATFORM OVERVIEW (all departments):
- Aero-Sea Nexus is a global aero-maritime intelligence platform
- 5 departments: Data Ingestion (AIS/weather/ACARS feeds), Simulation & Analytics (route optimization, disruption modelling), Automated Operations (AI contract negotiation, email automation), Enterprise Sales & DaaS (B2B commodity-shipping intelligence APIs), Consumer B2C (personal itinerary + package tracking)
- 3 Advanced Technology Modules:
  1. QUANTUM NAVIGATION (Inner Compass): Uses Earth's gravity gradient for GPS-independent positioning. Sub-8cm accuracy, 147-layer model, unjammable/unspoofable. Cycles: Nominal → Interference → GPS Jammed/Hacked → Quantum Gravity Lock
  2. QUANTUM SWARM (Million-Path Brain): Supercomputer evaluating 1,000,000 route variants simultaneously. Identifies jet stream and ocean current assists for free fuel savings.
  3. EAGLE EYE (Advanced Sensing): Maritime = Bioluminescence Wave Mapping radar for night sea-state detection. Aviation = LiDAR CAT radar detecting invisible Clear Air Turbulence 20 miles ahead with 30-sec automated altitude adjustment.

INSTRUCTIONS:
- Answer every question with specific, real numbers and data from the live dashboard context above
- If asked about profit/revenue/financials, give a detailed breakdown with all figures
- If asked about any platform module, explain it concisely with live status data
- Keep responses concise but data-rich — use bullet points and numbers where helpful
- Never give the same generic answer twice — always tailor to the exact question asked
- You are confident, knowledgeable, and speak like a top-tier operations AI
- Do NOT say you don't have access to data — you do. Use the data above.
- Format numbers clearly: use $ signs, %, M/K suffixes`;
};

const callAI = async (messages, page) => {
  const systemPrompt = SYSTEM_PROMPT(page);
  const apiKey = import.meta.env.VITE_GEMINI_KEY;

  // Build conversation history for Gemini
  const contents = [];

  // Add previous messages
  messages.filter(m => m.r !== "system").forEach(m => {
    contents.push({
      role: m.r === "ai" ? "model" : "user",
      parts: [{ text: m.t }]
    });
  });

  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }]
        },
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1000,
        }
      }),
    }
  );

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No response from Gemini");
  return text;
};

const Chat = ({ page, onClose }) => {
  const pl = { ingestion:"Data Ingestion", simulation:"Simulation", operations:"Operations", sales:"Enterprise Sales", consumer:"Consumer B2C" }[page];
  const [msgs, setMsgs] = useState([{ r:"ai", t:`Aero-Sea AI Agent online — ${pl} dashboard. I have live access to all your platform data: feeds, financials, quantum systems, Eagle Eye sensors, contracts, and itineraries. Ask me anything specific.` }]);
  const [inp, setInp] = useState("");
  const [think, setThink] = useState(false);
  const [err, setErr] = useState(null);
  const eRef = useRef(null);

  useEffect(() => { eRef.current?.scrollIntoView({ behavior:"smooth" }); }, [msgs, think]);

  const send = async (q) => {
    const tx = (q || inp).trim();
    if (!tx || think) return;
    const newMsgs = [...msgs, { r:"user", t:tx }];
    setMsgs(newMsgs);
    setInp("");
    setThink(true);
    setErr(null);
    try {
      const reply = await callAI(newMsgs, page);
      setMsgs(m => [...m, { r:"ai", t:reply }]);
    } catch(e) {
      setErr(e.message || "Connection error");
      setMsgs(m => [...m, { r:"ai", t:`⚠ API error: ${e.message}. Please try again.` }]);
    } finally {
      setThink(false);
    }
  };

  const QA = [
    { l:"💰 Profits", q:"Give me a full breakdown of all profits and revenue across all segments" },
    { l:"🧠 Quantum Swarm", q:"What is Quantum Swarm doing right now? What routes and jet streams has it found?" },
    { l:"👁️ Eagle Eye", q:"What is Eagle Eye currently detecting? Give me full maritime and aviation readings" },
    { l:"🛰️ Quantum Nav", q:"What is the Quantum Navigation GPS status right now?" },
    { l:"📋 Contracts", q:"Which contracts need urgent attention and what should I do about them?" },
    { l:"✈️ My flight", q:"Give me a full status update on my SQ322 flight tonight" },
  ];

  return (
    <div style={{position:"fixed",bottom:84,right:20,width:400,height:560,background:C.surface,border:`1px solid ${C.borderHi}`,borderRadius:12,display:"flex",flexDirection:"column",zIndex:999,boxShadow:`0 28px 70px rgba(0,0,0,0.9),0 0 0 1px rgba(0,200,255,0.1)`}}>
      {/* Header */}
      <div style={{display:"flex",alignItems:"center",gap:9,padding:"10px 14px",borderBottom:`1px solid ${C.border}`,background:C.elevated,borderRadius:"12px 12px 0 0",flexShrink:0}}>
        <div style={{width:32,height:32,borderRadius:"50%",background:"rgba(0,200,255,0.12)",border:`1px solid ${C.borderHi}`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
          <Bot size={16} color={C.cyan}/>
        </div>
        <div style={{flex:1}}>
          <div style={{...raj,fontWeight:700,fontSize:13,color:C.cyan,letterSpacing:"0.06em"}}>AERO-SEA AI AGENT</div>
          <div style={{display:"flex",alignItems:"center",gap:5}}>
            <SDot/>
            <span style={{...mono,fontSize:9,color:C.textSecondary}}>Claude · live data · {pl}</span>
            <span style={{...mono,fontSize:8,padding:"1px 5px",background:"rgba(0,200,255,0.08)",border:`1px solid rgba(0,200,255,0.2)`,borderRadius:2,color:C.cyan,marginLeft:2}}>REAL AI</span>
          </div>
        </div>
        <button onClick={onClose} style={{background:"none",border:"none",color:C.textSecondary,cursor:"pointer",padding:3,display:"flex",borderRadius:3}}><X size={15}/></button>
      </div>

      {/* Quick actions */}
      <div style={{padding:"7px 9px",display:"flex",gap:4,flexWrap:"wrap",borderBottom:`1px solid ${C.border}`,background:"rgba(0,200,255,0.015)",flexShrink:0}}>
        {QA.map(({l,q})=>(
          <button key={l} onClick={()=>send(q)} disabled={think}
            style={{...mono,fontSize:9,color:think?C.textMuted:C.textSecondary,background:"rgba(0,200,255,0.04)",border:`1px solid ${C.border}`,borderRadius:3,padding:"3px 7px",cursor:think?"not-allowed":"pointer",transition:"all .1s"}}
            onMouseEnter={e=>{if(!think)e.target.style.borderColor=C.borderHi;}}
            onMouseLeave={e=>{e.target.style.borderColor=C.border;}}>
            {l}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div style={{flex:1,overflowY:"auto",padding:12,display:"flex",flexDirection:"column",gap:10}}>
        {msgs.map((m,i)=>(
          <div key={i} style={{display:"flex",gap:8,justifyContent:m.r==="user"?"flex-end":"flex-start",alignItems:"flex-start"}}>
            {m.r==="ai" && (
              <div style={{width:24,height:24,borderRadius:"50%",background:"rgba(0,200,255,0.1)",border:`1px solid rgba(0,200,255,0.2)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>
                <Bot size={12} color={C.cyan}/>
              </div>
            )}
            <div style={{
              maxWidth:"85%",padding:"8px 12px",
              borderRadius:m.r==="user"?"12px 12px 3px 12px":"12px 12px 12px 3px",
              background:m.r==="user"?"rgba(0,200,255,0.1)":C.card,
              border:`1px solid ${m.r==="user"?"rgba(0,200,255,0.25)":C.border}`,
              fontSize:12.5,color:C.textPrimary,lineHeight:1.6,...raj,whiteSpace:"pre-wrap",wordBreak:"break-word"
            }}>
              {m.t}
            </div>
            {m.r==="user" && (
              <div style={{width:24,height:24,borderRadius:"50%",background:"rgba(0,200,255,0.08)",border:`1px solid rgba(0,200,255,0.15)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1,...mono,fontSize:9,color:C.cyan}}>
                U
              </div>
            )}
          </div>
        ))}
        {think && (
          <div style={{display:"flex",gap:8,alignItems:"flex-start"}}>
            <div style={{width:24,height:24,borderRadius:"50%",background:"rgba(0,200,255,0.1)",border:`1px solid rgba(0,200,255,0.2)`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
              <Bot size={12} color={C.cyan}/>
            </div>
            <div style={{padding:"10px 14px",background:C.card,border:`1px solid ${C.border}`,borderRadius:"12px 12px 12px 3px",display:"flex",gap:5,alignItems:"center"}}>
              <span className="d1"/><span className="d2"/><span className="d3"/>
              <span style={{...mono,fontSize:9,color:C.textSecondary,marginLeft:4}}>thinking…</span>
            </div>
          </div>
        )}
        <div ref={eRef}/>
      </div>

      {/* Input */}
      <div style={{padding:10,borderTop:`1px solid ${C.border}`,display:"flex",gap:7,flexShrink:0}}>
        <input
          className="ci"
          value={inp}
          onChange={e=>setInp(e.target.value)}
          onKeyDown={e=>e.key==="Enter"&&!e.shiftKey&&send()}
          placeholder="Ask anything — profits, routes, contracts, sensors…"
          disabled={think}
          style={{opacity:think?.7:1}}
        />
        <button
          onClick={()=>send()}
          disabled={!inp.trim()||think}
          style={{width:36,height:36,borderRadius:6,background:inp.trim()&&!think?"rgba(0,200,255,0.15)":"rgba(0,200,255,0.03)",border:`1px solid ${inp.trim()&&!think?C.borderHi:C.border}`,color:inp.trim()&&!think?C.cyan:C.textMuted,cursor:inp.trim()&&!think?"pointer":"not-allowed",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,transition:"all .15s"}}>
          <Send size={14}/>
        </button>
      </div>
    </div>
  );
};

const NAV=[{id:"ingestion",icon:Globe,label:"Data Ingestion",sub:"The Global Eyes"},{id:"simulation",icon:Cpu,label:"Simulation & Analytics",sub:"The Virtual Earth"},{id:"operations",icon:Zap,label:"Auto Operations",sub:"The AI Negotiator"},{id:"sales",icon:TrendingUp,label:"Enterprise Sales",sub:"The Data Goldmine"},{id:"consumer",icon:Package,label:"Consumer B2C",sub:"Personal Hub"}];

export default function App(){
  const [pg,setPg]=useState("ingestion");
  const [chat,setChat]=useState(false);
  const cur=NAV.find(n=>n.id===pg);
  useEffect(()=>{setChat(false);},[pg]);
  return(
    <div style={{display:"flex",height:"100vh",background:C.bg,overflow:"hidden",...raj}}>
      <GS/>
      {/* Sidebar */}
      <div style={{width:220,background:C.surface,borderRight:`1px solid ${C.border}`,display:"flex",flexDirection:"column",flexShrink:0,overflowY:"auto"}}>
        <div style={{padding:"16px 14px 12px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:28,height:28,borderRadius:5,background:"rgba(0,200,255,0.1)",border:`1px solid ${C.borderHi}`,display:"flex",alignItems:"center",justifyContent:"center"}}><Anchor size={14} color={C.cyan}/></div>
            <div><div style={{...raj,fontWeight:700,fontSize:16,color:C.cyan,letterSpacing:"0.05em",lineHeight:1.1}}>AERO-SEA</div><div style={{...mono,fontSize:8,color:C.textSecondary,letterSpacing:"0.12em",textTransform:"uppercase"}}>NEXUS PLATFORM</div></div>
          </div>
        </div>
        <nav style={{flex:1,padding:"6px 0"}}>
          {NAV.map(item=>(<button key={item.id} className={`nb${pg===item.id?" act":""}`} onClick={()=>setPg(item.id)}><item.icon size={14} color={pg===item.id?C.cyan:C.textSecondary}/><div><div style={{...raj,fontWeight:pg===item.id?700:500,fontSize:13,color:pg===item.id?C.cyan:C.textSecondary,lineHeight:1.2}}>{item.label}</div><div style={{...mono,fontSize:8,color:pg===item.id?"rgba(0,200,255,0.5)":C.textMuted}}>{item.sub}</div></div></button>))}
        </nav>
        <div style={{padding:"10px 14px",borderBottom:`1px solid ${C.border}`}}>
          <div style={{...mono,fontSize:9,color:C.textSecondary,marginBottom:5,display:"flex",alignItems:"center",gap:5}}><SDot/> All systems live</div>
          <div style={{display:"flex",gap:6}}>{[["Q-NAV",C.cyan],["SWARM",C.purple],["EAGLE",C.green]].map(([l,c])=>(<span key={l} style={{...mono,fontSize:8,color:c,background:`rgba(${c===C.cyan?"0,200,255":c===C.purple?"168,85,247":"0,255,133"},0.1)`,padding:"2px 6px",borderRadius:2}}>{l}</span>))}</div>
          <div style={{...mono,fontSize:8,color:C.textMuted,marginTop:5}}>v3.0.1 · 2026</div>
        </div>
      </div>
      {/* Main */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        <div style={{height:44,display:"flex",alignItems:"center",justifyContent:"space-between",padding:"0 18px",borderBottom:`1px solid ${C.border}`,background:C.surface,flexShrink:0}}>
          <div style={{display:"flex",alignItems:"center",gap:7}}><ChevronRight size={12} color={C.textSecondary}/><span style={{...mono,fontSize:11,color:C.textSecondary}}>{cur?.label}</span><span style={{...mono,fontSize:10,color:C.textMuted}}>/ {cur?.sub}</span></div>
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{display:"flex",gap:6}}>{[["Q-NAV",C.cyan],["SWARM",C.purple],["EAGLE",C.green]].map(([l,c])=>(<span key={l} style={{...mono,fontSize:9,color:c,background:`rgba(${c===C.cyan?"0,200,255":c===C.purple?"168,85,247":"0,255,133"},0.08)`,padding:"2px 7px",borderRadius:2,border:`1px solid ${c}22`}}>⬤ {l}</span>))}</div>
            <button className="ab" onClick={()=>setChat(o=>!o)} style={{display:"flex",alignItems:"center",gap:6,padding:"5px 11px",fontSize:12}}><Bot size={13}/> AI Agent {chat?"▾":"▸"}</button>
          </div>
        </div>
        <div style={{flex:1,overflowY:"auto"}}>
          {pg==="ingestion"&&<P1/>}
          {pg==="simulation"&&<P2/>}
          {pg==="operations"&&<P3/>}
          {pg==="sales"&&<P4/>}
          {pg==="consumer"&&<P5/>}
        </div>
      </div>
      {/* Floating bot */}
      <button onClick={()=>setChat(o=>!o)} style={{position:"fixed",bottom:20,right:20,width:50,height:50,borderRadius:"50%",background:chat?"rgba(0,200,255,0.18)":"rgba(0,200,255,0.1)",border:`1px solid ${C.borderHi}`,color:C.cyan,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",zIndex:998,boxShadow:"0 4px 24px rgba(0,200,255,0.22)",transition:"all .2s"}}>
        <Bot size={21}/>
      </button>
      {chat&&<Chat page={pg} onClose={()=>setChat(false)}/>}
    </div>
  );
}
