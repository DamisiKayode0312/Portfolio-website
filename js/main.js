/* Museum walk. Content lives in data/projects.json and data/art.json; this file only renders it. */
(function(){
var ic={fjm:'<svg viewBox="0 0 100 100" fill="none" stroke="#F2C969" stroke-width="3" stroke-linecap="round"><path d="M22 80 70 32"/><path d="m72 14 3 8 8 3-8 3-3 8-3-8-8-3 8-3z" fill="#F2C969"/><path d="M30 24h18M30 34h12" stroke="#3E8FA0"/></svg>',
locit:'<svg viewBox="0 0 100 100" fill="none" stroke="#F2C969" stroke-width="3"><path d="M30 14c0 30 8 38 20 38s20-8 20-38" stroke-linecap="round"/><circle cx="50" cy="68" r="14" fill="#3E8FA0" fill-opacity=".35"/><circle cx="50" cy="68" r="4" fill="#F2C969"/></svg>',
rlg:'<svg viewBox="0 0 100 100"><rect x="34" y="8" width="32" height="84" rx="12" fill="#1c1714" stroke="#F2C969" stroke-width="3"/><circle cx="50" cy="30" r="9" fill="#D97BA6"/><circle cx="50" cy="70" r="9" fill="#F2C969"/></svg>'};
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
function getJSON(u){return fetch(u).then(function(r){if(!r.ok)throw new Error(u+' '+r.status);return r.json();});}

Promise.all([getJSON('data/projects.json'),getJSON('data/art.json')]).then(function(res){build(res[0].projects,res[1].artworks);}).catch(function(e){
  document.getElementById('items').innerHTML='<div class="item on" style="opacity:1"><div class="welcome"><h1>The museum is closed</h1><p>The exhibits could not load. Run <code>python3 -m http.server</code> in the project folder and open http://localhost:8000.</p></div></div>';
  console.error(e);
});

function build(projects,artworks){
var D={},names=['Lobby'],room=['Lobby'],H=[];
H.push('<div id="rig"><svg><line id="rl" stroke="#2a2623" stroke-width="3" stroke-linecap="round"/></svg><div id="badge"><div class="a"></div><div><b>Victoria Kayode</b><span>Engineer · Product</span></div></div></div><div class="welcome"><h1>The Museum of Victoria Kayode</h1><p>Scroll to walk the halls. Tap any object to read its label.</p></div>');
projects.forEach(function(p){
  D[p.id]=p;names.push(p.title);room.push('Permanent Collection');
  H.push('<button class="prod" data-k="'+esc(p.id)+'" aria-label="Read the label for '+esc(p.title)+'"><i class="cone"></i><span class="vinyl">'+esc(p.title)+'<small>Permanent Collection</small></span><div class="vit">'+(ic[p.icon]||'')+'</div><div class="plinth"><div class="plq"><b>'+esc(p.title)+'</b>Tap to read</div></div></button>');
});
var artStart=H.length;
artworks.forEach(function(a){
  D[a.id]={title:a.title,meta:[a.year,a.medium].filter(Boolean).join(' · '),art:a,
    summary:a.placeholder?'This frame is reserved for a piece from the artist.':a.story,details:[]};
  names.push(a.placeholder?'Reserved frame':a.title);room.push('The Art Wing');
  var inner=a.image?'<img src="'+esc(a.image)+'" alt="'+esc(a.alt)+'">':'<span class="empty">Awaiting artwork</span>';
  H.push('<div class="hung"><i class="pl"></i><button class="frame'+(a.image?'':' is-empty')+'" data-k="'+esc(a.id)+'" aria-label="View '+esc(a.placeholder?'reserved frame':a.title)+'">'+inner+'</button><div class="lab"><b>'+esc(a.title)+'</b>'+esc(D[a.id].meta)+'</div></div>');
});
names.push('Visitor Desk');room.push('Visitor Desk');
H.push('<div class="panel"><h3>Visitor Desk</h3><p><b>AI Evaluation &amp; Technical Research Analyst</b><br>Handshake AI, Nov 2025 to now</p><p><b>AI Product Manager Intern</b><br>Aug to Oct 2025</p><p><b>B.S. Computer Engineering</b><br>Dec 2024</p><a class="btn" href="assets/Victoria_Kayode_Resume.pdf">Download resume</a></div><div class="counter"></div>');

var N=H.length,wrap=document.getElementById('items'),items=[],dots=document.getElementById('dots'),sp=document.getElementById('spacers');
H.forEach(function(h,i){var d=document.createElement('div');d.className='item';d.innerHTML=h;wrap.appendChild(d);items.push(d);
var s=document.createElement('div');s.className='snap';sp.appendChild(s);
var b=document.createElement('button');b.setAttribute('aria-label',names[i]);b.onclick=function(){scrollTo({top:i*innerHeight,behavior:'smooth'});};dots.appendChild(b);});
var plane=document.getElementById('plane'),w2=document.getElementById('wall2'),f2=document.getElementById('floor2'),cnt=document.getElementById('count'),rm=document.getElementById('room'),cue=document.getElementById('cue'),bar=document.getElementById('bar'),tick=false;
function cl(x){return Math.max(0,Math.min(1,x));}
function render(){tick=false;var t=scrollY/innerHeight,i0=Math.max(0,Math.min(N-1,Math.round(t)));
items.forEach(function(el,i){var d=i-t,sc=d>=0?1/(1+.55*d):1+(-d)*.9,op=d>=0?cl(1-d*.7):cl(1+d*1.6);
el.style.transform='scale('+sc.toFixed(3)+')';el.style.opacity=op.toFixed(3);el.style.zIndex=Math.round(100-d*10);el.classList.toggle('on',Math.abs(d)<.4);});
plane.style.backgroundPosition='0 '+(t*150).toFixed(1)+'px,0 0';
var o=cl((t-(artStart-.8))/.8);w2.style.opacity=o;f2.style.opacity=o;
cnt.innerHTML=('0'+(i0+1)).slice(-2)+'<small>/ '+('0'+N).slice(-2)+'</small>';rm.textContent=room[i0]+(i0>0&&i0<N-1?' · '+names[i0]:'');
[].forEach.call(dots.children,function(b,j){b.classList.toggle('on',j===i0);});
cue.style.opacity=t>.15?0:1;bar.style.width=(t/(N-1)*100)+'%';
cnt.style.color=o>.5?'#f3e6c8':'#2a2623';rm.style.color=o>.5?'#c8bda3':'#6b645a';}
addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(render);}},{passive:true});addEventListener('resize',render);render();

