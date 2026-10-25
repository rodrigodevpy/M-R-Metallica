(function(){
  'use strict';
  // WhatsApp da empresa: código do país + DDD + número, só dígitos
  var WHATSAPP='5541992543898', WA_DISPLAY='(41) 99254-3898';
  var $=function(s,c){return (c||document).querySelector(s)};
  var $$=function(s,c){return Array.prototype.slice.call((c||document).querySelectorAll(s))};

  $$('[data-wa]').forEach(function(a){
    a.href='https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent('Preciso de um orçamento, poderia me passar mais informações?');
    if(a.hasAttribute('data-wa-num'))a.textContent=WA_DISPLAY;
  });
  $('#year').textContent=new Date().getFullYear();

  var header=$('#header');
  function onScroll(){header.classList.toggle('scrolled',window.scrollY>40)}
  onScroll();window.addEventListener('scroll',onScroll,{passive:true});

  var burger=$('#burger'),menu=$('#menu');
  function toggleMenu(open){
    menu.classList.toggle('open',open);burger.classList.toggle('open',open);
    burger.setAttribute('aria-expanded',String(open));
    document.body.style.overflow=open?'hidden':'';
  }
  burger.addEventListener('click',function(){toggleMenu(!menu.classList.contains('open'))});
  $$('a',menu).forEach(function(a){a.addEventListener('click',function(){toggleMenu(false)})});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')toggleMenu(false)});

  var sparks=$('#sparks');
  if(sparks&&!matchMedia('(prefers-reduced-motion: reduce)').matches){
    for(var i=0;i<26;i++){
      var s=document.createElement('span');s.className='spark';
      var size=2+Math.random()*3;
      s.style.left=(45+Math.random()*50)+'%';
      s.style.setProperty('--dx',(Math.random()*160-80)+'px');
      s.style.animationDuration=(3+Math.random()*5)+'s';
      s.style.animationDelay=(Math.random()*6)+'s';
      s.style.width=s.style.height=size+'px';
      sparks.appendChild(s);
    }
  }

  // Contadores: valor final já está no HTML; anima ao entrar na tela
  if('IntersectionObserver' in window){
    var co=new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if(!e.isIntersecting)return;
        var el=e.target,end=+el.dataset.count,suf=el.dataset.suffix||'',t0=performance.now();
        (function tick(t){
          var p=Math.min((t-t0)/1600,1),k=1-Math.pow(1-p,3);
          el.textContent=Math.round(end*k)+suf;
          if(p<1)requestAnimationFrame(tick);
        })(t0);
        co.unobserve(el);
      });
    },{threshold:.6});
    $$('[data-count]').forEach(function(el){co.observe(el)});
  }

  var tabs=$$('.tab');
  tabs.forEach(function(tab){tab.addEventListener('click',function(){
    tabs.forEach(function(t){t.classList.remove('active');t.setAttribute('aria-selected','false')});
    $$('.panel').forEach(function(p){p.classList.remove('active')});
    tab.classList.add('active');tab.setAttribute('aria-selected','true');
    $('#tab-'+tab.dataset.tab).classList.add('active');
  })});

  var tel=$('#tel');
  tel.addEventListener('input',function(){
    var v=tel.value.replace(/\D/g,'').slice(0,11);
    if(v.length>10)v=v.replace(/^(\d{2})(\d{5})(\d{4}).*/,'($1) $2-$3');
    else if(v.length>6)v=v.replace(/^(\d{2})(\d{4})(\d{0,4}).*/,'($1) $2-$3');
    else if(v.length>2)v=v.replace(/^(\d{2})(\d{0,5})/,'($1) $2');
    else if(v.length)v='('+v;
    tel.value=v;
  });

  var form=$('#form'),msg=$('#formMsg'),wa=$('#waLink');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    msg.className='form-msg';wa.hidden=true;
    var ok=true;
    $$('[required]',form).forEach(function(f){
      var bad=!f.value.trim()||(f.id==='tel'&&f.value.replace(/\D/g,'').length<10);
      f.classList.toggle('err',bad);if(bad)ok=false;
    });
    if(!ok){msg.textContent='Preencha nome, telefone e serviço corretamente.';return}
    var g=function(id){return $('#'+id).value.trim()||'-'};
    var text='*Solicitação de orçamento – M&R Metalúrgica*\nNome: '+g('nome')+'\nEmpresa: '+g('empresa')+'\nTelefone: '+g('tel')+'\nServiço: '+g('servico')+'\nDetalhes: '+g('msg');
    wa.href='https://wa.me/'+WHATSAPP+'?text='+encodeURIComponent(text);
    wa.hidden=false;
    msg.textContent='Mensagem pronta. Toque no botão laranja para abrir o WhatsApp.';
    msg.classList.add('ok');
  });
  $$('input,select',form).forEach(function(f){f.addEventListener('input',function(){f.classList.remove('err')})});
})();
