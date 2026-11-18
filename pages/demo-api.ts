import {menu,stages} from '../lib/menu';
const key='pateo-pages-demo-v1';
export async function demoFetch(_url:string, options?:RequestInit){
 try {
  const state=JSON.parse(localStorage.getItem(key)||'null')||{products:menu.map(p=>({...p,available:true})),orders:[]};
  if(!state.monthlyDemoSeeded){
   const clients=[['Cliente de teste','11999990000'],['Ana · teste','11999990001'],['Bruno · teste','11999990002']];
   clients.forEach(([customer,phone],c)=>{for(let n=0;n<2;n++){const id='demo-monthly-'+c+'-'+n;if(state.orders.some((o:any)=>o.id===id))continue;const p=state.products.find((p:any)=>p.id===(n?'executivo':'carne'))||state.products[0];const date=new Date();date.setDate(Math.max(1,date.getDate()-n-1));const total=p.price*(n?1:2),paid=c===1&&n===0?1000:0;state.orders.push({id,createdAt:date.toISOString(),deliveredAt:date.toISOString(),customer,phone,delivery:'Retirada',detail:'',slot:'Pedido fictício para testar conta mensal',source:'Demonstração',isTest:true,paymentIntent:'Conta mensal',status:'Entregue',items:[{key:id,id:p.id,name:p.name,price:p.price,qty:n?1:2,note:'TESTE'}],total,paid,payments:paid?[{id:id+'-payment',amount:paid,method:'Pix',operator:'Atendente de teste',date:date.toISOString()}]:[]})}});
   state.monthlyDemoSeeded=true;localStorage.setItem(key,JSON.stringify(state));
  }
  const seedNow=new Date(),seedMonth=`${seedNow.getFullYear()}-${String(seedNow.getMonth()+1).padStart(2,'0')}`;
  if(!state.richMonthlyDemoMonths?.includes(seedMonth)){
   const clients=[['Cliente de teste','11999990000'],['Ana · teste','11999990001'],['Bruno · teste','11999990002']];
   const combos=[['pao','cafe'],['executivo','suco'],['queijo','agua'],['tapioca','cafe'],['bife','suco'],['misto','cafe'],['carne','agua'],['vegetariano','suco'],['banana','cafe'],['burger','suco'],['minas','agua'],['cafecombo']];
   clients.forEach(([customer,phone],c)=>{for(let day=1;day<seedNow.getDate();day++){
    const date=new Date(seedNow.getFullYear(),seedNow.getMonth(),day);if([0,6].includes(date.getDay())||(day+c)%6===0)continue;
    const times=(day+c)%3===0?[8,12,16]:(day+c)%2===0?[12,16]:[12];
    times.forEach((hour,index)=>{const id=`demo-rich-${seedMonth}-${c}-${day}-${index}`;if(state.orders.some((o:any)=>o.id===id))return;
     date.setHours(hour,((day+c+index)*7)%60,0,0);const createdAt=date.toISOString();const picked=combos[(day+c*3+index*4)%combos.length];
     const items=picked.map((productId,i)=>{const p=state.products.find((p:any)=>p.id===productId)||menu.find(p=>p.id===productId)!;const qty=i===0&&(day+c)%5===0?2:1;return {key:id+'-'+i,id:p.id,name:p.name,price:p.price,qty,note:i===0?['TESTE · Sem cebola','TESTE · Embalar separado','TESTE · Sem açúcar','TESTE · Preparo normal'][(day+c)%4]:''}});
     const total=items.reduce((a,i)=>a+i.price*i.qty,0);const paid=(day+c+index)%7===0?total:(day+c+index)%5===0?Math.round(total/2):0;
     const delivery=['Retirada','Comer no local','Entrega'][(day+c)%3];const deliveredAt=new Date(date.getTime()+25*60000).toISOString();
     state.orders.push({id,customer,phone,createdAt,deliveredAt,delivery,detail:delivery==='Entrega'?'Recepção da FB':'',slot:hour+':'+String(date.getMinutes()).padStart(2,'0'),source:'Demonstração',isTest:true,paymentIntent:'Conta mensal',status:'Entregue',items,total,paid,payments:paid?[{id:id+'-receipt',amount:paid,method:(day+c)%2?'Pix':'Dinheiro',operator:'Atendente de teste',date:deliveredAt}]:[]});
    });
   }});
   state.richMonthlyDemoMonths=[...(state.richMonthlyDemoMonths||[]),seedMonth];localStorage.setItem(key,JSON.stringify(state));
  }
  if(!options)return Response.json(state);
  const b=JSON.parse(String(options.body));
  const role=sessionStorage.getItem('pateo-test-role');
  const fail=(error:string)=>Response.json({error},{status:400});
  if((b.action!=='order'||b.manual)&&role!=='admin')return fail('Entre como administrador de teste para esta ação.');
  if(b.action==='order'){
   if(localStorage.getItem('pateo-open')==='no')return fail('A loja está fechada para novos pedidos.');
   if(state.orders.some((o:any)=>o.id===b.id))return Response.json({ok:true,id:b.id});
   if(!b.customer?.trim()||!/^\d{10,11}$/.test(b.phone.replace(/\D/g,'')))return fail('Preencha nome e telefone válido. Use dados fictícios.');
   if(b.delivery==='Entrega'&&!b.detail?.trim())return fail('Informe o endereço ou local de entrega.');
   if(b.paymentIntent==='Conta mensal'&&(!(b.manual&&role==='admin')&&(!(role==='user'||role==='admin')||b.phone!=='11999990000')))return fail('Entre na conta de teste para anotar na conta mensal.');
   if(!b.items?.length)return fail('Sua sacola está vazia.');
   const items=[];
   for(const i of b.items){const p=state.products.find((p:any)=>p.id===i.id);if(!p?.available||!Number.isInteger(i.qty)||i.qty<1||i.qty>20)return fail('Confira os itens: um produto pode estar indisponível.');items.push({...i,name:p.name,price:p.price});}
   state.orders.unshift({...b,phone:b.phone.replace(/\D/g,''),items,createdAt:new Date().toISOString(),total:items.reduce((a,i)=>a+i.price*i.qty,0),paid:0,status:'Recebido',payments:[]});
  }else if(b.action==='product'){
   const p=state.products.find((p:any)=>p.id===b.id);
   if(!p||!Number.isInteger(b.price)||b.price<100||b.price>100000)return fail('Preço inválido.');
   Object.assign(p,{price:b.price,available:!!b.available});
  }else{
   const o=state.orders.find((o:any)=>o.id===b.id);if(!o)return fail('Pedido não encontrado.');
   if(b.action==='status'){
    const current=stages.indexOf(o.status),next=stages.indexOf(b.status);
    if(!((current>=0&&next===current+1)||(b.status==='Cancelado'&&o.status!=='Entregue'&&o.status!=='Cancelado'&&o.paid===0)))return fail('Mudança de status não permitida.');
    o.status=b.status;if(b.status==='Entregue')o.deliveredAt=new Date().toISOString();
   }else if(b.action==='payment'){
    if(o.payments.some((p:any)=>p.id===b.paymentId))return Response.json({ok:true});
    if(o.status==='Cancelado'||!Number.isInteger(b.amount)||b.amount<=0||b.amount>o.total-o.paid||!b.operator?.trim())return fail('Confira o valor e o responsável pelo recebimento.');
    o.paid+=b.amount;o.payments.push({id:b.paymentId,amount:b.amount,method:b.method,operator:b.operator,date:new Date().toISOString()});
   }else return fail('Ação inválida.');
  }
  localStorage.setItem(key,JSON.stringify(state));return Response.json({ok:true,id:b.id});
 }catch{return Response.json({error:'Não foi possível salvar o teste neste navegador. Confira se o armazenamento está permitido.'},{status:500});}
}
