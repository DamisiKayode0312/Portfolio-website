/* Door transition. Call Passage.leave(url) to close the doors and navigate.
   On the arriving page, doors start shut (if we came through them) and open. */
(function(){
  var reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,KEY='museum-passage';
  function doors(shut){var p=document.createElement('div');p.className='passage'+(shut?' shut instant':'');p.setAttribute('aria-hidden','true');p.innerHTML='<i></i><i></i>';document.body.appendChild(p);return p;}
  function arrive(){
    var came=false;try{came=sessionStorage.getItem(KEY)==='1';sessionStorage.removeItem(KEY);}catch(e){}
    var root=document.documentElement;
    if(!came||reduce){root.classList.remove('arriving');return;}
    var p=doors(true);root.classList.remove('arriving');p.offsetWidth;p.classList.remove('instant');
    requestAnimationFrame(function(){requestAnimationFrame(function(){p.classList.remove('shut');});});
    setTimeout(function(){p.remove();},900);
  }
  function leave(url){
    if(reduce){location.href=url;return;}
    try{sessionStorage.setItem(KEY,'1');}catch(e){}
    var p=doors(false);p.offsetWidth;p.classList.add('shut');
    setTimeout(function(){location.href=url;},560);
    /* coming back with the back button restores this page from cache: reopen the doors */
    addEventListener('pageshow',function(e){if(e.persisted){p.remove();try{sessionStorage.removeItem(KEY);}catch(_){}}},{once:true});
  }
  window.Passage={leave:leave};
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',arrive);else arrive();
})();
