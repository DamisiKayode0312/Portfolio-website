/* Home: render work and art from the data files, and light up the station for the room in view. */
(function(){
  document.documentElement.classList.add('js');
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var STATUS={shipped:'Shipped',prototype:'Prototype',designed:'Designed','in-progress':'In progress',planned:'Planned'};
  var TILT=['-1.5deg','1.2deg','-.8deg','1.6deg'];
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function get(u){return fetch(u).then(function(r){if(!r.ok)throw new Error(u);return r.json();});}

  Promise.all([get('data/projects.json'),get('data/art.json')]).then(function(r){
    var works=document.getElementById('works');
    works.innerHTML=r[0].projects.map(function(p,i){
      var fig=p.caseStudy&&p.caseStudy.sections&&p.caseStudy.sections.built&&p.caseStudy.sections.built.figures;
      var img=fig&&fig[0]?'<img src="'+esc(fig[0].src)+'" alt="'+esc(fig[0].alt)+'" loading="lazy">':'<span class="mono" aria-hidden="true">'+esc(p.title.split(/\s+/).map(function(w){return w[0];}).join('').slice(0,3))+'</span>';
      var href=p.caseStudy?'case-study.html?p='+encodeURIComponent(p.id):'museum.html#'+encodeURIComponent(p.id);
      return '<li class="work reveal"><a href="'+href+'"><div class="pic" style="--tilt:'+TILT[i%TILT.length]+'">'+img+'</div><h3>'+esc(p.title)+'</h3><p class="meta">'+esc(p.meta)+'</p>'+
        (p.status?'<span class="tag">'+esc(STATUS[p.status]||p.status)+'</span>':'')+
        '<span class="go">'+(p.caseStudy?'Read the case study':'See the exhibit label')+'</span></a></li>';
    }).join('');
    document.getElementById('frames').innerHTML=r[1].artworks.map(function(a){
      return '<li class="reveal"><div class="f">'+(a.image?'<img src="'+esc(a.image)+'" alt="'+esc(a.alt)+'" loading="lazy">':'Awaiting artwork')+'</div><b>'+esc(a.title)+'</b><small>'+esc([a.medium,a.year].filter(Boolean).join(', '))+'</small></li>';
    }).join('');
    reveal();
  }).catch(function(e){console.error(e);});

  /* reveal on scroll */
  function reveal(){
    var els=document.querySelectorAll('.reveal');
    if(reduce||!('IntersectionObserver' in window)){[].forEach.call(els,function(el){el.classList.add('in');});return;}
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target);}});},{rootMargin:'0px 0px -10% 0px'});
    [].forEach.call(els,function(el){io.observe(el);});
  }

  /* station rail: mark the room in view and fill the line up to it */
  var links=[].slice.call(document.querySelectorAll('#stations a')),fill=document.getElementById('trackfill');
  var rooms=links.map(function(a){return document.getElementById(a.dataset.room);});
  function spy(){
    var y=innerHeight*.35,cur=0;
    rooms.forEach(function(s,i){if(s&&s.getBoundingClientRect().top<=y)cur=i;});
    if(innerHeight+scrollY>=document.documentElement.scrollHeight-4)cur=rooms.length-1;
    links.forEach(function(a,i){a.classList.toggle('on',i===cur);if(i===cur)a.setAttribute('aria-current','location');else a.removeAttribute('aria-current');});
    var li=links[cur].firstElementChild.getBoundingClientRect(),tr=fill.parentNode.getBoundingClientRect();
    fill.style.width=Math.max(0,li.left+li.width/2-tr.left)+'px';
  }
  var t=false;addEventListener('scroll',function(){if(!t){t=true;requestAnimationFrame(function(){t=false;spy();});}},{passive:true});
  addEventListener('resize',spy);spy();
})();
