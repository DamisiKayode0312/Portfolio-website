/* Art Gallery hallway. The walker stays centred; the world slides past.
   Walk: ← → / A D (hold), mouse wheel or trackpad, swipe, or tap a frame / dot to walk to it.
   ↑ or Enter at a door goes through it. Under reduced motion every move is instant. */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hall=document.getElementById('hall'),world=document.getElementById('world'),plane=document.getElementById('plane'),beams=document.getElementById('beams'),
      walker=document.getElementById('walker'),dotsEl=document.getElementById('dots'),hint=document.getElementById('hint'),sheet=document.getElementById('sheet');
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}

  /* lights: start with the visitor's colour scheme */
  var lights=document.getElementById('lights');
  function setDark(on){document.body.classList.toggle('dark',on);lights.setAttribute('aria-pressed',on?'true':'false');lights.lastElementChild.textContent=on?'Lights on':'Lights off';}
  setDark(matchMedia('(prefers-color-scheme: dark)').matches);
  lights.addEventListener('click',function(){setDark(!document.body.classList.contains('dark'));});

  var stations=[],x=0,target=null,openOnArrive=null,keys={left:false,right:false},facing=1,last=0,maxX=0,SP=360,moving=false,idleT=0;

  fetch('data/art.json').then(function(r){if(!r.ok)throw new Error(r.status);return r.json();}).then(function(d){build(d.artworks);}).catch(function(e){
    world.innerHTML='<div class="st" style="left:50%"><div class="sign"><h1>Gallery closed</h1><p>The artwork list could not load.</p></div></div>';console.error(e);});

  function build(art){
    stations=[{kind:'sign',label:'Entrance'}];
    art.forEach(function(a){stations.push({kind:'art',label:a.placeholder?'Reserved frame':a.title,a:a});});
    stations.push({kind:'door',label:'About the Curator',href:'home.html#about',title:'About the curator'});
    stations.push({kind:'door',label:'Back to the museum',href:'home.html',title:'Back to the museum'});
    layout();
    var H=[];
    stations.forEach(function(s,i){
      H.push('<div class="st" data-i="'+i+'" style="left:'+s.x+'px">');
      if(s.kind!=='door')H.push('<i class="lamp"></i><i class="glow"></i>');
      if(s.kind==='sign')H.push('<div class="sign"><p class="k">Gallery III</p><h1>Art Gallery</h1><p>Walk the hall to see the work. Every frame has a plaque.</p></div>');
      if(s.kind==='art'){var a=s.a,meta=[a.medium,a.year].filter(Boolean).join(', ');
        H.push('<button class="frame'+(a.image?'':' empty')+'" type="button" data-i="'+i+'" aria-label="'+esc((a.placeholder?'Reserved frame':a.title)+'. Walk to it and open details')+'">'+
          (a.image?'<img src="'+esc(a.image)+'" alt="'+esc(a.alt)+'" draggable="false">':'Awaiting artwork')+'</button>'+
          '<div class="plaque"><b>'+esc(a.title)+'</b><span>'+esc(meta)+'</span></div>');}
      if(s.kind==='door')H.push('<a class="door" href="'+esc(s.href)+'" data-i="'+i+'"><b>'+esc(s.title)+'</b><small>↑ to go in</small></a>');
      H.push('</div>');
    });
    world.innerHTML=H.join('');
    dotsEl.innerHTML=stations.map(function(s,i){return '<button type="button" class="'+(s.kind==='door'?'door-dot':'')+'" data-i="'+i+'" aria-label="Walk to '+esc(s.label)+'"></button>';}).join('');
    var start=parseInt((location.hash.match(/^#(\d+)$/)||[])[1],10);if(start>=0&&start<stations.length)x=stations[start].x;
    render();requestAnimationFrame(tick);
  }

  function layout(){
    var W=innerWidth;SP=Math.max(300,Math.min(520,W*.8));
    stations.forEach(function(s,i){s.x=i*SP;});maxX=(stations.length-1)*SP;
    [].forEach.call(world.children,function(el,i){el.style.left=stations[i].x+'px';});
  }
  addEventListener('resize',function(){var r=maxX?x/maxX:0;layout();x=r*maxX;render();});

  function nearest(){var b=0;stations.forEach(function(s,i){if(Math.abs(s.x-x)<Math.abs(stations[b].x-x))b=i;});return b;}
  function render(){
    var W=innerWidth,n=nearest();
    world.style.transform='translate3d('+(W/2-x).toFixed(1)+'px,0,0)';
    plane.style.backgroundPosition=(-x).toFixed(1)+'px 0';
    beams.style.transform='translate3d('+(-(x%120)).toFixed(1)+'px,0,0)';
    walker.classList.toggle('left',facing<0);walker.classList.toggle('walking',moving&&!reduce);
    [].forEach.call(world.children,function(el,i){el.classList.toggle('near',i===n&&Math.abs(stations[i].x-x)<SP*.35);});
    [].forEach.call(dotsEl.children,function(b,i){b.classList.toggle('on',i===n);if(i===n)b.setAttribute('aria-current','true');else b.removeAttribute('aria-current');});
  }

  function walkTo(i,thenOpen){
    if(!stations[i])return;hideHint();
    if(reduce){x=stations[i].x;target=null;render();if(thenOpen)open(i);return;}
    target=stations[i].x;openOnArrive=thenOpen?i:null;
  }

  var SPEED=420;
  function tick(t){
    var dt=Math.min(.05,(t-(last||t))/1000);last=t;var dx=0;
    var dir=(keys.right?1:0)-(keys.left?1:0);
    if(dir){target=null;openOnArrive=null;dx=dir*SPEED*dt;}
    else if(target!==null){var d=target-x,step=SPEED*1.4*dt;if(Math.abs(d)<=step){dx=d;target=null;if(openOnArrive!==null){var o=openOnArrive;openOnArrive=null;setTimeout(function(){open(o);},120);}}else dx=Math.sign(d)*step;}
    if(dx){x=Math.max(0,Math.min(maxX,x+dx));facing=dx<0?-1:1;moving=true;idleT=0;}
    else{idleT+=dt;if(idleT>.08)moving=false;}
    render();requestAnimationFrame(tick);
  }

  /* keyboard */
  addEventListener('keydown',function(e){
    if(sheet.open||e.metaKey||e.ctrlKey||e.altKey)return;
    var k=e.key;
    if(k==='ArrowRight'||k==='d'||k==='D'){e.preventDefault();hideHint();if(reduce){if(!e.repeat)walkTo(Math.min(stations.length-1,nearest()+1));}else keys.right=true;}
    else if(k==='ArrowLeft'||k==='a'||k==='A'){e.preventDefault();hideHint();if(reduce){if(!e.repeat)walkTo(Math.max(0,nearest()-1));}else keys.left=true;}
    else if(k==='ArrowUp'||k==='w'||k==='W'){var n=nearest(),s=stations[n];if(s&&s.kind==='door'&&Math.abs(s.x-x)<SP*.35){e.preventDefault();location.href=s.href;}}
  });
  addEventListener('keyup',function(e){var k=e.key;if(k==='ArrowRight'||k==='d'||k==='D')keys.right=false;if(k==='ArrowLeft'||k==='a'||k==='A')keys.left=false;});
  addEventListener('blur',function(){keys.left=keys.right=false;});

  /* wheel and trackpad: scrolling walks the hall */
  hall.addEventListener('wheel',function(e){if(sheet.open)return;e.preventDefault();hideHint();target=null;
    var d=Math.abs(e.deltaX)>Math.abs(e.deltaY)?e.deltaX:e.deltaY;if(e.deltaMode===1)d*=32;
    if(reduce){if(Math.abs(d)>20&&!hall._lock){hall._lock=1;walkTo(Math.max(0,Math.min(stations.length-1,nearest()+(d>0?1:-1))));setTimeout(function(){hall._lock=0;},350);}return;}
    x=Math.max(0,Math.min(maxX,x+d*.9));facing=d<0?-1:1;moving=true;idleT=0;},{passive:false});

  /* swipe / drag */
  var drag=null;
  hall.addEventListener('pointerdown',function(e){if(e.target.closest('button,a')||e.button>0)return;drag={sx:e.clientX,x0:x,moved:false};});
  addEventListener('pointermove',function(e){if(!drag)return;var d=drag.sx-e.clientX;if(Math.abs(d)>6)drag.moved=true;if(!drag.moved)return;hideHint();target=null;
    var nx=Math.max(0,Math.min(maxX,drag.x0+d*1.2));facing=nx<x?-1:1;x=nx;moving=true;idleT=0;});
  addEventListener('pointerup',function(){if(drag&&drag.moved&&!reduce){walkTo(nearest());}drag=null;});
  addEventListener('pointercancel',function(){drag=null;});

  /* taps */
  hall.addEventListener('click',function(e){
    var f=e.target.closest('.frame');if(f){var i=+f.dataset.i;if(Math.abs(stations[i].x-x)<4)open(i);else walkTo(i,true);return;}
  });
  dotsEl.addEventListener('click',function(e){var b=e.target.closest('button');if(b)walkTo(+b.dataset.i);});
  /* tabbing onto a frame or door walks there so it is on screen */
  world.addEventListener('focusin',function(e){var el=e.target.closest('[data-i]');if(el){hall.scrollLeft=0;walkTo(+el.dataset.i);}});

  function open(i){var s=stations[i];if(!s||s.kind!=='art')return;var a=s.a;
    document.getElementById('sheet-art').innerHTML=a.image?'<img src="'+esc(a.image)+'" alt="'+esc(a.alt)+'">':'Awaiting artwork';
    document.getElementById('sheet-t').textContent=a.title;
    document.getElementById('sheet-m').textContent=[a.medium,a.year].filter(Boolean).join(', ');
    document.getElementById('sheet-s').textContent=a.placeholder?'This frame is reserved for a piece from the artist.':(a.story||'');
    if(sheet.showModal)sheet.showModal();else sheet.setAttribute('open','');
  }
  sheet.addEventListener('click',function(e){if(e.target===sheet)sheet.close();});

  var hinted=false;function hideHint(){if(!hinted){hinted=true;hint.classList.add('gone');}}
})();
