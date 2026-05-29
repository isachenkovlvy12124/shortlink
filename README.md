# SNIP — Сервис коротких ссылок

Полноценный сервис коротких ссылок на Next.js 14 с аналитикой, QR-кодами и авторизацией.

## Функции

- **Короткие ссылки** — автогенерация или кастомный алиас
- **Аналитика** — клики, страны, устройства, браузеры, график за 14 дней
- **QR-коды** — генерация и скачивание для любой ссылки
- **Авторизация** — регистрация/вход через JWT
- **Срок действия** — ссылки с датой истечения
- **Личный кабинет** — управление всеми ссылками

## Стек

- **Next.js 14** (App Router) + TypeScript
- **Prisma** + SQLite (zero-config)
- **NextAuth.js** для авторизации
- **Recharts** для графиков
- **Tailwind CSS** с кастомным дизайном

## Запуск

### 1. Установить зависимости

```bash
npm install
```

### 2. Настроить переменные окружения

```bash
cp .env.example .env
```

Отредактируйте `.env`:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="замените-на-случайную-строку"
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Инициализировать базу данных

```bash
npx prisma db push
```

### 4. Запустить

```bash
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

## Деплой на Vercel

1. Push в GitHub
2. Импортировать в Vercel
3. Добавить переменные окружения
4. Заменить SQLite на PostgreSQL (Vercel Postgres или Supabase):
   - Изменить `provider = "postgresql"` в `prisma/schema.prisma`
   - Обновить `DATABASE_URL`

## Структура

```
src/
  app/
    [slug]/route.ts       # Редирект по короткой ссылке
    api/
      auth/               # NextAuth + регистрация
      links/              # CRUD ссылок + QR
    dashboard/            # Личный кабинет
    login/ register/      # Авторизация
  components/             # UI компоненты
  lib/
    auth.ts               # NextAuth конфиг
    prisma.ts             # Prisma клиент
    utils.ts              # Утилиты
```