/* label sheet */
var lastFocus=null;
function open(k){var d=D[k],sb=document.getElementById('sb');if(!d)return;lastFocus=document.activeElement;
document.getElementById('st').textContent=d.title;document.getElementById('sm').textContent=d.meta;
sb.style.display=d.art?'block':'none';sb.innerHTML=d.art&&d.art.image?'<img src="'+esc(d.art.image)+'" alt="'+esc(d.art.alt)+'">':'';
var html='<p>'+esc(d.summary)+'</p>';
if(d.details&&d.details.length)html+='<dl>'+d.details.map(function(r){return'<dt>'+esc(r.label)+'</dt><dd'+(r.placeholder?' class="ph"':'')+'>'+esc(r.value)+'</dd>';}).join('')+'</dl>';
if(d.caseStudy)html+='<a class="btn cs" href="case-study.html?p='+encodeURIComponent(d.id)+'">Read the case study</a>';
document.getElementById('sx').innerHTML=html;document.body.classList.add('open');
document.getElementById('sc').focus({preventScroll:true});}
function close(){if(!document.body.classList.contains('open'))return;document.body.classList.remove('open');if(lastFocus&&lastFocus.focus)lastFocus.focus({preventScroll:true});}
document.addEventListener('click',function(e){var t=e.target.closest('[data-k]');if(t)open(t.dataset.k);});
document.getElementById('veil').onclick=close;document.getElementById('sc').onclick=close;document.addEventListener('keydown',function(e){if(e.key==='Escape')close();});

/* deep link back from a case study: museum.html#locit */
var h=location.hash.slice(1);if(h&&D[h]){var idx=Object.keys(D).indexOf(h)+1;scrollTo(0,idx*innerHeight);}

lanyard();
}

function lanyard(){var rig=document.getElementById('rig'),bd=document.getElementById('badge'),ln=document.getElementById('rl'),a=.5,v=0,dr=false,L=72;
var reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
function draw(){var ax=rig.clientWidth/2,bx=ax+Math.sin(a)*L,by=Math.cos(a)*L;bd.style.transform='translate('+(bx-ax)+'px,'+by+'px) rotate('+(-a*57.3)+'deg)';ln.setAttribute('x1',ax);ln.setAttribute('y1',0);ln.setAttribute('x2',bx);ln.setAttribute('y2',by+2);}
function loop(){if(!dr){v+=-.1*Math.sin(a);v*=.985;a+=v*.11;}draw();requestAnimationFrame(loop);}
function mv(e){if(!dr)return;var r=rig.getBoundingClientRect(),x=e.clientX-(r.left+r.width/2),y=Math.max(30,e.clientY-r.top),n=Math.max(-1.2,Math.min(1.2,Math.atan2(x,y)));v=n-a;a=n;}
rig.addEventListener('pointerdown',function(e){dr=true;rig.setPointerCapture(e.pointerId);mv(e);});rig.addEventListener('pointermove',mv);
rig.addEventListener('pointerup',function(){dr=false;});rig.addEventListener('pointercancel',function(){dr=false;});
if(reduce){a=0;v=0;}loop();}
})();
