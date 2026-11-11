/* Exhibition wall: vertical scroll drives one continuous wall horizontally.
   The section is tall (its extra height = the wall's horizontal travel); a sticky stage pins inside it.
   Native scrolling stays in charge (no wheel or touch hijacking, no snapping), so touch, trackpad,
   keyboard and scrollbar all move the wall the same way, forwards and backwards.

   Exhibition.create({section, stage, wall, items, onLayout})
     .update()  re-reads scroll and moves the wall (called on scroll, rAF-throttled)
     .layout()  re-measures (called on resize, image load, font load, wall resize)
     .scrollYFor(el)  the page scroll position that centres an exhibit
     .disabled  true under reduced motion: the wall is laid out as a plain readable list */
(function(){
  'use strict';
  function clamp(x,a,b){return Math.max(a,Math.min(b,x));}
  function smooth(t){t=clamp(t,0,1);return t*t*(3-2*t);}

  function create(o){
    var section=o.section,stage=o.stage,wall=o.wall;
    var reduce=matchMedia('(prefers-reduced-motion: reduce)');
    var api={disabled:false,progress:0,travel:0};
    var items=[],vw=0,stageH=0,stageTop=0,travel=0,x=0,ticking=false;

    function measure(){
      items=[].slice.call(wall.querySelectorAll(o.items)).map(function(el){return {el:el,left:0,w:0};});
      api.disabled=reduce.matches;
      section.classList.toggle('is-static',api.disabled);
      if(api.disabled){section.style.height='';wall.style.transform='';items.forEach(function(it){it.el.style.setProperty('--light','1');});return;}
      vw=stage.clientWidth;stageH=stage.clientHeight;stageTop=parseFloat(getComputedStyle(stage).top)||0;
      /* pad the wall so the first and last exhibits can sit in the centre of the viewport */
      var first=items[0]&&items[0].el,last=items[items.length-1]&&items[items.length-1].el;
      if(first&&last){wall.style.paddingLeft=Math.max(16,(vw-first.offsetWidth)/2)+'px';wall.style.paddingRight=Math.max(16,(vw-last.offsetWidth)/2)+'px';}
      /* positions relative to the wall itself, so exhibits nested in a room wrapper measure correctly */
      var wl=wall.getBoundingClientRect().left;
      items.forEach(function(it){var r=it.el.getBoundingClientRect();it.left=r.left-wl;it.w=r.width;});
      travel=Math.max(0,wall.scrollWidth-vw);api.travel=travel;
      /* one pixel of vertical scroll moves the wall one pixel sideways */
      section.style.height=(stageH+travel+stageTop)+'px';
      if(o.onLayout)o.onLayout(api);
    }
    function progress(){var r=section.getBoundingClientRect(),span=section.offsetHeight-stageH-stageTop;return span>0?clamp((stageTop-r.top)/span,0,1):0;}
    function update(){
      ticking=false;if(api.disabled)return;
      var p=progress();api.progress=p;x=-p*travel;
      wall.style.transform='translate3d('+x.toFixed(1)+'px,0,0)';
      /* lighting: brightest at the centre, easing off over a wide band so a label stays readable */
      var c=vw/2,band=Math.max(vw*.62,420);
      items.forEach(function(it){var mid=it.left+it.w/2+x,k=smooth(1-Math.abs(mid-c)/band);it.el.style.setProperty('--light',k.toFixed(3));it.el.classList.toggle('is-lit',k>.55);});
    }
    function schedule(){if(!ticking){ticking=true;requestAnimationFrame(update);}}
    function relayout(){measure();update();}

    api.update=update;api.layout=relayout;
    /* the page scroll position at which an exhibit sits in the centre */
    api.scrollYFor=function(el){
      var top=section.getBoundingClientRect().top+scrollY;
      if(api.disabled||!travel){var navOff=parseFloat(getComputedStyle(stage).top)||0;return top+el.getBoundingClientRect().top-section.getBoundingClientRect().top-navOff-24;}
      var it=null;items.forEach(function(i){if(i.el===el||i.el.contains(el))it=i;});if(!it)return top;
      var want=clamp(it.left+it.w/2-vw/2,0,travel);
      return top-stageTop+(want/travel)*(section.offsetHeight-stageH-stageTop);
    };

    addEventListener('scroll',schedule,{passive:true});
    var rz;addEventListener('resize',function(){clearTimeout(rz);rz=setTimeout(relayout,80);});
    if('ResizeObserver' in window){new ResizeObserver(function(){clearTimeout(rz);rz=setTimeout(relayout,40);}).observe(wall);}
    wall.addEventListener('load',function(){clearTimeout(rz);rz=setTimeout(relayout,40);},true);
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(relayout);
    if(reduce.addEventListener)reduce.addEventListener('change',relayout);
    /* the stage clips (never scrolls), so focusing an exhibit can't shift it; bring focus into view by scrolling the page */
    /* (runs a frame later so it wins over the browser's own focus scrolling, which only knows about vertical position) */
    wall.addEventListener('focusin',function(e){var it=e.target.closest(o.items);if(!it)return;
      requestAnimationFrame(function(){
        update(); /* place the wall for the current scroll before measuring */
        var r=it.getBoundingClientRect(),navB=stageTop||0;
        if(r.left<0||r.right>innerWidth||r.top<navB||r.bottom>innerHeight)scrollTo({top:api.scrollYFor(it),behavior:reduce.matches?'auto':'smooth'});});});
    relayout();
    return api;
  }
  window.Exhibition={create:create};
})();
