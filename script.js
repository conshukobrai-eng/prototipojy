(function(){
  var root=document.documentElement;
  var brl=function(n){return n.toLocaleString('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:0})};
  var $=function(id){return document.getElementById(id)};

  /* Tema */
  try{var saved=localStorage.getItem('brisa-theme');if(saved){root.setAttribute('data-theme',saved)}}catch(e){}
  $('themeBtn').addEventListener('click',function(){
    var cur=root.getAttribute('data-theme');
    var isDark=cur?cur==='dark':window.matchMedia('(prefers-color-scheme: dark)').matches;
    var next=isDark?'light':'dark';
    root.setAttribute('data-theme',next);
    try{localStorage.setItem('brisa-theme',next)}catch(e){}
  });

  /* Simulador */
  var annual={casa:.12,comercio:.17,condominio:.20};
  function simulate(){
    var bill=Number($('bill').value);
    var tipo=document.querySelector('input[name="tipo"]:checked').value;
    var rate=annual[tipo];
    var month=bill*rate;
    $('billOut').textContent=brl(bill);
    $('saveMonth').textContent=brl(month);
    $('saveYear').textContent=brl(month*12);
    $('barPaid').style.width=(100-rate*100)+'%';
    $('barSaved').style.width=(rate*100)+'%';
    $('legPaid').textContent='Você paga '+brl(bill-month);
    $('legPct').textContent='Desconto de '+Math.round(rate*100)+'%';
  }
  $('bill').addEventListener('input',simulate);
  document.querySelectorAll('input[name="tipo"]').forEach(function(r){r.addEventListener('change',simulate)});
  simulate();

  /* Planos: mensal x anual */
  var rates={mensal:{casa:10,comercio:15,condominio:18},anual:{casa:12,comercio:17,condominio:20}};
  function plans(){
    var c=document.querySelector('input[name="ciclo"]:checked').value;
    document.querySelectorAll('[data-plan]').forEach(function(el){
      el.textContent=rates[c][el.getAttribute('data-plan')]+'%';
    });
    document.querySelectorAll('[data-fid]').forEach(function(el){
      el.textContent=c==='anual'?'Contrato de 12 meses':'Sem fidelidade, cancele quando quiser';
    });
  }
  document.querySelectorAll('input[name="ciclo"]').forEach(function(r){r.addEventListener('change',plans)});
  plans();

  /* Formulário de captação */
  var form=$('leadForm'),status=$('formStatus');
  form.addEventListener('submit',function(e){
    e.preventDefault();
    if(!form.checkValidity()){
      status.textContent='Preencha todos os campos e aceite o contato para continuar.';
      form.reportValidity();
      return;
    }
    var nome=$('nome').value.trim().split(' ')[0];
    status.textContent='Pedido registrado, '+nome+'. Neste protótipo nada é enviado; em um site real, o time comercial retornaria pelo WhatsApp informado.';
    form.reset();
  });

  /* Cookies */
  var banner=document.querySelector('#cookie');
  function closeCookie(store){
    banner.hidden=true;document.body.classList.remove('has-cookie');
    if(store){try{localStorage.setItem('brisa-cookie',store)}catch(e){}}
  }
  var choice=null;
  try{choice=localStorage.getItem('brisa-cookie')}catch(e){}
  if(choice){closeCookie()}else{document.body.classList.add('has-cookie')}
  banner.querySelectorAll('[data-cookie]').forEach(function(b){
    b.addEventListener('click',function(){closeCookie(b.getAttribute('data-cookie'))});
  });
})();
