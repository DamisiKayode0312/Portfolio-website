/* Victoria's Gallery. Plain JS, no build step.
   Content: data/exhibits.json, data/art.json, data/site.json. Every animation has a reduced-motion path. */
(function(){
  'use strict';
  var root=document.documentElement;
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var startHash=location.hash,positioned=false; /* don't rewrite the address until the page has settled where the visitor asked to go */
  function $(s,c){return (c||document).querySelector(s);}
  function $$(s,c){return [].slice.call((c||document).querySelectorAll(s));}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
  function store(k,v){try{if(v===undefined)return sessionStorage.getItem(k);sessionStorage.setItem(k,v);}catch(e){return null;}}
  function getJSON(u){return fetch(u).then(function(r){if(!r.ok)throw new Error(u+' '+r.status);return r.json();});}
  /* one picture frame: content sits behind the transparent opening of Victoria's gilt frame */
  function frame(kind,inner,lazy){kind=kind||'landscape';return '<span class="pframe pframe--'+kind+'"><span class="pf-art">'+inner+'</span><img class="pf-frame" src="assets/frames/frame-'+kind+'.webp" alt="" aria-hidden="true" draggable="false" decoding="async"'+(lazy===false?'':' loading="lazy"')+'></span>';}

  /* ---------- 01 ticket ---------- */
  var entrance=$('#entrance'),ticket=$('#ticket'),stub=$('#stub'),scene=$('#scene');
  function setInert(on){['#nav','#main','.foot'].forEach(function(s){var el=$(s);if(el){if(on)el.setAttribute('inert','');else el.removeAttribute('inert');}});}
  if(root.classList.contains('ticketing')){
    setInert(true);
    if(!reduce)ticket.classList.add('sway');
    setTimeout(function(){$('#tear').focus({preventScroll:true});},reduce?0:700);
  }
  var torn=false;
  function enter(instant){
    if(torn)return;torn=true;store('vg-torn','1');
    var done=function(){root.classList.remove('ticketing');setInert(false);entrance.classList.remove('leaving');scrollTo(0,0);var h=$('#welcome-h');h&&h.focus({preventScroll:true});update();};
    if(instant||reduce){entrance.style.transition=reduce?'opacity .2s':'none';entrance.style.opacity='0';setTimeout(done,reduce?200:0);return;}
    ticket.classList.remove('sway');ticket.classList.add('tearing');
    stub.classList.add('gone');
    setTimeout(function(){ticket.classList.add('leave');entrance.classList.add('leaving');},120);
    setTimeout(done,700);
  }
  if(entrance){
    $('#tear').addEventListener('click',function(){enter(false);});
    $('#skip-ticket').addEventListener('click',function(e){e.preventDefault();enter(true);});
    stub.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();enter(false);}});
    /* drag the stub down; threshold 70px or a quick flick */
    var drag=null;
    stub.addEventListener('pointerdown',function(e){if(torn||reduce)return;drag={x:e.clientX,y:e.clientY,t:performance.now(),lastY:e.clientY,lastT:performance.now(),v:0};stub.setPointerCapture(e.pointerId);stub.classList.add('drag');ticket.classList.remove('sway');});
    stub.addEventListener('pointermove',function(e){if(!drag)return;var dy=Math.max(0,e.clientY-drag.y),dx=(e.clientX-drag.x)*.4,now=performance.now();
      drag.v=(e.clientY-drag.lastY)/Math.max(1,now-drag.lastT);drag.lastY=e.clientY;drag.lastT=now;
      ticket.classList.toggle('tearing',dy>8);
      stub.style.transform='translate('+dx+'px,'+(dy*.7)+'px) rotate('+(dx/14+dy/40)+'deg)';});
    function release(e,cancel){if(!drag)return;var dy=e.clientY-drag.y,v=drag.v;drag=null;stub.classList.remove('drag');
      if(!cancel&&(dy>70||v>.6)){stub.style.transform='';enter(false);}
      else{stub.style.transform='';ticket.classList.remove('tearing');if(!reduce)ticket.classList.add('sway');}}
    stub.addEventListener('pointerup',function(e){if(drag&&Math.abs(e.clientY-drag.y)<6&&Math.abs(e.clientX-drag.x)<6){drag=null;stub.classList.remove('drag');enter(false);return;}release(e,false);});
    stub.addEventListener('pointercancel',function(e){release(e,true);});
    /* "kinda 3D": tilt toward the pointer, with a moving highlight */
    if(!reduce&&matchMedia('(hover:hover)').matches){
      entrance.addEventListener('pointermove',function(e){if(drag||torn)return;var r=scene.getBoundingClientRect(),nx=clamp((e.clientX-r.left)/r.width,0,1),ny=clamp((e.clientY-r.top)/r.height,0,1);
        ticket.classList.remove('sway');ticket.style.transform='rotate(-2deg) rotateX('+((.5-ny)*12).toFixed(2)+'deg) rotateY('+((nx-.5)*12).toFixed(2)+'deg)';
        ticket.style.setProperty('--hx',(nx*100)+'%');ticket.style.setProperty('--hy',(ny*100)+'%');});
      entrance.addEventListener('pointerleave',function(){if(!torn){ticket.style.transform='';ticket.classList.add('sway');}});
    }
  }

  /* ---------- nav: active link, tone, hash ---------- */
  var nav=$('#nav'),links=$$('#nav ul a'),sections=$$('main > section');
  function navUpdate(){
    var line=nav.getBoundingClientRect().bottom+1,cur=null,tone='cream',probe=innerHeight*.4;
    sections.forEach(function(s){var r=s.getBoundingClientRect();if(r.top<=line&&r.bottom>line)tone=s.dataset.tone;if(r.top<=probe&&r.bottom>probe)cur=s;});
    nav.classList.toggle('on-dark',tone==='dark');
    var group=cur?cur.dataset.group:null;
    links.forEach(function(a){if(a.dataset.group===group)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
    if(positioned&&cur&&cur.id&&location.hash!=='#'+cur.id&&!root.classList.contains('ticketing')){try{history.replaceState(null,'','#'+cur.id);}catch(e){}}
    document.body.classList.toggle('in-work',!!cur&&cur.id==='work');
  }
  links.concat($$('.brand')).forEach(function(a){a.addEventListener('click',function(e){var id=a.getAttribute('href').slice(1),t=document.getElementById(id);if(!t)return;e.preventDefault();
    t.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});try{history.replaceState(null,'','#'+id);}catch(_){}
    var h=t.querySelector('h1,h2');if(h){h.setAttribute('tabindex','-1');setTimeout(function(){h.focus({preventScroll:true});},reduce?0:500);}});});

  /* ---------- 02 doors ---------- */
  var track=$('#doors-track'),leafL=$('#leaf-l'),leafR=$('#leaf-r'),interior=$('#interior'),bloom=$('#bloom'),seam=$('#seam'),copy=$('#welcome-copy'),welcome=$('#home');
  function doorsP(){var r=track.getBoundingClientRect(),span=r.height-(innerHeight-nav.offsetHeight);return clamp(-r.top/Math.max(1,span),0,1);}
  function doorsUpdate(){
    if(reduce)return;
    var p=doorsP(),o=clamp((p-.1)/.75,0,1),e=o<.5?2*o*o:1-Math.pow(-2*o+2,2)/2;
    leafL.style.transform='rotateY('+(-72*e)+'deg)';leafR.style.transform='rotateY('+(72*e)+'deg)';
    var b=1-.45*e;leafL.style.filter=leafR.style.filter='brightness('+b.toFixed(3)+')';
    interior.style.transform='scale('+(1.12-.12*e).toFixed(3)+')';interior.style.filter='brightness('+(.5+.5*e).toFixed(3)+')';
    bloom.style.opacity=(.9*e).toFixed(3);seam.style.opacity=(1-e).toFixed(3);
    var t=clamp((p-.35)/.25,0,1);copy.style.opacity=(1-t).toFixed(3);copy.style.transform='translateY('+(-24*t).toFixed(1)+'px)';
    welcome.classList.toggle('opened',p>.85);
  }
  var openBtn=$('#open-doors');
  if(reduce){openBtn.textContent='Enter the gallery';}
  openBtn.addEventListener('click',function(){
    var work=$('#work');
    if(reduce){work.scrollIntoView();$('#work-h').focus({preventScroll:true});return;}
    var start=scrollY,end=track.getBoundingClientRect().top+scrollY+track.offsetHeight-(innerHeight-nav.offsetHeight),t0=performance.now();
    (function step(t){var k=clamp((t-t0)/800,0,1),e=k<.5?2*k*k:1-Math.pow(-2*k+2,2)/2;scrollTo(0,start+(end-start)*e);if(k<1)requestAnimationFrame(step);
      else{work.scrollIntoView({behavior:'smooth'});setTimeout(function(){$('#work-h').focus({preventScroll:true});},600);}})(t0);
  });
  /* snap assist: if the visitor stops halfway through the doors, finish the motion */
  var idle=null;
  function snapAssist(){if(reduce)return;clearTimeout(idle);idle=setTimeout(function(){var p=doorsP();if(p>.3&&p<.85){var base=track.getBoundingClientRect().top+scrollY,span=track.offsetHeight-(innerHeight-nav.offsetHeight);
    scrollTo({top:base+span*(p<.55?0:1),behavior:'smooth'});}},250);}

  /* ---------- 03 work gallery ---------- */
  var exhibitsEl=$('#exhibits'),exhibitEls=[],dots=$('#rail-dots'),count=$('#count');
  function renderWork(list){
    var featured=list.filter(function(x){return x.featured;});
    exhibitsEl.innerHTML=featured.map(function(x,i){
      var img=x.image?'<img src="'+esc(x.image.src)+'" alt="'+esc(x.image.alt)+'" loading="'+(i?'lazy':'eager')+'" style="view-transition-name:hero-'+esc(x.slug)+'">':'<div class="frame-ph">Placeholder · Project image needed</div>';
      return '<li class="exhibit" data-slug="'+esc(x.slug)+'"><a href="case-study.html?p='+encodeURIComponent(x.slug)+'" aria-label="'+esc(x.title)+'. '+esc(x.category)+'. Open the case study">'+
        '<i class="pool" aria-hidden="true"></i><span class="lamp" aria-hidden="true"></span><i class="cone" aria-hidden="true"></i>'+
        frame('landscape',img,i===0)+'<span class="plate">'+esc(x.title)+'</span><span class="cat">'+esc(x.category)+'</span><span class="teaser">'+esc(x.teaser)+'</span></a></li>';}).join('');
    exhibitEls=$$('.exhibit',exhibitsEl);
    dots.innerHTML=exhibitEls.map(function(){return '<i></i>';}).join('');
    exhibitEls.forEach(function(li){li.querySelector('a').addEventListener('click',function(){store('vg-lastFrame',li.dataset.slug);});});
    /* arrow keys move between frames when one has focus */
    exhibitsEl.addEventListener('keydown',function(e){var i=exhibitEls.indexOf(e.target.closest('.exhibit'));if(i<0)return;
      var d={ArrowDown:1,ArrowRight:1,ArrowUp:-1,ArrowLeft:-1}[e.key];if(!d)return;var n=exhibitEls[i+d];if(!n)return;e.preventDefault();
      n.scrollIntoView({behavior:reduce?'auto':'smooth',block:'center'});n.querySelector('a').focus({preventScroll:true});});
    /* returning from a case study: centre that frame with its light on */
  }
  /* after content renders, settle on the section the address asked for; back from a case study, centre that frame with its light on */
  function position(){
    var back=store('vg-lastFrame'),t=null;
    if(startHash==='#work'&&back)t=exhibitsEl.querySelector('[data-slug="'+back+'"]');
    if(t){t.scrollIntoView({block:'center'});t.classList.add('lit');t.querySelector('a').focus({preventScroll:true});}
    else if(startHash){var s=document.getElementById(startHash.slice(1));if(s)s.scrollIntoView({block:'start'});}
    positioned=true;update();
  }
  function workUpdate(){
    if(!exhibitEls.length)return;
    var vh=innerHeight,c=vh/2,best=0,bd=1e9;
    exhibitEls.forEach(function(li,i){var g=li.querySelector('.pframe').getBoundingClientRect(),m=(g.top+g.bottom)/2,d=m-c;
      var on=d<vh*.7&&d>-vh*.45;
      if(on&&!li.classList.contains('lit')&&!reduce){li.classList.add('igniting');setTimeout(function(){li.classList.remove('igniting');},280);}
      li.classList.toggle('lit',on);
      if(Math.abs(d)<bd){bd=Math.abs(d);best=i;}});
    exhibitEls.forEach(function(li,i){li.classList.toggle('focused',i===best);});
    [].forEach.call(dots.children,function(d,i){d.classList.toggle('on',i===best);});
    count.textContent=('0'+(best+1)).slice(-2)+' / '+('0'+exhibitEls.length).slice(-2);
  }

  /* ---------- 05 journey ---------- */
  var journey=$('#journey'),fill=$('#journey-fill'),nodes=[];
  function renderJourney(items){
    journey.insertAdjacentHTML('beforeend',items.map(function(m){return '<li><span class="node" aria-hidden="true"></span><span class="mlabel">'+esc(m.label)+'</span><p class="detail">'+esc(m.detail)+(m.needs?'<span class="needs">Placeholder · '+esc(m.needs)+'</span>':'')+'</p></li>';}).join(''));
    nodes=$$('li',journey);
    if(reduce){nodes.forEach(function(n){n.classList.add('lit');});}
  }
  function journeyUpdate(){
    if(!nodes.length)return;
    var line=innerHeight*.58,jr=journey.getBoundingClientRect(),lastLit=-1;
    if(reduce){var l=nodes[nodes.length-1].querySelector('.node').getBoundingClientRect();fill.style.height=(l.top+11-jr.top-12)+'px';return;}
    nodes.forEach(function(n,i){var r=n.querySelector('.node').getBoundingClientRect(),on=r.top+r.height/2<=line;
      if(on&&!n.classList.contains('lit')){n.classList.add('pulse');setTimeout(function(){n.classList.remove('pulse');},1700);}
      n.classList.toggle('lit',on);if(on)lastLit=i;});
    var first=nodes[0].querySelector('.node').getBoundingClientRect(),last=nodes[nodes.length-1].querySelector('.node').getBoundingClientRect();
    var max=last.top+last.height/2-(first.top+first.height/2);
    fill.style.height=clamp(line-(first.top+first.height/2),0,max)+'px';
  }

  /* ---------- 06 playground ---------- */
  var art=[],wall=$('#artwall'),curtains=$('#curtains'),lb=$('#lightbox'),lbIndex=0,lbReturn=null;
  function renderArt(list){
    art=list;
    wall.innerHTML=list.map(function(a,i){
      var inner=a.image?'<img src="'+esc(a.image)+'" alt="'+esc(a.alt)+'" loading="lazy">':'<div class="frame-ph">Placeholder · Artwork from Dami</div>';
      return '<li data-pop><button type="button" data-i="'+i+'" aria-label="'+esc(a.placeholder?'Artwork placeholder '+(i+1):a.title)+'. Open">'+frame(a.frame||'portrait',inner)+'<span class="plq">'+esc(a.title)+'</span></button></li>';}).join('');
    observePop();
  }
  wall.addEventListener('click',function(e){var b=e.target.closest('button[data-i]');if(b)openLb(+b.dataset.i,b);});
  function showLb(i){lbIndex=(i+art.length)%art.length;var a=art[lbIndex];
    $('#lb-art').innerHTML=frame(a.frame||'portrait',a.image?'<img src="'+esc(a.image)+'" alt="'+esc(a.alt)+'">':'<div class="frame-ph">Placeholder · Artwork from Dami</div>',false);
    $('#lb-title').textContent=a.placeholder?'Artwork coming':a.title;
    $('#lb-meta').textContent=[a.medium,a.year].filter(Boolean).join(' · ');
    $('#lb-blurb').textContent=a.placeholder?'This frame is waiting for a piece from Dami: title, year, medium and a short note.':(a.story||'');}
  function openLb(i,from){lbReturn=from;showLb(i);if(lb.showModal)lb.showModal();else lb.setAttribute('open','');$('#lb-close').focus();}
  $('#lb-prev').addEventListener('click',function(){showLb(lbIndex-1);});
  $('#lb-next').addEventListener('click',function(){showLb(lbIndex+1);});
  $('#lb-close').addEventListener('click',function(){lb.close();});
  lb.addEventListener('close',function(){if(lbReturn)lbReturn.focus();});
  lb.addEventListener('click',function(e){if(e.target===lb)lb.close();});
  lb.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')showLb(lbIndex-1);if(e.key==='ArrowRight')showLb(lbIndex+1);});
  var sx=null;lb.addEventListener('pointerdown',function(e){sx=e.clientX;});lb.addEventListener('pointerup',function(e){if(sx===null)return;var d=e.clientX-sx;sx=null;if(Math.abs(d)>50)showLb(lbIndex+(d<0?1:-1));});
  function curtainsUpdate(){
    if(reduce||!curtains)return;
    var r=wall.getBoundingClientRect(),p=clamp((innerHeight-r.top)/(innerHeight*.6),0,1),e=1-Math.pow(1-p,3);
    curtains.children[0].style.transform='translateX('+(-102*e)+'%)';curtains.children[1].style.transform='translateX('+(102*e)+'%)';
    curtains.style.visibility=e>=1?'hidden':'visible';
  }

  /* ---------- 07 doodle ---------- */
  var pad=$('#pad'),ctx=pad.getContext('2d'),strokes=[],cur=null,color='',sizes={S:3,M:6,L:12},size='M';
  var SW=[['Burgundy','--sw-burgundy'],['Rose','--sw-rose'],['Ochre','--sw-ochre'],['Green','--sw-green'],['Blue','--sw-blue'],['Lavender','--sw-lavender']];
  var cs=getComputedStyle(root);
  $('#swatches').innerHTML=SW.map(function(s,i){var c=cs.getPropertyValue(s[1]).trim();return '<button type="button" data-c="'+c+'" aria-pressed="'+(i?'false':'true')+'" aria-label="'+s[0]+'" style="--c:'+c+'"><i></i></button>';}).join('');
  color=$('#swatches button').dataset.c;
  $('#swatches').addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;color=b.dataset.c;$$('#swatches button').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false');});});
  $('#size').addEventListener('click',function(){size={S:'M',M:'L',L:'S'}[size];$('#size-l').textContent=size;this.setAttribute('aria-label','Brush size: '+{S:'small',M:'medium',L:'large'}[size]);});
  function sizePad(){var r=pad.getBoundingClientRect(),d=window.devicePixelRatio||1;if(!r.width)return;pad.width=Math.round(r.width*d);pad.height=Math.round(r.height*d);ctx.setTransform(d,0,0,d,0,0);redraw();}
  function drawStroke(s){var w=pad.clientWidth;if(s.pts.length<1)return;ctx.strokeStyle=s.c;ctx.fillStyle=s.c;ctx.lineCap='round';ctx.lineJoin='round';
    if(s.pts.length===1){var p=s.pts[0];ctx.beginPath();ctx.arc(p[0]*w,p[1]*w,s.w*p[2]/2,0,7);ctx.fill();return;}
    for(var i=1;i<s.pts.length;i++){var a=s.pts[i-1],b=s.pts[i];ctx.lineWidth=s.w*b[2];ctx.beginPath();ctx.moveTo(a[0]*w,a[1]*w);ctx.lineTo(b[0]*w,b[1]*w);ctx.stroke();}}
  function redraw(){ctx.clearRect(0,0,pad.width,pad.height);strokes.forEach(drawStroke);}
  function pt(e){var r=pad.getBoundingClientRect(),w=r.width,pr=e.pressure&&e.pointerType==='pen'?.4+e.pressure:1;return [(e.clientX-r.left)/w,(e.clientY-r.top)/w,pr];}
  pad.addEventListener('pointerdown',function(e){pad.setPointerCapture(e.pointerId);cur={c:color,w:sizes[size],pts:[pt(e)]};strokes.push(cur);drawStroke(cur);});
  pad.addEventListener('pointermove',function(e){if(!cur)return;var evs=e.getCoalescedEvents?e.getCoalescedEvents():[e];evs.forEach(function(ev){cur.pts.push(pt(ev));});
    var n=cur.pts.length,s={c:cur.c,w:cur.w,pts:cur.pts.slice(Math.max(0,n-evs.length-1))};drawStroke(s);});
  ['pointerup','pointercancel','pointerleave'].forEach(function(t){pad.addEventListener(t,function(){cur=null;});});
  $('#undo').addEventListener('click',function(){strokes.pop();redraw();});
  $('#clear').addEventListener('click',function(){if(reduce){strokes=[];redraw();return;}pad.classList.add('clearing');setTimeout(function(){strokes=[];redraw();pad.classList.remove('clearing');},200);});
  $('#save').addEventListener('click',function(){var a=document.createElement('a');a.download='my-doodle.png';
    var c=document.createElement('canvas');c.width=pad.width;c.height=pad.height;var x=c.getContext('2d');x.fillStyle='#FBF4EA';x.fillRect(0,0,c.width,c.height);x.drawImage(pad,0,0);a.href=c.toDataURL('image/png');a.click();});
  var rz=null;addEventListener('resize',function(){clearTimeout(rz);rz=setTimeout(sizePad,120);});

  /* ---------- 08 closing ---------- */
  function renderContact(site){
    var r=site.resume&&site.resume.href,gh=site.github&&site.github.href,em=site.email&&site.email.value,li=site.linkedin&&site.linkedin.href;
    var resumeBtn=r?'<a class="btn btn-secondary" href="'+esc(r)+'" download><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4v11m0 0-4-4m4 4 4-4M5 20h14"/></svg>Download résumé</a>':'<span class="btn btn-secondary" aria-disabled="true">Résumé coming soon</span>';
    var html=(em?'<a class="btn btn-primary" href="mailto:'+esc(em)+'"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>Contact</a><p class="row"><span id="em">'+esc(em)+'</span> <button class="tool" type="button" id="copy-em">Copy</button></p>'
      :'<span class="btn btn-primary" aria-disabled="true">Contact: email coming soon</span><p class="note">Placeholder · Contact email not supplied yet.</p>')+
      '<div class="row">'+(li?'<a class="btn btn-secondary" href="'+esc(li)+'">LinkedIn</a>':'<span class="btn btn-secondary" aria-disabled="true">LinkedIn coming soon</span>')+resumeBtn+'</div>'+
      (gh?'<a class="btn btn-secondary" href="'+esc(gh)+'">GitHub</a>':'');
    $('#contact-actions').innerHTML=html;
    var a=$('#resume-about');if(r){a.href=r;a.setAttribute('download','');}else{a.removeAttribute('href');a.setAttribute('aria-disabled','true');a.textContent='Résumé coming soon';}
    var cp=$('#copy-em');if(cp)cp.addEventListener('click',function(){navigator.clipboard&&navigator.clipboard.writeText(em).then(function(){cp.textContent='Copied';});});
  }

  /* ---------- pop-in reveals ---------- */
  var io=null;
  function observePop(){
    var els=$$('[data-pop]:not(.in)');
    if(reduce||!('IntersectionObserver' in window)){els.forEach(function(el){el.classList.add('in');});return;}
    if(!io)io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target,sib=$$('[data-pop]',el.parentNode).filter(function(x){return x.parentNode===el.parentNode;});
      el.style.transitionDelay=(Math.max(0,sib.indexOf(el))*70)+'ms';el.classList.add('in');io.unobserve(el);});},{threshold:.2});
    els.forEach(function(el){io.observe(el);});
  }

  /* ---------- one scroll loop ---------- */
  var ticking=false;
  function update(){ticking=false;navUpdate();doorsUpdate();workUpdate();journeyUpdate();curtainsUpdate();}
  addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(update);}snapAssist();},{passive:true});
  addEventListener('resize',function(){requestAnimationFrame(update);});

  Promise.all([getJSON('data/exhibits.json'),getJSON('data/art.json'),getJSON('data/site.json')]).then(function(r){
    renderWork(r[0].exhibits);renderArt(r[1].artworks);renderJourney(r[2].timeline);renderContact(r[2]);observePop();sizePad();requestAnimationFrame(position);
  }).catch(function(e){console.error(e);positioned=true;exhibitsEl.innerHTML='<li class="exhibit"><p class="placeholder">The exhibits could not load. Run <code>python3 -m http.server</code> in the project folder and open http://localhost:8000.</p></li>';});
  observePop();sizePad();update();
})();
