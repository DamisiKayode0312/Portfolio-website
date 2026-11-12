/* Screen 04 · Case study. Renders data/exhibits.json for case-study.html?p=<slug>.
   The nine journal questions are fixed here; each exhibit fills what its evidence supports.
   Missing material shows as a visible placeholder, never as invented text. */
(function(){
  'use strict';
  var Q=[
    ['problem','What problem was I solving?'],
    ['why','Why did it matter?'],
    ['role','My role'],
    ['constraints','Constraints'],
    ['research','Research and analysis'],
    ['decisions','Decisions I made, and why'],
    ['built','What I built, recommended or tested'],
    ['results','Results'],
    ['improve','What I would improve next']
  ];
  var EV={verified:'Verified',reported:'Reported',planned:'Planned',awaiting:'Awaiting material'};
  var EVDESC={verified:'supported by one of her documents',reported:'her own statement, supporting file not yet added',planned:'a plan or capability, not a result',awaiting:'not supplied yet'};
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var main=document.getElementById('story');
  function cap(s){s=String(s||'');return s.charAt(0).toUpperCase()+s.slice(1);}
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function chip(ev,src){return '<span class="chip chip-'+esc(ev)+'" title="'+esc(EVDESC[ev]||'')+'">'+esc(EV[ev]||ev)+'</span>'+(src?'<span class="src">'+esc(src)+'</span>':'');}
  function ph(text){return '<p class="placeholder">Placeholder · '+esc(text)+'</p>';}
  var slug=new URLSearchParams(location.search).get('p');
  try{if(slug)sessionStorage.setItem('vg-lastFrame',slug);}catch(e){}

  fetch('data/exhibits.json').then(function(r){if(!r.ok)throw new Error(r.status);return r.json();}).then(function(d){
    var list=d.exhibits,i=-1;list.forEach(function(x,k){if(x.slug===slug)i=k;});
    if(i<0){main.innerHTML='<h1>Exhibit not found</h1><p><a href="index.html#work">Return to the gallery</a></p>';return;}
    render(list[i],list[i+1]||null);
  }).catch(function(){main.innerHTML='<p class="placeholder">The exhibit could not load. Run <code>python3 -m http.server</code> in the project folder and open http://localhost:8000.</p>';});

  function figs(list){return (list||[]).map(function(f){return '<figure class="fig'+(f.small?' fig-sm':'')+'"><img src="'+esc(f.src)+'" alt="'+esc(f.alt)+'" loading="lazy"><figcaption>'+esc(f.caption)+'</figcaption></figure>';}).join('');}
  function linksHtml(x){return x.links&&x.links.length?'<p class="links">'+x.links.map(function(l){return '<a class="btn btn-secondary" href="'+esc(l.href)+'" target="_blank" rel="noopener">'+esc(l.label)+' <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>';}).join('')+'</p>':'';}
  function nextHtml(next){return '<nav class="next" aria-label="Next exhibit">'+(next?
      '<a href="case-study.html?p='+encodeURIComponent(next.slug)+'"><span class="thumb"><span class="pframe pframe--landscape"><span class="pf-art">'+(next.image?'<img src="'+esc(next.image.src)+'" alt="">':'<span class="mini-ph">'+esc(next.title.charAt(0))+'</span>')+'</span><img class="pf-frame" src="assets/frames/frame-landscape.webp" alt="" aria-hidden="true" loading="lazy"></span></span><span class="nt"><span class="lbl">Next exhibit</span><b>'+esc(next.title)+'</b></span><span class="chev" aria-hidden="true">›</span></a>':
      '<a href="index.html#work"><span class="nt"><span class="lbl">End of the collection</span><b>Back to the gallery</b></span><span class="chev" aria-hidden="true">›</span></a>')+'</nav>';}
  function finish(H){main.innerHTML=H.join('');var t=document.getElementById('title');if(window.swash)window.swash(t);t.focus({preventScroll:true});pop();spy();}

  /* Story format: intro, a role/timeline/tools/team row, then a few numbered sections with a headline each.
     Every statement in the data comes from her documents (see PLACEHOLDERS.md); sources are not shown on the page. */
  function renderStory(x,next){
    var st=x.story,H=[];
    H.push('<div class="cs-head story-head">');
    H.push('<p class="cat">'+esc(x.category)+'</p><h1 id="title" tabindex="-1" data-swash>'+esc(x.title)+'</h1>');
    if(st.intro)H.push('<p class="intro">'+esc(st.intro)+'</p>');
    if(st.meta)H.push('<dl class="facts">'+st.meta.map(function(m){return '<div><dt>'+esc(m[0])+'</dt><dd>'+esc(m[1])+'</dd></div>';}).join('')+'</dl>');
    H.push(linksHtml(x));
    if(x.image)H.push('<figure class="hero"><img src="'+esc(x.image.src)+'" alt="'+esc(x.image.alt)+'" style="view-transition-name:hero-'+esc(x.slug)+'"></figure>');
    H.push('</div>');
    H.push('<div class="journal">');
    H.push('<aside class="index" aria-label="Sections"><p class="lbl">The story</p><ol>'+st.sections.map(function(s){return '<li><a href="#'+esc(s.id)+'">'+esc(cap(s.label))+'</a></li>';}).join('')+'</ol></aside>');
    H.push('<div class="body">');
    st.sections.forEach(function(s,n){
      H.push('<section class="entry story" id="'+esc(s.id)+'" data-pop><p class="no">'+('0'+(n+1)).slice(-2)+' · '+esc(cap(s.label))+'</p><h2>'+esc(s.headline)+'</h2>');
      (s.paras||[]).forEach(function(t){H.push('<p class="para">'+esc(t)+'</p>');});
      if(s.stats)H.push('<ul class="stats">'+s.stats.map(function(t){return '<li><b>'+esc(t.n)+'</b><span>'+esc(t.l)+'</span></li>';}).join('')+'</ul>');
      if(s.steps)H.push('<ol class="steps">'+s.steps.map(function(t,k){return '<li><p class="step-t"><span>'+('0'+(k+1)).slice(-2)+' ·</span> '+esc(t.title)+'</p><p>'+esc(t.text)+'</p></li>';}).join('')+'</ol>');
      (s.after||[]).forEach(function(t){H.push('<p class="para">'+esc(t)+'</p>');});
      H.push(figs(s.figures));
      if(s.note)H.push('<p class="note">'+esc(s.note)+'</p>');
      H.push('</section>');});
    H.push('</div></div>');
    H.push(nextHtml(next));
    finish(H);
  }

  function render(x,next){
    document.title=x.title+' · Victoria’s Gallery';
    if(x.kind==='experience'){var bk=document.getElementById('back');bk.href='index.html#experience';bk.querySelector('.back-l').textContent='Back to experience';}
    document.getElementById('mini').innerHTML='Gallery · '+esc(x.title);
    if(x.story)return renderStory(x,next);
    document.getElementById('mini').innerHTML='Gallery · '+esc(x.title);
    var H=[];
    H.push('<div class="cs-head">');
    H.push('<p class="cat">'+esc(x.category)+'</p><h1 id="title" tabindex="-1" data-swash>'+esc(x.title)+'</h1>');
    H.push('<figure class="hero">'+(x.image?'<img src="'+esc(x.image.src)+'" alt="'+esc(x.image.alt)+'" style="view-transition-name:hero-'+esc(x.slug)+'">':'<div class="hero-ph placeholder">Placeholder · Project image (a photo, screen or sketch from Dami)</div>')+'</figure>');
    var S=x.summary||{};
    H.push('<div class="summary">'+[['idea','The idea'],['who','Who it helps'],['how','How it works']].map(function(k){var b=S[k[0]]||{};
      return '<div class="sblock" data-pop><h2>'+k[1]+'</h2>'+(b.text?'<p>'+esc(b.text)+'</p><p class="meta">'+chip(b.ev,b.src)+'</p>':ph(b.needs||'Awaiting material'))+'</div>';}).join('')+'</div>');
    if(x.links&&x.links.length)H.push('<p class="links">'+x.links.map(function(l){return '<a class="btn btn-secondary" href="'+esc(l.href)+'" target="_blank" rel="noopener">'+esc(l.label)+' <span aria-hidden="true">↗</span><span class="sr-only"> (opens in a new tab)</span></a>';}).join('')+'</p>');
    H.push('</div>');

    H.push('<div class="journal">');
    H.push('<aside class="index" aria-label="Sections"><p class="lbl">The story</p><ol>'+Q.map(function(q,n){return '<li><a href="#'+q[0]+'">'+q[1]+'</a></li>';}).join('')+'</ol>'+
      '<div class="key"><p class="lbl">Evidence key</p><ul>'+Object.keys(EV).map(function(k){return '<li>'+chip(k)+' <span>'+EVDESC[k]+'</span></li>';}).join('')+'</ul></div></aside>');
    H.push('<div class="body">');
    Q.forEach(function(q,n){var s=(x.sections||{})[q[0]]||{},items=s.items||[];
      H.push('<section class="entry" id="'+q[0]+'" data-pop><p class="no">'+('0'+(n+1)).slice(-2)+'</p><h2>'+q[1]+'</h2>');
      items.forEach(function(it){H.push('<div class="item"><p>'+esc(it.text)+'</p><p class="meta">'+chip(it.ev,it.src)+'</p></div>');});
      (s.figures||[]).forEach(function(f){H.push('<figure class="fig'+(f.small?' fig-sm':'')+'"><img src="'+esc(f.src)+'" alt="'+esc(f.alt)+'" loading="lazy"><figcaption>'+esc(f.caption)+'</figcaption></figure>');});
      if(s.needs)H.push(ph(s.needs));
      if(!items.length&&!s.needs)H.push(ph('Awaiting material'));
      H.push('</section>');});
    H.push('</div></div>');

    H.push('<nav class="next" aria-label="Next exhibit">'+(next?
      '<a href="case-study.html?p='+encodeURIComponent(next.slug)+'"><span class="thumb"><span class="pframe pframe--landscape"><span class="pf-art">'+(next.image?'<img src="'+esc(next.image.src)+'" alt="">':'<span class="mini-ph">'+esc(next.title.charAt(0))+'</span>')+'</span><img class="pf-frame" src="assets/frames/frame-landscape.webp" alt="" aria-hidden="true" loading="lazy"></span></span><span class="nt"><span class="lbl">Next exhibit</span><b>'+esc(next.title)+'</b></span><span class="chev" aria-hidden="true">›</span></a>':
      '<a href="index.html#work"><span class="nt"><span class="lbl">End of the collection</span><b>Back to the gallery</b></span><span class="chev" aria-hidden="true">›</span></a>')+'</nav>');
    main.innerHTML=H.join('');
    var t=document.getElementById('title');if(window.swash)window.swash(t);t.focus({preventScroll:true});
    pop();spy();
  }

  /* pop-in reveals */
  function pop(){var els=[].slice.call(document.querySelectorAll('[data-pop]'));
    if(reduce||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('in');});return;}
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var el=e.target,sib=[].slice.call(el.parentNode.children);
      el.style.transitionDelay=(Math.max(0,sib.indexOf(el))%4*70)+'ms';el.classList.add('in');io.unobserve(el);});},{threshold:.2});
    els.forEach(function(e){io.observe(e);});}

  /* progress bar, mini header, section index scroll-spy */
  var top=document.getElementById('top'),bar=document.getElementById('progress');
  function spy(){var max=document.documentElement.scrollHeight-innerHeight;bar.style.transform='scaleX('+(max>0?scrollY/max:0).toFixed(4)+')';
    top.classList.toggle('scrolled',scrollY>120);
    var cur=null;[].forEach.call(document.querySelectorAll('.entry'),function(s){if(s.getBoundingClientRect().top<innerHeight*.35)cur=s.id;});
    [].forEach.call(document.querySelectorAll('.index a'),function(a){if(a.getAttribute('href')==='#'+cur)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});}
  var tk=false;addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(function(){tk=false;spy();});}},{passive:true});
  document.addEventListener('click',function(e){var a=e.target.closest('.index a');if(!a)return;var t=document.querySelector(a.getAttribute('href'));if(!t)return;e.preventDefault();
    t.scrollIntoView({behavior:reduce?'auto':'smooth',block:'start'});var h=t.querySelector('h2');h.setAttribute('tabindex','-1');h.focus({preventScroll:true});});
  /* Escape returns to the gallery */
  addEventListener('keydown',function(e){if(e.key==='Escape'&&!e.defaultPrevented){location.href=document.getElementById('back').href;}});
})();
