import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.static('public'));
app.use(express.json());

const visitorsFile = path.join(__dirname, 'visitors.json');
let visitors = fs.existsSync(visitorsFile) ? JSON.parse(fs.readFileSync(visitorsFile)) : [];

// Временное хранилище кодов (для демо)
const tempCodes = new Map();

// === ВХОД ПО КОДУ ===
app.post('/api/send-code', (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ error: 'Введите телефон' });

  const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6 цифр
  tempCodes.set(phone, { code, expires: Date.now() + 300000 }); // 5 минут

  console.log(`📲 Код для ${phone}: ${code}`); // видно только в консоли сервера
  res.json({ success: true, message: 'Код отправлен в Telegram (симуляция)' });
});

app.post('/api/verify-code', (req, res) => {
  const { phone, code, name } = req.body;
  const data = tempCodes.get(phone);

  if (!data || data.code !== code || Date.now() > data.expires) {
    return res.status(400).json({ error: 'Неверный или просроченный код' });
  }

  const user = {
    id: Date.now(),
    name: name || phone,
    username: `@${phone.replace(/[^a-zA-Z0-9]/g, '')}`,
    time: new Date().toLocaleString('ru-RU'),
    action: 'Вход по коду'
  };

  visitors.unshift(user);
  fs.writeFileSync(visitorsFile, JSON.stringify(visitors));
  tempCodes.delete(phone);

  res.json({ success: true, user });
});

// API для VIP-админки
app.get('/api/visitors', (req, res) => res.json(visitors));

app.listen(PORT, () => {
  console.log(`🚀 JoinGold.Football запущен → http://localhost:${PORT}`);
  console.log(`🔑 Вход по коду (без бота) активен`);
});
