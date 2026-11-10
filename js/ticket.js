(function(){
  var stage=document.getElementById('stage'), stub=document.getElementById('stub'), wrap=stub.parentNode, tear=document.getElementById('tear');
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* decorative barcode */
  var svg=document.getElementById('bars'),x=0,seed=7,out='';
  function rnd(){seed=(seed*9301+49297)%233280;return seed/233280}
  while(x<198){var w=1+Math.floor(rnd()*4);if(rnd()>.38)out+='<rect x="'+x+'" y="0" width="'+w+'" height="46" fill="#26231F"/>';x+=w+1+Math.floor(rnd()*2)}
  svg.innerHTML=out;
  /* date and year */
  try{var d=new Date();document.getElementById('date').textContent=d.toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'});document.getElementById('yr').textContent=d.getFullYear()+' season'}catch(e){}
  /* tearing */
  var torn=false;
  function doTear(){
    if(torn)return;torn=true;
    stage.classList.add('open');
    stub.style.transform='';stub.classList.add('gone');
    tear.disabled=true;
    var doors=document.getElementById('doors');
    var q=document.getElementById('quick');if(q)q.style.display='none';
    var go=doors.querySelector('a');if(go&&!reduce)setTimeout(function(){go.focus({preventScroll:true})},700);
  }
  tear.addEventListener('click',doTear);
  /* walk in through the doors instead of a hard page jump */
  var go=document.querySelector('#doors .go');
  if(go)go.addEventListener('click',function(e){if(!window.Passage||e.metaKey||e.ctrlKey||e.shiftKey||e.button!==0)return;e.preventDefault();Passage.leave(go.getAttribute('href'));});
  var sy=0,sx=0,drag=false;
  stub.addEventListener('pointerdown',function(e){if(e.target===tear||torn)return;drag=true;sy=e.clientY;sx=e.clientX;stub.classList.add('drag');stub.setPointerCapture(e.pointerId)});
  stub.addEventListener('pointermove',function(e){if(!drag)return;var dy=Math.max(0,e.clientY-sy),dx=(e.clientX-sx)*.4;stub.style.transform='translate('+dx+'px,'+dy*.7+'px) rotate('+(dx/14+dy/40)+'deg)'});
  function end(e){if(!drag)return;drag=false;stub.classList.remove('drag');var dy=e.clientY-sy;if(dy>70){doTear()}else{stub.style.transform=''}}
  stub.addEventListener('pointerup',end);stub.addEventListener('pointercancel',function(){drag=false;stub.classList.remove('drag');stub.style.transform=''});
})();
