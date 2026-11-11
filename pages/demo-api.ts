import {menu,stages} from '../lib/menu';
const key='pateo-pages-demo-v1';
export async function demoFetch(_url:string, options?:RequestInit){
 try {
  const state=JSON.parse(localStorage.getItem(key)||'null')||{products:menu.map(p=>({...p,available:true})),orders:[]};
  if(!options)return Response.json(state);
  const b=JSON.parse(String(options.body));
  const fail=(error:string)=>Response.json({error},{status:400});
  if(b.action==='order'){
   if(state.orders.some((o:any)=>o.id===b.id))return Response.json({ok:true,id:b.id});
   if(!b.customer?.trim()||!/^\d{10,11}$/.test(b.phone.replace(/\D/g,'')))return fail('Preencha nome e telefone válido. Use dados fictícios.');
   if(b.delivery==='Entrega'&&!b.detail?.trim())return fail('Informe o endereço ou local de entrega.');
   if(!b.items?.length)return fail('Sua sacola está vazia.');
   const items=[];
   for(const i of b.items){const p=state.products.find((p:any)=>p.id===i.id);if(!p?.available||!Number.isInteger(i.qty)||i.qty<1||i.qty>20)return fail('Confira os itens: um produto pode estar indisponível.');items.push({...i,name:p.name,price:p.price});}
   state.orders.unshift({...b,items,createdAt:new Date().toISOString(),total:items.reduce((a,i)=>a+i.price*i.qty,0),paid:0,status:'Recebido',payments:[]});
  }else if(b.action==='product'){
   const p=state.products.find((p:any)=>p.id===b.id);
   if(!p||!Number.isInteger(b.price)||b.price<100||b.price>100000)return fail('Preço inválido.');
   Object.assign(p,{price:b.price,available:!!b.available});
  }else{
   const o=state.orders.find((o:any)=>o.id===b.id);if(!o)return fail('Pedido não encontrado.');
   if(b.action==='status'){
    const current=stages.indexOf(o.status),next=stages.indexOf(b.status);
    if(!((current>=0&&next===current+1)||(b.status==='Cancelado'&&o.status!=='Entregue'&&o.status!=='Cancelado'&&o.paid===0)))return fail('Mudança de status não permitida.');
    o.status=b.status;
   }else if(b.action==='payment'){
    if(o.payments.some((p:any)=>p.id===b.paymentId))return Response.json({ok:true});
    if(o.status==='Cancelado'||!Number.isInteger(b.amount)||b.amount<=0||b.amount>o.total-o.paid||!b.operator?.trim())return fail('Confira o valor e o responsável pelo recebimento.');
    o.paid+=b.amount;o.payments.push({id:b.paymentId,amount:b.amount,method:b.method,operator:b.operator,date:new Date().toISOString()});
   }else return fail('Ação inválida.');
  }
  localStorage.setItem(key,JSON.stringify(state));return Response.json({ok:true,id:b.id});
 }catch{return Response.json({error:'Não foi possível salvar o teste neste navegador. Confira se o armazenamento está permitido.'},{status:500});}
}
