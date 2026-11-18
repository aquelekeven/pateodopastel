export type HistoryEntry={key:string;date:string;summary:string;amount:number;method:string;kind:'order'|'monthly-payment';order:any};
export function customerHistoryEntries(orders:any[]):HistoryEntry[]{
 const entries:HistoryEntry[]=[];
 for(const o of orders){
  const methods=Array.from(new Set((o.payments||[]).map((p:any)=>p.method))).join(' + ');
  entries.push({key:'order-'+o.id,date:o.createdAt,summary:o.items.map((i:any)=>`${i.qty}× ${i.name}`).join(' · '),amount:o.total,method:o.status==='Cancelado'?'Pedido cancelado':o.paymentIntent==='Conta mensal'?'Anotado na conta mensal':methods?(methods+(o.paid<o.total?' · pagamento parcial':'')):'Pagamento pendente',kind:'order',order:o});
  if(o.paymentIntent==='Conta mensal')for(const p of o.payments||[]){
   entries.push({key:'receipt-'+o.id+'-'+p.id,date:p.date,summary:'Conta mensal - '+new Date(o.createdAt).toLocaleDateString('pt-BR',{month:'long'}),amount:p.amount,method:p.method||'Forma não informada',kind:'monthly-payment',order:o});
  }
 }
 return entries.sort((a,b)=>new Date(b.date).getTime()-new Date(a.date).getTime()||a.key.localeCompare(b.key));
}
export function historyDate(value:string){const date=new Date(value);const weekday=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'][date.getDay()];return `${weekday}, ${date.toLocaleDateString('pt-BR')}`}
