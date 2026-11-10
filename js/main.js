var names=['Lobby','Fairy Job Mother','LOCIT','Red Light, Green Light','Candlelight','Study in Teal','Golden Hour','Night Garden','Visitor Desk'];
var room=['Lobby','Permanent Collection','Permanent Collection','Permanent Collection','The Art Wing','The Art Wing','The Art Wing','The Art Wing','Visitor Desk'];
var ic={fjm:'<svg viewBox="0 0 100 100" fill="none" stroke="#F2C969" stroke-width="3" stroke-linecap="round"><path d="M22 80 70 32"/><path d="m72 14 3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#F2C969"/><path d="M30 24h18M30 34h12" stroke="#3E8FA0"/></svg>',
loc:'<svg viewBox="0 0 100 100" fill="none" stroke="#F2C969" stroke-width="3"><path d="M30 14c0 30 8 38 20 38s20-8 20-38" stroke-linecap="round"/><circle cx="50" cy="68" r="14" fill="#3E8FA0" fill-opacity=".35"/><circle cx="50" cy="68" r="4" fill="#F2C969"/></svg>',
rlg:'<svg viewBox="0 0 100 100"><rect x="34" y="8" width="32" height="84" rx="12" fill="#1c1714" stroke="#F2C969" stroke-width="3"/><circle cx="50" cy="30" r="9" fill="#D97BA6"/><circle cx="50" cy="70" r="9" fill="#F2C969"/></svg>'};
var D={fjm:{t:'Fairy Job Mother',m:'2026 · Web app',p:'Compares your resume to a job posting, rewrites weak bullets, and shows which skills you’re missing, with projects and short courses to close the gap.',dl:[['Problem','Entry-level applicants can’t tell why their resume isn’t landing.'],['My role','Product lead and promoter.'],['Result','Placeholder: add a number or outcome.']]},
loc:{t:'LOCIT',m:'Location Integrated Tracker · Wearable',p:'A wearable GPS tracker built on a Raspberry Pi, with a system architecture and requirements written around a measurable outcome.',dl:[['Problem','Placeholder: who needed it and why.'],['My role','Requirements and demos for non-technical audiences.'],['Result','Placeholder: add the measured result.']]},
rlg:{t:'Red Light, Green Light',m:'Arduino · Game',p:'An Arduino game where players move on green and freeze on red.',dl:[['Built with','Arduino, LEDs, sensors (placeholder).'],['Result','Placeholder: add a clip or photo.']]}};
var art=[['Candlelight','2026','linear-gradient(180deg,#2c6f80,#14110F 70%),radial-gradient(circle at 50% 75%,#fff4c4,transparent 30%)'],['Study in Teal','2025','linear-gradient(160deg,#3E8FA0,#1c1714)'],['Golden Hour','2025','linear-gradient(160deg,#F2C969,#5a3a1a)'],['Night Garden','2024','linear-gradient(160deg,#1c3a40,#14110F)']];
var H=[];
H.push('<div id="rig"><svg><line id="rl" stroke="#2a2623" stroke-width="3" stroke-linecap="round"/></svg><div id="badge"><div class="a"></div><div><b>Victoria Kayode</b><span>Engineer · Product</span></div></div></div><div class="welcome"><h1>The Museum of Victoria Kayode</h1><p>Scroll to walk the halls. Tap any object to read its label.</p></div>');
['fjm','loc','rlg'].forEach(function(k){H.push('<button class="prod" data-k="'+k+'" aria-label="Read the label for '+D[k].t+'"><i class="cone"></i><span class="vinyl">'+D[k].t+'<small>Permanent Collection</small></span><div class="vit">'+ic[k]+'</div><div class="plinth"><div class="plq"><b>'+D[k].t+'</b>Tap to read</div></div></button>');});
art.forEach(function(p,i){var k='art'+i;D[k]={t:p[0],m:p[1]+' · Digital painting',art:p[2],p:'Placeholder: add the story behind this piece.',dl:[]};
H.push('<div class="hung"><i class="pl"></i><button class="frame" data-k="'+k+'" aria-label="View '+p[0]+'"><i style="position:absolute;inset:0;background:'+p[2]+'"></i></button><div class="lab"><b>'+p[0]+'</b>'+p[1]+' · Digital painting</div></div>');});
H.push('<div class="panel"><h3>Visitor Desk</h3><p><b>AI Evaluation &amp; Technical Research Analyst</b><br>Handshake AI, Nov 2025 to now</p><p><b>AI Product Manager Intern</b><br>Aug to Oct 2025</p><p><b>B.S. Computer Engineering</b><br>Dec 2024</p><a class="btn" href="#">Download resume</a></div><div class="counter"></div>');
var N=H.length,wrap=document.getElementById('items'),items=[],dots=document.getElementById('dots'),sp=document.getElementById('spacers');
H.forEach(function(h,i){var d=document.createElement('div');d.className='item';d.innerHTML=h;wrap.appendChild(d);items.push(d);
var s=document.createElement('div');s.className='snap';sp.appendChild(s);
var b=document.createElement('button');b.setAttribute('aria-label',names[i]);b.onclick=function(){scrollTo({top:i*innerHeight,behavior:'smooth'});};dots.appendChild(b);});
var plane=document.getElementById('plane'),w2=document.getElementById('wall2'),f2=document.getElementById('floor2'),cnt=document.getElementById('count'),rm=document.getElementById('room'),cue=document.getElementById('cue'),bar=document.getElementById('bar'),tick=false;
function cl(x){return Math.max(0,Math.min(1,x));}
function render(){tick=false;var t=scrollY/innerHeight,i0=Math.round(t);
items.forEach(function(el,i){var d=i-t,sc=d>=0?1/(1+.55*d):1+(-d)*.9,op=d>=0?cl(1-d*.7):cl(1+d*1.6);
el.style.transform='scale('+sc.toFixed(3)+')';el.style.opacity=op.toFixed(3);el.style.zIndex=Math.round(100-d*10);el.classList.toggle('on',Math.abs(d)<.4);});
plane.style.backgroundPosition='0 '+(t*150).toFixed(1)+'px,0 0';
var o=cl((t-3.2)/.8);w2.style.opacity=o;f2.style.opacity=o;
cnt.innerHTML=('0'+(i0+1)).slice(-2)+'<small>/ '+('0'+N).slice(-2)+'</small>';rm.textContent=room[i0]+(i0>0&&i0<N-1?' · '+names[i0]:'');
[].forEach.call(dots.children,function(b,j){b.classList.toggle('on',j===i0);});
cue.style.opacity=t>.15?0:1;bar.style.width=(t/(N-1)*100)+'%';
document.getElementById('count').style.color=o>.5?'#f3e6c8':'#2a2623';rm.style.color=o>.5?'#c8bda3':'#6b645a';}
addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(render);}},{passive:true});addEventListener('resize',render);render();
function open(k){var d=D[k],sb=document.getElementById('sb');document.getElementById('st').textContent=d.t;document.getElementById('sm').textContent=d.m;sb.style.display=d.art?'block':'none';if(d.art)sb.style.background=d.art;
document.getElementById('sx').innerHTML='<p>'+d.p+'</p>'+(d.dl.length?'<dl>'+d.dl.map(function(r){return'<dt>'+r[0]+'</dt><dd>'+r[1]+'</dd>';}).join('')+'</dl>':'');document.body.classList.add('open');}
function close(){document.body.classList.remove('open');}
document.addEventListener('click',function(e){var t=e.target.closest('[data-k]');if(t)open(t.dataset.k);});
document.getElementById('veil').onclick=close;document.getElementById('sc').onclick=close;document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});
// lanyard
(function(){var rig=document.getElementById('rig'),bd=document.getElementById('badge'),ln=document.getElementById('rl'),a=.5,v=0,dr=false,L=72;
function draw(){var ax=rig.clientWidth/2,bx=ax+Math.sin(a)*L,by=Math.cos(a)*L;bd.style.transform='translate('+(bx-ax)+'px,'+by+'px) rotate('+(-a*57.3)+'deg)';ln.setAttribute('x1',ax);ln.setAttribute('y1',0);ln.setAttribute('x2',bx);ln.setAttribute('y2',by+2);}
function loop(){if(!dr){v+=-.1*Math.sin(a);v*=.985;a+=v*.11;}draw();requestAnimationFrame(loop);}
function mv(e){if(!dr)return;var r=rig.getBoundingClientRect(),x=e.clientX-(r.left+r.width/2),y=Math.max(30,e.clientY-r.top),n=Math.max(-1.2,Math.min(1.2,Math.atan2(x,y)));v=n-a;a=n;}
rig.addEventListener('pointerdown',function(e){dr=true;rig.setPointerCapture(e.pointerId);mv(e);});rig.addEventListener('pointermove',mv);
rig.addEventListener('pointerup',function(){dr=false;});rig.addEventListener('pointercancel',function(){dr=false;});
if(matchMedia('(prefers-reduced-motion:reduce)').matches){a=0;v=0;}loop();})();
