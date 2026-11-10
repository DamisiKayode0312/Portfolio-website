/* Case-study template. Renders data/projects.json → projects[id].caseStudy for case-study.html?p=<id>.
   The nine template questions are fixed here; each project fills what its evidence supports,
   and anything missing renders as a visible "Evidence needed" note rather than invented text. */
(function(){
  var QUESTIONS=[
    ['problem','The problem'],
    ['why','Why it mattered'],
    ['role','My role'],
    ['constraints','Constraints'],
    ['research','Research'],
    ['decisions','Decisions and why'],
    ['built','What was built or tested'],
    ['results','Results'],
    ['improve','What I would improve']
  ];
  var STATUS={shipped:'Shipped',prototype:'Prototype',designed:'Designed, not built','in-progress':'In progress',planned:'Planned'};
  var root=document.getElementById('journal');
  function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function fail(msg){root.innerHTML='<p class="loading">'+msg+'</p>';}
  var id=new URLSearchParams(location.search).get('p');
  fetch('data/projects.json').then(function(r){if(!r.ok)throw new Error(r.status);return r.json();}).then(function(data){
    var list=data.projects,idx=-1;
    list.forEach(function(p,i){if(p.id===id)idx=i;});
    var p=list[idx];
    if(!p||!p.caseStudy){fail('This case study is not written yet. <a href="museum.html">Return to the museum</a>.');return;}
    render(p,idx,list);
  }).catch(function(){fail('The journal could not load. Run <code>python3 -m http.server</code> in the project folder and open http://localhost:8000.');});

  function render(p,idx,list){
    var cs=p.caseStudy,s=cs.sections||{},open=0,H=[];
    document.title=p.title+' · Case study · The Museum of Victoria Kayode';
    document.getElementById('back').href='museum.html#'+encodeURIComponent(p.id);
    QUESTIONS.forEach(function(q){var e=s[q[0]];if(!e||!(e.body&&e.body.length)||e.claims)open++;});

    H.push('<header class="head">');
    H.push('<p class="kicker"><span>Field journal</span><span>Exhibit '+('0'+(idx+1)).slice(-2)+'</span></p>');
    H.push('<h1>'+esc(p.title)+'</h1>');
    if(cs.subtitle)H.push('<p class="dek">'+esc(cs.subtitle)+'</p>');
    if(cs.facts&&cs.facts.length)H.push('<dl class="facts">'+cs.facts.map(function(f){return'<div><dt>'+esc(f.label)+'</dt><dd>'+esc(f.value)+'</dd></div>';}).join('')+'</dl>');
    H.push('</header>');
    if(open)H.push('<aside class="draft" role="note"><b>Draft.</b> '+open+' of '+QUESTIONS.length+' entries still need evidence. Notes marked “Evidence needed” are for the author and should be filled or removed before this page is published.</aside>');

    H.push('<ol class="entries">');
    QUESTIONS.forEach(function(q,i){
      var e=s[q[0]]||{},n=('0'+(i+1)).slice(-2);
      H.push('<li class="entry" id="'+q[0]+'"><p class="no">Entry '+n+'</p><h2>'+q[1]+'</h2>');
      (e.body||[]).forEach(function(t){H.push('<p>'+esc(t)+'</p>');});
      (e.figures||[]).forEach(function(f){H.push('<figure><img src="'+esc(f.src)+'" alt="'+esc(f.alt)+'" loading="lazy"><figcaption>'+esc(f.caption)+'</figcaption></figure>');});
      if(e.inventory&&e.inventory.length){
        H.push('<ul class="inventory" aria-label="What exists, by status">'+e.inventory.map(function(it){
          return'<li><span class="tag tag-'+esc(it.status)+'">'+esc(STATUS[it.status]||it.status)+'</span><span class="what">'+esc(it.item)+(it.note?'<small>'+esc(it.note)+'</small>':'')+'</span></li>';}).join('')+'</ul>');
      }
      if(e.claims&&e.claims.length){
        H.push('<div class="claims"><p class="lbl">Unverified figures: not results yet</p><ul>'+e.claims.map(function(c){return'<li>'+esc(c)+'</li>';}).join('')+'</ul></div>');
      }
      if(e.needs)H.push('<p class="needs"><span class="lbl">Evidence needed</span>'+esc(e.needs)+'</p>');
      H.push('</li>');
    });
    H.push('</ol>');

    if(cs.sources&&cs.sources.length)H.push('<footer class="sources"><p class="lbl">Sources for this page</p><ul>'+cs.sources.map(function(x){return'<li>'+esc(x)+'</li>';}).join('')+'</ul></footer>');

    var next=null;for(var j=1;j<=list.length;j++){var c=list[(idx+j)%list.length];if(c.caseStudy&&c.id!==p.id){next=c;break;}}
    H.push('<nav class="end"><a class="btn" href="museum.html#'+encodeURIComponent(p.id)+'">Back to the museum</a>'+(next?'<a class="next" href="case-study.html?p='+encodeURIComponent(next.id)+'">Next: '+esc(next.title)+' →</a>':'')+'</nav>');
    root.innerHTML=H.join('');
  }
})();
