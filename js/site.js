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
  /* the hero wall scrolls continuously: the five frames are hung twice in one track that slides left forever.
     The copy is hidden from screen readers and the keyboard. It pauses on hover, on keyboard focus and off screen;
     with reduced motion it stays a still, centred row. */
  var heroRow=$('.poster-row'),heroTrack=null;
  function setLoop(){if(!heroTrack)return;var w=heroTrack.firstElementChild.getBoundingClientRect().width;heroTrack.style.setProperty('--loop',Math.max(20,w/(innerWidth<700?32:48)).toFixed(1)+'s');}
  if(heroRow&&!reduce){
    var set=document.createElement('div');set.className='poster-set';
    while(heroRow.firstChild)set.appendChild(heroRow.firstChild);
    var copy=set.cloneNode(true);copy.setAttribute('aria-hidden','true');copy.setAttribute('inert','');
    $$('a',copy).forEach(function(a){a.setAttribute('tabindex','-1');a.removeAttribute('aria-label');});
    $$('img',copy).forEach(function(im){im.removeAttribute('fetchpriority');});
    heroTrack=document.createElement('div');heroTrack.className='poster-track';heroTrack.appendChild(set);heroTrack.appendChild(copy);
    heroRow.appendChild(heroTrack);heroRow.classList.add('is-marquee');
    setLoop();addEventListener('resize',setLoop);
    $$('img',heroTrack).forEach(function(im){if(!im.complete)im.addEventListener('load',setLoop,{once:true});});
    if('IntersectionObserver' in window)new IntersectionObserver(function(es){heroRow.classList.toggle('is-offscreen',!es[0].isIntersecting);}).observe(heroRow);
  }
  /* when the hero opens, the wall fades up already moving, then the name rises */
  function heroIn(base){base=base||0;
    if(reduce||!Element.prototype.animate)return;
    var ease='cubic-bezier(.22,1,.36,1)';
    if(heroRow)heroRow.animate([{opacity:0},{opacity:1}],{duration:1200,delay:base,easing:ease,fill:'backwards'});
    $$('.poster-foot > *').forEach(function(el,i){el.animate([{transform:'translateY(18px)',opacity:0},{transform:'none',opacity:1}],{duration:1000,delay:base+400+i*120,easing:ease,fill:'backwards'});});
  }
  if(!root.classList.contains('ticketing')&&!startHash&&scrollY<40)heroIn();
  var torn=false;
  function enter(instant){
    if(torn)return;torn=true;store('vg-torn','1');
    var done=function(){root.classList.remove('ticketing');setInert(false);entrance.classList.remove('leaving');scrollTo(0,0);var h=$('#hero-h');h&&h.focus({preventScroll:true});update();};
    if(instant||reduce){entrance.style.transition=reduce?'opacity .2s':'none';entrance.style.opacity='0';heroIn();setTimeout(done,reduce?200:0);return;}
    ticket.classList.remove('sway');ticket.classList.add('tearing');
    stub.classList.add('gone');
    setTimeout(function(){ticket.classList.add('leave');entrance.classList.add('leaving');heroIn(300);},120);
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
  var nav=$('#nav'),links=$$('#nav ul a'),sections=$$('main > section'),EX=null;
  function navUpdate(){
    var line=nav.getBoundingClientRect().bottom+1,cur=null,tone='light',probe=innerHeight*.4;
    sections.forEach(function(s){var r=s.getBoundingClientRect();if(r.top<=line&&r.bottom>line)tone=s.dataset.tone;if(r.top<=probe&&r.bottom>probe)cur=s;});
    nav.classList.toggle('on-dark',tone==='dark');
    var group=cur?cur.dataset.group:null,id=cur?cur.id:null;
    links.forEach(function(a){if(a.dataset.group===group)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
    if(positioned&&id&&location.hash!=='#'+id&&!root.classList.contains('ticketing')){try{history.replaceState(null,'','#'+id);}catch(e){}}
  }
  /* go to a section; Work is the top of the moving wall */
  function goTo(id,instant){
    var behavior=instant||reduce?'auto':'smooth',target=null,heading=null;
    if(id==='work'&&EX){var w=$('#work');target=w.getBoundingClientRect().top+scrollY-nav.offsetHeight;heading=$('#work-h');}
    else{var t=document.getElementById(id);if(!t)return false;target=t.getBoundingClientRect().top+scrollY-nav.offsetHeight+1;heading=t.querySelector('h1,h2');}
    scrollTo({top:target,behavior:behavior});try{history.replaceState(null,'','#'+id);}catch(_){}
    if(heading){heading.setAttribute('tabindex','-1');setTimeout(function(){heading.focus({preventScroll:true});},behavior==='auto'?0:600);}
    return true;
  }
  links.concat($$('.brand'),$$('#enter'),$$('.poster-row a[href^="#"]')).forEach(function(a){a.addEventListener('click',function(e){var id=a.getAttribute('href').slice(1);if(goTo(id))e.preventDefault();});});

  /* ---------- the exhibition ---------- */
  var projectsEl=$('#ex-projects'),artEl=$('#salon'),expEl=$('#exp-list'),art=[],lb=$('#lightbox'),lbIndex=0,lbReturn=null;
  function label(cat,title,meta,cta,missing){
    return '<span class="ex-label"><span class="lbl-cat">'+esc(cat)+'</span><span class="lbl-title">'+esc(title)+'</span>'+(meta?'<span class="lbl-meta">'+esc(meta)+'</span>':'')+
      (missing?'<span class="lbl-missing">'+esc(missing)+'</span>':'')+'<span class="lbl-cta">'+esc(cta)+' <span aria-hidden="true">→</span></span></span>';
  }
  function renderExhibition(projects){
    projectsEl.innerHTML=projects.map(function(x,i){
      var kind=x.frame||'landscape';
      var img=x.image?'<img src="'+esc(x.image.src)+'" alt="'+esc(x.image.alt)+'" '+(i?'loading="lazy" ':'')+'style="view-transition-name:hero-'+esc(x.slug)+'">':'<span class="frame-ph">Placeholder · Project image needed</span>';
      return '<div class="ex-item ex-exhibit f-'+kind+(x.small?' is-small':'')+'" data-slug="'+esc(x.slug)+'"><span class="ex-spot" aria-hidden="true"></span>'+
        '<a class="ex-open" href="case-study.html?p='+encodeURIComponent(x.slug)+'" aria-label="'+esc(x.title)+'. '+esc(x.category)+'. Read the case study">'+
        frame(kind,img,i!==0)+label(x.category,x.title,x.teaser,'Read the case study',x.image?'':'Project image needed')+'</a></div>';}).join('');
    /* remember which exhibit was opened, to come back to it */
    projectsEl.addEventListener('click',function(e){var it=e.target.closest('.ex-exhibit');if(it)store('vg-lastFrame',it.dataset.slug);});
    EX=window.Exhibition.create({section:$('#work'),stage:$('#ex-stage'),wall:$('#ex-wall'),items:'.ex-item'});
  }
  /* a museum wall label: title, year, medium, artist (the Playground holds only Victoria's own work) */
  function wallLabel(a){return '<span class="wall-label" aria-hidden="true"><span class="wl-title">“'+esc(a.title)+'”</span>'+[a.year,a.medium].filter(Boolean).map(function(t){return '<span class="wl-line">'+esc(t)+'</span>';}).join('')+'<span class="wl-artist">Victoria Kayode</span></span>';}
  /* Gallery II: a salon hang. Columns of one or two pieces, all centred on one line, beside a title card. */
  function renderSalon(artworks){
    art=artworks;var cols={};
    artworks.forEach(function(a,i){var w=a.wall||{},c=clamp(w.col||(i%4)+2,2,5);(cols[c]=cols[c]||[]).push({a:a,i:i,size:w.size||'m'});});
    var html=Object.keys(cols).sort().map(function(c){return '<div class="salon-col salon-col--'+c+'">'+cols[c].map(function(p){var a=p.a,kind=a.frame||'portrait';
      var inner=a.image?'<img src="'+esc(a.image)+'" alt="'+esc(a.alt)+'" loading="lazy"'+(a.position?' style="object-position:'+esc(a.position)+'"':'')+'>':'<span class="frame-ph">Placeholder · Artwork from Dami</span>';
      return '<button class="salon-piece size-'+esc(p.size)+' f-'+kind+'" type="button" data-i="'+p.i+'" data-pop aria-label="'+esc(a.title)+(a.medium?', '+esc(a.medium):'')+'. View it up close">'+frame(kind,inner)+wallLabel(a)+'</button>';}).join('')+'</div>';}).join('');
    artEl.insertAdjacentHTML('beforeend',html);
    artEl.addEventListener('click',function(e){var b=e.target.closest('button[data-i]');if(b)openLb(+b.dataset.i,b);});
    /* touch screens have no hover: a painting's picture light turns on as it passes the middle of the screen.
       Measured against the window on every scroll (not an IntersectionObserver margin, which browsers ignore
       when the page is shown inside another site's frame, lighting everything on screen) */
    if(!matchMedia('(hover:hover)').matches){
      var pieces=$$('.salon-piece',artEl),lt=false,salon=$('#playground');
      var light=function(){lt=false;var mid=innerHeight/2,band=Math.max(60,innerHeight*.12);
        pieces.forEach(function(b){var r=b.querySelector('.pframe').getBoundingClientRect();b.classList.toggle('is-lit',r.top<mid+band&&r.bottom>mid-band);});};
      addEventListener('scroll',function(){if(!lt){lt=true;requestAnimationFrame(light);}},{passive:true});
      addEventListener('resize',light);light();
      /* only when this page scrolls itself; a frame that shows the whole page at once would freeze the lights */
      if(salon&&document.documentElement.scrollHeight-innerHeight>200)salon.classList.add('scroll-lit');
      else pieces.forEach(function(b){b.classList.remove('is-lit');});
    }
  }
  /* Experience: one card per role, each opening its case study */
  function renderExperience(list){
    expEl.innerHTML=list.map(function(x){return '<li data-pop><a class="exp-card" href="case-study.html?p='+encodeURIComponent(x.slug)+'"><span class="exp-co">'+esc(x.company)+'</span><span class="exp-role">'+esc(x.role)+'</span><span class="exp-dates">'+esc(x.dates)+'</span><span class="exp-sum">'+esc(x.summary)+'</span><span class="exp-cta">Read the case study <span aria-hidden="true">→</span></span></a></li>';}).join('');
  }
  /* after content renders, settle where the address asked for; back from a case study, the visitor stands in front of that exhibit */
  function position(){
    var back=store('vg-lastFrame'),t=null;
    if(startHash==='#work'&&back)t=projectsEl.querySelector('[data-slug="'+back+'"]');
    if(t&&EX){scrollTo(0,EX.scrollYFor(t));EX.update();t.querySelector('.ex-open').focus({preventScroll:true});}
    else if(startHash)goTo(startHash.slice(1),true);
    positioned=true;update();
  }
  function showLb(i){lbIndex=(i+art.length)%art.length;var a=art[lbIndex];
    $('#lb-art').innerHTML=a.image?'<img class="lb-img" src="'+esc(a.image)+'" alt="'+esc(a.alt)+'">':frame(a.frame||'portrait','<div class="frame-ph">Placeholder · Artwork from Dami</div>',false);
    $('#lb-title').textContent=a.placeholder?'Artwork coming':'“'+a.title+'”';
    $('#lb-meta').innerHTML=[a.year,a.medium].filter(Boolean).map(esc).join('<br>');
    $('#lb-blurb').textContent=a.placeholder?'This frame is waiting for a piece from Dami: title, year, medium and a short note.':(a.story||'');}
  /* the painting comes off the wall: it grows out of its frame into the close-up, and goes back when closed */
  var EASE='cubic-bezier(.2,.7,.2,1)',closing=false;
  function pieceArt(i){var b=$('.salon-piece[data-i="'+i+'"]');return b&&b.querySelector('.pf-art');}
  function flip(img,from,reverse,ms){var a=from.getBoundingClientRect(),c=img.getBoundingClientRect();if(!a.width||!c.width)return null;
    var t='translate('+(a.left+a.width/2-(c.left+c.width/2)).toFixed(1)+'px,'+(a.top+a.height/2-(c.top+c.height/2)).toFixed(1)+'px) scale('+(a.width/c.width).toFixed(3)+')';
    var k=[{transform:t,opacity:.6},{transform:'none',opacity:1}];return img.animate(reverse?k.reverse():k,{duration:ms,easing:EASE,fill:'both'});}
  function openLb(i,from){lbReturn=from;showLb(i);if(lb.showModal)lb.showModal();else lb.setAttribute('open','');$('#lb-close').focus();
    var img=$('#lb-art .lb-img'),src=pieceArt(i);if(reduce||!img||!src||!img.animate)return;
    var go=function(){var an=flip(img,src,false,460);if(an)an.onfinish=function(){an.cancel();};
      var cs=getComputedStyle(lb);lb.animate([{backgroundColor:'rgba(250,249,246,0)',boxShadow:'none'},{backgroundColor:cs.backgroundColor,boxShadow:cs.boxShadow}],{duration:380,easing:EASE});
      [].forEach.call(lb.querySelectorAll('.lb-label,.lb-nav'),function(el){el.animate([{opacity:0,transform:'translateY(8px)'},{opacity:1,transform:'none'}],{duration:320,delay:180,easing:EASE,fill:'backwards'});});};
    if(img.complete)go();else img.addEventListener('load',go,{once:true});}
  function closeLb(){if(closing||!lb.open)return;var img=$('#lb-art .lb-img'),src=pieceArt(lbIndex),piece=$('.salon-piece[data-i="'+lbIndex+'"]');if(piece)lbReturn=piece;
    if(reduce||!img||!src||!img.animate){lb.close();return;}
    closing=true;var an=flip(img,src,true,300);lb.animate([{opacity:1},{opacity:0}],{duration:300,easing:'ease-in',fill:'forwards'});
    var done=function(){closing=false;lb.close();lb.getAnimations().forEach(function(x){x.cancel();});if(an)an.cancel();};
    if(an)an.onfinish=done;else done();}
  lb.addEventListener('cancel',function(e){e.preventDefault();closeLb();});
  $('#lb-prev').addEventListener('click',function(){showLb(lbIndex-1);});
  $('#lb-next').addEventListener('click',function(){showLb(lbIndex+1);});
  $('#lb-close').addEventListener('click',closeLb);
  lb.addEventListener('close',function(){if(lbReturn)lbReturn.focus({preventScroll:true});});
  lb.addEventListener('click',function(e){if(e.target===lb)closeLb();});
  lb.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')showLb(lbIndex-1);if(e.key==='ArrowRight')showLb(lbIndex+1);});
  var sx=null;lb.addEventListener('pointerdown',function(e){sx=e.clientX;});lb.addEventListener('pointerup',function(e){if(sx===null)return;var d=e.clientX-sx;sx=null;if(Math.abs(d)>50)showLb(lbIndex+(d<0?1:-1));});
  var bar=$('#ex-bar');

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
    var c=document.createElement('canvas');c.width=pad.width;c.height=pad.height;var x=c.getContext('2d');x.fillStyle='#FAF9F6';x.fillRect(0,0,c.width,c.height);x.drawImage(pad,0,0);a.href=c.toDataURL('image/png');a.click();});
  var rz=null;addEventListener('resize',function(){clearTimeout(rz);rz=setTimeout(sizePad,120);});

  /* ---------- 08 closing ---------- */
  function renderContact(site){
    var r=site.resume&&site.resume.href,gh=site.github&&site.github.href,em=site.email&&site.email.value,li=site.linkedin&&site.linkedin.href;
    var links=[li?'<a href="'+esc(li)+'" target="_blank" rel="noopener">LinkedIn</a>':'',gh?'<a href="'+esc(gh)+'" target="_blank" rel="noopener">GitHub</a>':'',r?'<a href="'+esc(r)+'" download>Résumé</a>':''].filter(Boolean);
    var html=(em?'<a class="btn btn-primary" href="mailto:'+esc(em)+'"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h16v12H4z"/><path d="m4 7 8 6 8-6"/></svg>Email me</a><p class="email-line"><span id="em">'+esc(em)+'</span><button class="copy" type="button" id="copy-em">Copy</button></p>'
      :'<span class="btn btn-primary" aria-disabled="true">Contact: email coming soon</span><p class="note">Placeholder · Contact email not supplied yet.</p>')+
      (links.length?'<p class="contact-links">'+links.join('<span aria-hidden="true">·</span>')+'</p>':'');
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
  function update(){ticking=false;navUpdate();journeyUpdate();if(EX&&bar)bar.style.transform='scaleX('+EX.progress.toFixed(4)+')';}
  addEventListener('scroll',function(){if(!ticking){ticking=true;requestAnimationFrame(update);}},{passive:true});
  addEventListener('resize',function(){requestAnimationFrame(update);});

  Promise.all([getJSON('data/exhibits.json'),getJSON('data/art.json'),getJSON('data/site.json')]).then(function(r){
    var ex=r[0].exhibits;renderExhibition(ex.filter(function(x){return x.kind!=='experience';}));renderExperience(ex.filter(function(x){return x.kind==='experience';}));renderSalon(r[1].artworks);renderJourney(r[2].timeline);renderContact(r[2]);observePop();sizePad();
    /* wait for the display fonts (they change the hero's height) before standing the visitor in front of an exhibit */
    var fontsReady=document.fonts&&document.fonts.ready?Promise.race([document.fonts.ready,new Promise(function(r){setTimeout(r,1500);})]):Promise.resolve();
    fontsReady.then(function(){if(EX)EX.layout();requestAnimationFrame(position);});
  }).catch(function(e){console.error(e);positioned=true;projectsEl.innerHTML='<div class="ex-item ex-panel"><p class="placeholder">The exhibits could not load. Run <code>python3 -m http.server</code> in the project folder and open http://localhost:8000.</p></div>';});
  observePop();sizePad();update();
})();
