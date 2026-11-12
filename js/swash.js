/* Swash initials: the first capital of a page title or section heading is set in the script face, like Victoria's name.
   Screen readers get the plain heading; the decorated copy is hidden from them. Mark a heading with data-swash,
   or call window.swash(el) after rendering one. */
(function(){
  'use strict';
  function esc(s){return String(s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];});}
  function swash(el){
    if(!el||el.getAttribute('data-swashed'))return;
    var t=el.textContent.trim();if(!/^[A-Za-z]/.test(t))return;
    el.setAttribute('data-swashed','1');el.classList.add('has-sw');
    el.innerHTML='<span class="sr-only">'+esc(t)+'</span><span aria-hidden="true"><span class="sw">'+esc(t.charAt(0))+'</span>'+esc(t.slice(1))+'</span>';
  }
  window.swash=swash;
  function all(){[].forEach.call(document.querySelectorAll('[data-swash]'),swash);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',all);else all();
})();
