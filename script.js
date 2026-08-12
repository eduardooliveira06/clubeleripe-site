/* =========================================================================
   LERIPE SAÚDE — clubeleripe.com.br
   ---------------------------------------------------------------------
   CONFIG: só mexa aqui pra trocar links, telefone ou reativar a Lista de
   Espera. O resto do arquivo lê estes valores, não precisa tocar embaixo.
   ========================================================================= */
const CONFIG = {
  // Lista de Espera: back-end e modal ficam intactos no HTML/CSS/JS,
  // só ADORMECIDOS. Troque para true e o botão volta a aparecer no menu.
  WAITLIST_ENABLED: false,

  // Checkout ASAAS — assinatura semestral B2C
  CHECKOUT_INDIVIDUAL: "https://www.asaas.com/c/5rgo7al2kd83bb7d",
  CHECKOUT_FAMILIAR: "https://www.asaas.com/c/nedf3acno5suojqv",

  WHATSAPP_NUMBER: "5522998887074",

  // Prazo da oferta de lançamento exibida no contador da seção de planos.
  // Formato ISO 8601. Ajuste esta data quando renovar a promoção.
  PROMO_DEADLINE: "2026-09-15T23:59:00-03:00",
};

document.addEventListener("DOMContentLoaded", () => {
  wireCheckoutLinks();
  wireWaitlist();
  startCountdown();
  wireModalForms();
  wireStarPicker();
  wireChatWidget();
});

/* ---------- 1. Links de checkout ASAAS ---------- */
function wireCheckoutLinks() {
  document.querySelectorAll("[data-checkout]").forEach((el) => {
    const plan = el.getAttribute("data-checkout");
    if (plan === "individual") el.href = CONFIG.CHECKOUT_INDIVIDUAL;
    if (plan === "familiar") el.href = CONFIG.CHECKOUT_FAMILIAR;
    el.target = "_blank";
    el.rel = "noopener";
  });
}

/* ---------- 2. Lista de Espera (dormente por padrão) ---------- */
function wireWaitlist() {
  const modal = document.getElementById("waitlist-modal");
  const nav = document.querySelector(".header-actions");

  if (CONFIG.WAITLIST_ENABLED) {
    // Reinsere o botão original no menu, na frente do "Assinar agora".
    const waitlistBtn = document.createElement("a");
    waitlistBtn.href = "#waitlist";
    waitlistBtn.id = "waitlist-btn";
    waitlistBtn.className = "btn btn-gold";
    waitlistBtn.textContent = "📝 Lista de Espera";
    nav.insertBefore(waitlistBtn, document.getElementById("assinar-agora-nav"));

    waitlistBtn.addEventListener("click", (e) => {
      e.preventDefault();
      modal.hidden = false;
    });
    document.getElementById("waitlist-close").addEventListener("click", () => {
      modal.hidden = true;
    });
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.hidden = true;
    });
  }
  // Se WAITLIST_ENABLED for false: nenhum elemento chama o modal,
  // ele permanece no DOM com hidden, totalmente inerte.
}

/* ---------- 3. Contador da oferta de lançamento ---------- */
function startCountdown() {
  const els = {
    days: document.getElementById("cd-days"),
    hours: document.getElementById("cd-hours"),
    min: document.getElementById("cd-min"),
    sec: document.getElementById("cd-sec"),
  };
  const deadline = new Date(CONFIG.PROMO_DEADLINE).getTime();
  if (Number.isNaN(deadline)) return;

  function tick() {
    const diff = deadline - Date.now();
    if (diff <= 0) {
      els.days.textContent = "00";
      els.hours.textContent = "00";
      els.min.textContent = "00";
      els.sec.textContent = "00";
      clearInterval(timer);
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    els.days.textContent = String(d).padStart(2, "0");
    els.hours.textContent = String(h).padStart(2, "0");
    els.min.textContent = String(m).padStart(2, "0");
    els.sec.textContent = String(s).padStart(2, "0");
  }
  tick();
  const timer = setInterval(tick, 1000);
}

/* ---------- 4. Formulário de depoimento ---------- */
function wireModalForms() {
  const depoForm = document.getElementById("depoimento-form");
  const depoSuccess = document.getElementById("depoimento-success");
  if (depoForm) {
    depoForm.addEventListener("submit", (e) => {
      e.preventDefault();
      // Front-end only por enquanto: sem endpoint de back-end conectado.
      // Ligar aqui a um endpoint (ex.: Supabase/Resend) quando disponível.
      depoForm.hidden = true;
      depoSuccess.hidden = false;
    });
  }

  const waitForm = document.getElementById("waitlist-form");
  const waitSuccess = document.getElementById("waitlist-success");
  if (waitForm) {
    waitForm.addEventListener("submit", (e) => {
      e.preventDefault();
      waitForm.hidden = true;
      waitSuccess.hidden = false;
    });
  }
}

/* ---------- 5. Seletor de estrelas do depoimento ---------- */
function wireStarPicker() {
  const picker = document.getElementById("star-picker");
  if (!picker) return;
  const stars = picker.querySelectorAll("span");
  stars.forEach((star) => {
    star.addEventListener("click", () => {
      const value = Number(star.dataset.star);
      picker.dataset.value = value;
      stars.forEach((s) => s.classList.toggle("active", Number(s.dataset.star) <= value));
    });
  });
}

/* ---------- 6. Widget do chat "Leripe Assist" ---------- */
function wireChatWidget() {
  const fab = document.getElementById("chat-fab");
  const panel = document.getElementById("chat-panel");
  const closeBtn = document.getElementById("chat-close");
  const duvidasBtn = document.getElementById("chat-duvidas");
  const form = document.getElementById("chat-form");
  const input = document.getElementById("chat-input");
  const body = document.getElementById("chat-body");

  fab.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
  });
  closeBtn.addEventListener("click", () => (panel.hidden = true));

  duvidasBtn.addEventListener("click", () => input.focus());

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;

    appendChatBubble(body, text, "user");
    input.value = "";

    // Resposta padrão sem back-end de IA conectado neste site institucional.
    // O assistente com IA completo vive no app (Anthropic API já integrada
    // no PWA principal) — aqui é só triagem para os planos ou contato direto.
    setTimeout(() => {
      appendChatBubble(
        body,
        `Nossa equipe pode te ajudar melhor por aqui: ` +
          `<a href="tel:+${CONFIG.WHATSAPP_NUMBER}">(22) 99888-7074</a> ou ` +
          `<a href="mailto:contato@leripesaude.com.br">contato@leripesaude.com.br</a>. ` +
          `Ou já garanta sua vaga: <a href="${CONFIG.CHECKOUT_INDIVIDUAL}" target="_blank" rel="noopener">Individual</a> · ` +
          `<a href="${CONFIG.CHECKOUT_FAMILIAR}" target="_blank" rel="noopener">Familiar</a>.`,
        "assistant"
      );
      body.scrollTop = body.scrollHeight;
    }, 400);
  });
}

function appendChatBubble(container, html, role) {
  const bubble = document.createElement("div");
  bubble.className = "chat-msg" + (role === "user" ? " chat-msg-user" : "");
  bubble.innerHTML = role === "user" ? escapeHtml(html) : html;
  container.appendChild(bubble);
  container.scrollTop = container.scrollHeight;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
