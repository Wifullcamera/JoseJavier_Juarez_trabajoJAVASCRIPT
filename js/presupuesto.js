// presupuesto.js — validación de contacto y cálculo de presupuesto en vivo
// Ubicación: /js/presupuesto.js

document.addEventListener('DOMContentLoaded', () => {
  // ============================
  // 1. Elementos del formulario
  // ============================
  const nameEl = document.getElementById('name');
  const surnameEl = document.getElementById('surname');
  const phoneEl = document.getElementById('phone');
  const emailEl = document.getElementById('email');

  const errName = document.getElementById('err-name');
  const errSurname = document.getElementById('err-surname');
  const errPhone = document.getElementById('err-phone');
  const errEmail = document.getElementById('err-email');

  const productSel = document.getElementById('product');
  const termEl = document.getElementById('term');
  const extrasEls = Array.from(document.querySelectorAll('.extra'));
  const shippingEls = Array.from(document.querySelectorAll('input[name="shipping"]'));

  const baseEl = document.getElementById('budget-base');
  const extrasEl = document.getElementById('budget-extras');
  const shippingEl = document.getElementById('budget-shipping');
  const discountEl = document.getElementById('budget-discount');
  const totalEl = document.getElementById('budget-total');

  const acceptEl = document.getElementById('accept');
  const form = document.getElementById('budget-form');
  const result = document.getElementById('form-result');
  const resetBtn = document.getElementById('reset-btn');

  // ============================
  // 2. Expresiones regulares para validación
  // ============================
  const reLetters = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
  const rePhone = /^\d{1,9}$/;
  const reEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // ============================
  // 3. Validaciones por campo
  // ============================
  function validateName() {
    const v = nameEl.value.trim();
    if (!v) { errName.textContent = 'El nombre es obligatorio.'; return false; }
    if (!reLetters.test(v)) { errName.textContent = 'Sólo letras y espacios permitidos.'; return false; }
    if (v.length > 15) { errName.textContent = 'Máximo 15 caracteres.'; return false; }
    errName.textContent = '';
    return true;
  }

  function validateSurname() {
    const v = surnameEl.value.trim();
    if (!v) { errSurname.textContent = 'Los apellidos son obligatorios.'; return false; }
    if (!reLetters.test(v)) { errSurname.textContent = 'Sólo letras y espacios permitidos.'; return false; }
    if (v.length > 40) { errSurname.textContent = 'Máximo 40 caracteres.'; return false; }
    errSurname.textContent = '';
    return true;
  }

  function validatePhone() {
    const v = phoneEl.value.trim();
    if (!v) { errPhone.textContent = 'El teléfono es obligatorio.'; return false; }
    if (!/^\d+$/.test(v)) { errPhone.textContent = 'Sólo dígitos permitidos.'; return false; }
    if (!rePhone.test(v)) { errPhone.textContent = 'Máximo 9 dígitos.'; return false; }
    errPhone.textContent = '';
    return true;
  }

  function validateEmail() {
    const v = emailEl.value.trim();
    if (!v) { errEmail.textContent = 'El correo es obligatorio.'; return false; }
    if (!reEmail.test(v)) { errEmail.textContent = 'Formato de correo no válido.'; return false; }
    errEmail.textContent = '';
    return true;
  }

  // ============================
  // 4. Conectar validaciones a eventos
  // ============================
  if (nameEl) nameEl.addEventListener('input', validateName);
  if (surnameEl) surnameEl.addEventListener('input', validateSurname);
  if (phoneEl) {
    phoneEl.addEventListener('input', () => {
      phoneEl.value = phoneEl.value.replace(/[^\d]/g, '').slice(0, 9);
      validatePhone();
    });
  }
  if (emailEl) emailEl.addEventListener('input', validateEmail);

  // ============================
  // 5. Cálculo del presupuesto
  // ============================
  function getSelectedProductPrice() {
    const opt = productSel && productSel.selectedOptions ? productSel.selectedOptions[0] : null;
    return opt ? Number(opt.dataset.price || 0) : 0;
  }

  function getExtrasTotal() {
    return extrasEls.reduce((sum, ch) => ch.checked ? sum + Number(ch.dataset.price || 0) : sum, 0);
  }

  function getShippingPrice() {
    const sel = shippingEls.find(r => r.checked);
    return sel ? Number(sel.dataset.price || 0) : 0;
  }

  function calculateDiscountFactor(months, subtotal) {
    const m = Number(months) || 0;
    let pct = 0;
    if (m >= 1 && m <= 2) pct = 0.02;
    else if (m >= 3 && m <= 5) pct = 0.05;
    else if (m > 5) pct = 0.08;
    return Math.round(subtotal * pct * 100) / 100;
  }

  function formatCurrency(v) {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 2
    }).format(v);
  }

  function updateBudgetDisplay() {
    const base = getSelectedProductPrice();
    const extras = getExtrasTotal();
    const shipping = getShippingPrice();
    const subtotal = base + extras + shipping;
    const discount = calculateDiscountFactor(Number(termEl.value || 0), subtotal);
    const total = Math.max(0, subtotal - discount);

    baseEl.textContent = formatCurrency(base);
    extrasEl.textContent = formatCurrency(extras);
    shippingEl.textContent = formatCurrency(shipping);
    discountEl.textContent = '-' + formatCurrency(discount);
    totalEl.textContent = formatCurrency(total);
  }

  // ============================
  // 6. Eventos para actualizar presupuesto
  // ============================
  if (productSel) productSel.addEventListener('change', updateBudgetDisplay);
  if (termEl) {
    termEl.addEventListener('input', () => {
      if (termEl.value === '') termEl.value = 0;
      termEl.value = Math.max(0, Math.floor(Number(termEl.value)));
      updateBudgetDisplay();
    });
  }
  extrasEls.forEach(ch => ch.addEventListener('change', updateBudgetDisplay));
  shippingEls.forEach(r => r.addEventListener('change', updateBudgetDisplay));

  // ============================
  // 7. Botón de reset
  // ============================
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (form) form.reset();
      errName.textContent = errSurname.textContent = errPhone.textContent = errEmail.textContent = '';
      updateBudgetDisplay();
      if (result) result.textContent = '';
    });
  }

  // ============================
  // 8. Envío del formulario (simulado)
  // ============================
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (result) result.textContent = '';

      const vName = validateName();
      const vSurname = validateSurname();
      const vPhone = validatePhone();
      const vEmail = validateEmail();
      const vAccept = acceptEl && acceptEl.checked;

      if (!vAccept) {
        result.textContent = 'Debes aceptar las condiciones para enviar el formulario.';
        result.style.color = 'crimson';
        return;
      }

      if (!(vName && vSurname && vPhone && vEmail)) {
        result.textContent = 'Corrige los errores en los datos de contacto antes de enviar.';
        result.style.color = 'crimson';
        return;
      }

      // Componer resumen simulado
      const summary = {
        name: nameEl.value.trim(),
        surname: surnameEl.value.trim(),
        phone: phoneEl.value.trim(),
        email: emailEl.value.trim(),
        product: productSel.value,
        term: termEl.value,
        extras: extrasEls.filter(x => x.checked).map(x => x.value),
        shipping: (shippingEls.find(r => r.checked) || {}).value || 'standard',
        total: totalEl.textContent
      };

      result.style.color = 'green';
      result.textContent = 'Presupuesto enviado correctamente. A continuación se muestra un resumen: ' + JSON.stringify(summary);
    });
  }
});