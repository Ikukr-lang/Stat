// ... весь старый дизайн + VIP (ша-256 пароль 222) ...

let currentPhone = '';

function showCodeLoginModal() {
  document.getElementById('code-modal').classList.remove('hidden');
  document.getElementById('step-phone').classList.remove('hidden');
  document.getElementById('step-code').classList.add('hidden');
}

async function sendCode() {
  const phone = document.getElementById('phone-input').value.trim();
  if (!phone) return alert('Введите телефон или @username');
  
  currentPhone = phone;
  const res = await fetch('/api/send-code', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ phone })
  });
  
  if (res.ok) {
    document.getElementById('step-phone').classList.add('hidden');
    document.getElementById('step-code').classList.remove('hidden');
    document.getElementById('code-input').focus();
  }
}

async function verifyCode() {
  const code = document.getElementById('code-input').value.trim();
  const name = prompt('Как вас зовут? (для отображения в таблице)', 'Игрок');
  
  const res = await fetch('/api/verify-code', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ phone: currentPhone, code, name })
  });
  
  const data = await res.json();
  if (data.success) {
    alert(`✅ Добро пожаловать, ${data.user.name}!`);
    document.getElementById('code-modal').classList.add('hidden');
    // обновить VIP если открыт
  } else {
    alert('❌ Неверный код');
  }
}

// VIP-админка осталась точно такой же (пароль 222 зашифрован)
