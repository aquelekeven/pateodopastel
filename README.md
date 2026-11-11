## Atualização da demo Pages

Minha conta oferece perfil fictício, endereços locais, pedidos e extrato mensal.
No checkout, Conta mensal exige entrar no perfil fictício. Os pedidos são vinculados
à identidade de teste (telefone 11999990000); o admin agrupa por cliente e mês.
Recebimentos continuam registrados por pedido, inclusive parciais; cancelados não
compõem o saldo. Este fluxo não implementa crédito real, autorização de clientes,
fechamento contábil, autenticação real ou sincronização entre dispositivos.
A API D1 da versão privada ainda não foi migrada para contas mensais.
Banners de energético e pudim usam imagem gerada, ilustrativa. Carrossel de 15 segundos.

## GitHub Pages: teste no celular

A pasta `docs/` contém uma demonstração estática das duas interfaces. Todos os pedidos,
pagamentos e alterações de cardápio ficam **somente no localStorage do navegador atual**.
Não existe login de administrador nesta versão pública de demonstração. Use dados fictícios.
Ela não chama o servidor privado, não cobra e não envia pedidos ao restaurante.

Para testar: escolha um produto, envie um pedido fictício e abra Administração no mesmo
navegador. Avance o preparo e registre um recebimento. Em outro aparelho, os dados serão
independentes. Limpar os dados do site remove os testes.

Para regenerar a demo depois de alterar a interface: `npm ci` e `npm run build:pages`.
Commitar `docs/` publica a atualização pelo workflow `.github/workflows/pages.yml`.
Se o GitHub solicitar habilitação inicial, em Settings → Pages selecione GitHub Actions.
O código completo abaixo continua usando servidor e D1; a demo usa `pages/demo-api.ts`.

---

# Pateo do Pastel

Primeira versão funcional e privada de demonstração. Identidade própria inspirada na navegação de apps de delivery. Não é um produto afiliado ao iFood, Eye ou Stone.

## Interfaces
- `/`: cardápio com 16 produtos fictícios, categorias, busca, sacola, quantidades, observações, retirada/recepção FB/mesa e acompanhamento.
- `/admin`: fila por etapa, registro manual de pagamentos parciais, histórico com responsável e edição de preços/disponibilidade.
- `/api/pateo`: persistência no Cloudflare D1, validação de valores no servidor, controle de concorrência e identificadores de operação.

## Limites desta versão
Este ambiente é **privado para o proprietário**, protegido pelo acesso do Sites. O proprietário alterna entre as duas interfaces para testar; isso NÃO implementa contas independentes de consumidores e funcionários. Não tornar público nem usar com dados reais antes de implementar autenticação e autorização por função no servidor, isolamento dos pedidos dos clientes e políticas de privacidade.

Sem Stone, Eye, WhatsApp API, cobrança online, impressão ou documento fiscal. Registrar pagamento é uma confirmação humana de um recebimento externo. Horários são preferências de demonstração; ainda não há capacidade por faixa. O controle mensal de clientes, saldo pré-pago, ajustes/estornos e caixa diário não fazem parte desta primeira versão. Não há envio ao restaurante real. A lista "Meus pedidos" usa identificadores no navegador e não substitui login.

Pedidos, pagamentos e catálogo são persistidos no D1. Sacola e lista local de pedidos usam localStorage. O painel atualiza a cada 15 segundos. Entrega e pagamento são independentes; cancelar pedido com valor já recebido é bloqueado para evitar perda de histórico.

## Desenvolvimento
Node >=22.13.0. `npm ci`, `npm run dev`, `npm run build`, `npx tsc --noEmit`.

O starter Vinext inclui integração com Cloudflare Workers e Sites. `.openai/hosting.json` identifica o ambiente privado e o binding D1 `DB`. Ao criar outro ambiente, registre uma identidade nova em vez de reaproveitar esta.

### Banco local
Depois do build, execute uma única vez para um banco local novo:
```
node --import ./scripts/sites-env.mjs ./node_modules/wrangler/bin/wrangler.js d1 execute DB --local --config dist/server/wrangler.json --persist-to .wrangler/state --file drizzle/0000_acoustic_red_hulk.sql
```
Migrations aplicadas são imutáveis. Gere novas com `npm run db:generate`. A publicação via Sites aplica as migrations ao banco hospedado. Dados de testes locais não são enviados.

## Fotos e design
Fotos são ilustrativas para a prévia privada, não representam produtos reais do restaurante. Substituir por fotos próprias/autorizadas antes do lançamento comercial.
- Pastel: https://pastel-garapa.ola.click/products (imagem pública de referência, hospedada em assets.olaclick.app).
- Tapioca: https://www.daterrinhaalimentos.com/receitas/frango-com--requeij%C3%A3o-cremoso
- Demais imagens: Unsplash (IDs nos nomes de referência abaixo): 1568901346375-23c9450c58cd, 1509042239860-f550ce710b93, 1525351484163-7529414344d8, 1547592180-85f173990554, 1613478223719-2ab802602423, 1548839140-29a749e1cf4d.
- Ícones: Lucide. Fontes: DM Sans e Manrope via Google Fonts. Logo: SVG original desta demonstração.
