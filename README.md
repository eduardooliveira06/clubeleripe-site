# clubeleripe-site

Site institucional da Leripe Saúde (clubeleripe.com.br). Migrado do editor visual do
Netlify para código estático puro (HTML/CSS/JS), sem dependência de créditos/tokens
de nenhuma plataforma. Deploy pensado para Vercel (free tier).

## Estrutura

```
index.html   → toda a estrutura e conteúdo do site
style.css    → identidade visual (verde esmeralda profundo + dourado champagne)
script.js    → CONFIG central (links, telefone, prazo da promoção) + toda a lógica
assets/      → logos, vídeo e imagens (PENDENTE — ver abaixo)
```

## Config rápida (`script.js`, bloco `CONFIG` no topo do arquivo)

| Chave | O que faz |
|---|---|
| `WAITLIST_ENABLED` | `false` hoje. Lista de Espera está **adormecida**: modal e formulário continuam no HTML, só não há botão que os acione. Trocar para `true` reativa o botão no menu e o modal, sem precisar reescrever nada. |
| `CHECKOUT_INDIVIDUAL` / `CHECKOUT_FAMILIAR` | Links de pagamento ASAAS. Todo botão com `data-checkout="individual"` ou `data-checkout="familiar"` no HTML puxa daqui. |
| `WHATSAPP_NUMBER` | Usado no rodapé e nas respostas do chat. |
| `PROMO_DEADLINE` | Data/hora (ISO 8601) em que o contador da seção de planos chega a zero. Ajustar ao renovar a promoção. |

## Pendências antes do deploy final

1. **Assets visuais** — `logo-hero.png`, `logo.png`, `logo-acec.png`, `logo-amelia-gaspar.png`,
   `logo-casa-do-grao.png` e `video-leripe.mp4` do site original não foram migrados (não
   estavam acessíveis para download automático). Hoje a página usa texto/emoji como
   placeholder nesses pontos. Adicionar os arquivos reais em `/assets` e trocar as
   referências em `index.html`.
2. **Botão "Login"** (`#login-btn` em `index.html`) aponta para
   `https://app.leripesaude.com.br/login` como placeholder — confirmar a URL real do
   app/PWA.
3. **Depoimento de membro** — removido de propósito. Publicar avaliação deve exigir
   login de assinante (evita depoimento falso/anônimo), então fica como
   "Em breve" até existir esse login. Ver comentário `TODO` em `index.html`.
   **Lista de Espera** (quando reativada) ainda só mostra sucesso no front-end —
   conectar a um endpoint (Supabase, Resend, etc.) quando for reativar de verdade.
4. **Chat "Leripe Assist"** — a opção "Ativar pelo WhatsApp" foi removida conforme
   solicitado; os dois planos levam direto ao checkout ASAAS. A caixa de texto livre
   dá uma resposta padrão (sem IA conectada neste site institucional — o assistente
   com IA completo continua vivendo no PWA principal).

## Deploy

Importar este repositório diretamente no Vercel (New Project → Import Git Repository).
Não precisa de build step — é HTML/CSS/JS puro na raiz. Depois, apontar o DNS do
clubeleripe.com.br (hoje na Hostinger) para o Vercel.
