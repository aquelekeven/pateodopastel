import {getDb} from "../../../db";
import {orders,catalog} from "../../../db/schema";
import {eq,desc,and} from "drizzle-orm";
import {menu,stages} from "../../../lib/menu";
// Private owner-only pilot. Both interfaces are available to the owner for testing.
// Do not change hosting audience before implementing consumer/admin authorization.
export const dynamic="force-dynamic";
const out=(data:unknown,status=200)=>Response.json(data,{status,headers:{"Cache-Control":"no-store"}});
export async function GET(){try{const db=getDb();const overrides=await db.select().from(catalog);return out({products:menu.map(p=>{const o=overrides.find(x=>x.id===p.id);return {...p,price:o?.price??p.price,available:o?!!o.available:true}}),orders:(await db.select().from(orders).orderBy(desc(orders.createdAt))).map(o=>({...o,items:JSON.parse(o.items),payments:JSON.parse(o.payments)}))});}catch{return out({error:"Não foi possível carregar. Tente novamente."},500)}}
export async function POST(req:Request){try{
const origin=req.headers.get("origin");if(origin&&origin!==new URL(req.url).origin)return out({error:"Origem inválida"},403);
const b: any=await req.json();if(!b||typeof b!=="object")return out({error:"Dados inválidos"},400);const db=getDb();
if(b.action==="order"){
 if(typeof b.id!=="string"||!/^p-[a-f0-9-]{36}$/.test(b.id))return out({error:"Pedido inválido"},400);
 const previous=await db.select().from(orders).where(eq(orders.id,b.id));if(previous.length)return out({ok:true,id:b.id});
 if(typeof b.customer!=="string"||b.customer.trim().length<2||b.customer.length>80||typeof b.phone!=="string"||!/^\d{10,11}$/.test(b.phone.replace(/\D/g,"")))return out({error:"Preencha nome e telefone válido."},400);
 if(!["Retirada","Comer no local","Entrega"].includes(b.delivery)||typeof b.detail!=="string"||b.detail.length>120||typeof b.slot!=="string"||b.slot.length>30)return out({error:"Confira os dados de entrega."},400);
 if(b.delivery==="Entrega"&&!b.detail.trim())return out({error:"Informe o endereço ou local de entrega."},400);
 if(!Array.isArray(b.items)||!b.items.length||b.items.length>40)return out({error:"Sua sacola está vazia ou excede o limite."},400);
 const overrides=await db.select().from(catalog);const items=[];let total=0;
 for(const i of b.items){const p=menu.find(p=>p.id===i.id);const o=overrides.find(x=>x.id===i.id);if(!p||o?.available===0||!Number.isInteger(i.qty)||i.qty<1||i.qty>20||typeof i.note!=="string"||i.note.length>240)return out({error:"Confira os itens da sacola. Um produto pode estar indisponível."},400);const price=o?.price??p.price;total+=price*i.qty;items.push({id:p.id,name:p.name,qty:i.qty,note:i.note,price});}
 if(!["Na retirada","VR / VA","Pix no balcão","Dinheiro"].includes(b.paymentIntent))return out({error:"Forma inválida"},400);
 await db.insert(orders).values({id:b.id,createdAt:new Date().toISOString(),customer:b.customer.trim(),phone:b.phone,delivery:b.delivery,detail:b.detail,slot:b.slot,items:JSON.stringify(items),total,paymentIntent:b.paymentIntent});return out({ok:true,id:b.id});
}
if(b.action==="product") {if(!menu.some(p=>p.id===b.id)||!Number.isInteger(b.price)||b.price<100||b.price>100000||typeof b.available!=="boolean")return out({error:"Preço ou produto inválido"},400);await db.insert(catalog).values({id:b.id,price:b.price,available:b.available?1:0}).onConflictDoUpdate({target:catalog.id,set:{price:b.price,available:b.available?1:0}});return out({ok:true});}
const [o]=await db.select().from(orders).where(eq(orders.id,String(b.id)));if(!o)return out({error:"Pedido não encontrado"},404);
if(b.action==="status"){
 const current=stages.indexOf(o.status),next=stages.indexOf(b.status);
 if(!((next===current+1&&current>=0)||(b.status==="Cancelado"&&o.status!=="Entregue"&&o.paid===0)))return out({error:"Mudança de status não permitida. Pedidos pagos precisam de conferência antes do cancelamento."},400);
 const changed=await db.update(orders).set({status:b.status,version:o.version+1}).where(and(eq(orders.id,o.id),eq(orders.version,o.version))).returning();return changed.length?out({ok:true}):out({error:"Pedido atualizado em outra tela. Atualize e tente novamente."},409);
}
if(b.action==="payment"){
 if(o.status==="Cancelado"||!Number.isInteger(b.amount)||b.amount<=0||b.amount>o.total-o.paid||!["Pix","Dinheiro","Débito","Crédito","VR / VA"].includes(b.method)||typeof b.operator!=="string"||!b.operator.trim()||b.operator.length>60||typeof b.paymentId!=="string")return out({error:"Confira o valor, a forma e o responsável pelo recebimento."},400);
 const payments=JSON.parse(o.payments);if(payments.some((x:any)=>x.id===b.paymentId))return out({ok:true});
 payments.push({id:b.paymentId,amount:b.amount,method:b.method,operator:b.operator,date:new Date().toISOString()});
 const changed=await db.update(orders).set({paid:o.paid+b.amount,payments:JSON.stringify(payments),version:o.version+1}).where(and(eq(orders.id,o.id),eq(orders.version,o.version))).returning();return changed.length?out({ok:true}):out({error:"Pagamento alterado em outra tela. Confira o saldo novamente."},409);
}
return out({error:"Ação inválida"},400);
}catch{return out({error:"Não foi possível salvar. Confira a conexão e tente novamente."},500)}}
