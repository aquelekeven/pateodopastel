export const categories=["Todos","Pastéis","Tapiocas","Café da manhã","Almoço","Lanches da tarde","Bebidas"];
export const menu=[
{id:"carne",name:"Pastel de carne da casa",description:"Massa sequinha, carne bem temperada e azeitonas. O clássico que nunca falha.",price:1400,category:"Pastéis",image:"pastel",tag:"Queridinho da casa"},
{id:"queijo",name:"Pastel de queijo",description:"Crocante por fora, muito queijo derretido por dentro.",price:1300,category:"Pastéis",image:"pastel",tag:"Vegetariano"},
{id:"frango",name:"Pastel de frango cremoso",description:"Frango desfiado com requeijão e tempero de casa.",price:1600,category:"Pastéis",image:"pastel",tag:""},
{id:"banana",name:"Pastel de banana e canela",description:"Banana quentinha, açúcar e canela na massa crocante.",price:1200,category:"Pastéis",image:"pastel",tag:"Doce na medida"},
{id:"tapioca",name:"Tapioca de frango",description:"Tapioca feita na hora com frango desfiado, tomate e requeijão.",price:1800,category:"Tapiocas",image:"tapioca",tag:""},
{id:"minas",name:"Tapioca de queijo minas",description:"Queijo minas, tomate e orégano. Leve e cheia de sabor.",price:1600,category:"Tapiocas",image:"tapioca",tag:"Vegetariano"},
{id:"cafecombo",name:"Bom dia, Pateo!",description:"Pão na chapa e café com leite para começar bem o dia.",price:1400,category:"Café da manhã",image:"breakfast",tag:"Combo"},
{id:"pao",name:"Pão na chapa",description:"Pão francês douradinho na manteiga, simples e gostoso.",price:650,category:"Café da manhã",image:"breakfast",tag:""},
{id:"executivo",name:"Executivo de frango",description:"Filé grelhado, arroz, feijão, batata frita e salada fresquinha.",price:2900,category:"Almoço",image:"lunch",tag:"Almoço de verdade"},
{id:"bife",name:"Bife acebolado",description:"Bife na chapa, arroz, feijão, fritas e cebola dourada.",price:3400,category:"Almoço",image:"lunch",tag:""},
{id:"vegetariano",name:"Prato da horta",description:"Arroz, feijão, legumes salteados, ovo e salada da estação.",price:2600,category:"Almoço",image:"lunch",tag:"Vegetariano"},
{id:"burger",name:"X-salada do Pateo",description:"Hambúrguer, queijo, alface, tomate e maionese no pão macio.",price:2400,category:"Lanches da tarde",image:"burger",tag:""},
{id:"misto",name:"Misto quente",description:"Presunto e queijo derretido no pão tostado.",price:1200,category:"Lanches da tarde",image:"breakfast",tag:""},
{id:"suco",name:"Suco de laranja • 300 ml",description:"Laranja espremida na hora. Sem adição de açúcar.",price:900,category:"Bebidas",image:"juice",tag:"Natural"},
{id:"cafe",name:"Café coado • 150 ml",description:"Café fresquinho, passado com carinho.",price:500,category:"Bebidas",image:"coffee",tag:""},
{id:"agua",name:"Água mineral • 500 ml",description:"Água mineral sem gás, bem gelada.",price:500,category:"Bebidas",image:"water",tag:""}
];
export type Product=typeof menu[number]&{available?:boolean};
export const money=(v:number)=>new Intl.NumberFormat("pt-BR",{style:"currency",currency:"BRL"}).format(v/100);
export const stages=["Recebido","Em preparo","Pronto","Entregue"];
