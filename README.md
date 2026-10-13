# 🏠 СберДом — Видеонаблюдение

Мобильное PWA-приложение для системы видеонаблюдения в стиле СберБанка.

![Version](https://img.shields.io/badge/version-1.0.0-green)
![PWA](https://img.shields.io/badge/PWA-ready-brightgreen)
![Mobile](https://img.shields.io/badge/mobile-optimized-blue)

## ✨ Возможности

- 📹 **Просмотр камер** — сетка или список, реальные кадры с сервера
- 🔔 **События** — детекция людей, машин, животных с видео
- 📁 **Архив** — просмотр записей по дате и камере
- 👥 **Пользователи** — управление доступом
- ⚙️ **Настройки** — Telegram, VK, Алиса уведомления
- 📱 **PWA** — установка на главный экран телефона
- 🎨 **Стиль СберБанка** — зелёная тема, мобильная навигация

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
npm install
```

### 2. Запуск в режиме разработки

```bash
npm run dev
```

Откройте http://localhost:5173

### 3. Сборка для продакшена

```bash
npm run build
```

Готовые файлы в папке `dist/`

## 📱 Установка как приложение

### На iPhone/iPad (Safari)

1. Откройте сайт в Safari
2. Нажмите кнопку "Поделиться" (квадрат со стрелкой)
3. Прокрутите вниз и выберите "На экран Домашний"
4. Нажмите "Добавить"

### На Android (Chrome)

1. Откройте сайт в Chrome
2. Нажмите меню (три точки)
3. Выберите "Добавить на главный экран"
4. Нажмите "Добавить"

### На компьютере (Chrome/Edge)

1. Откройте сайт
2. Нажмите иконку установки в адресной строке
3. Или: Меню → "Установить приложение"

## 🔌 Подключение к серверу

Приложение подключается к вашему `cctv_server.py` на порту **8080**.

### Настройка CORS

Добавьте в `cctv_server.py`:

```python
@app.after_request
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Credentials'] = 'true'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS'
    return response
```

### Изменение адреса сервера

Отредактируйте `src/api.ts`:

```typescript
export const API_BASE = 'http://ваш-сервер:8080';
```

## 🎨 Дизайн

Приложение выполнено в стиле СберБанка:

- **Цветовая схема**: Зелёный (#21A038) + тёмная тема
- **Навигация**: Нижняя панель как в мобильных приложениях
- **Иконки**: Крупные, touch-friendly
- **Анимации**: Плавные переходы, active states
- **Safe area**: Поддержка iPhone с чёлкой

## 📂 Структура проекта

```
├── public/
│   ├── manifest.json      # PWA манифест
│   ├── sw.js              # Service Worker
│   └── icons/             # Иконки приложения
├── src/
│   ├── App.tsx            # Главный компонент с навигацией
│   ├── api.ts             # API сервис для сервера
│   ├── pages/
│   │   ├── CamerasPage.tsx    # Камеры
│   │   ├── EventsPage.tsx     # События
│   │   ├── ArchivePage.tsx    # Архив
│   │   ├── UsersPage.tsx      # Пользователи
│   │   └── SettingsPage.tsx   # Настройки
│   └── index.css          # Стили
└── index.html             # Точка входа с PWA мета-тегами
```

## 🔧 Технологии

- **React 18** — UI библиотека
- **TypeScript** — типизация
- **Vite** — сборщик
- **Tailwind CSS** — стили
- **React Router** — навигация
- **Lucide React** — иконки
- **PWA** — Progressive Web App

## 📱 Мобильная оптимизация

✅ Touch-friendly элементы (мин. 44px)
✅ Safe area для iPhone
✅ Отключение zoom на input
✅ Плавная прокрутка
✅ Offline режим (Service Worker)
✅ Быстрая загрузка (code splitting)
✅ Оптимизация изображений (lazy loading)

## 🔒 Безопасность

✅ Нет хардкод-токенов
✅ Все секреты вводятся через интерфейс
✅ .gitignore настроен
✅ CORS заголовки

## 📄 Лицензия

MIT

## 👨‍💻 Автор

Создано для системы видеонаблюдения cctv_server.py

---

**СберДом** — умный дом под контролем 🏠📹
