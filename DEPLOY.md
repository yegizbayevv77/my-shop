# 🚀 Деплой: Vercel + Supabase + Stripe

Это руководство описывает, как развернуть магазин в продакшене.

---

## 1. База данных (Supabase)

Можно использовать тот же проект Supabase, что и в разработке, или создать
отдельный для продакшена (рекомендуется).

Понадобятся две строки подключения (Supabase → **Connect** → **ORM / Prisma**):

- `DATABASE_URL` — Transaction pooler, порт **6543**, с `?pgbouncer=true` (для приложения)
- `DIRECT_URL` — Session pooler / Direct, порт **5432** (для миграций)

---

## 2. Stripe (продакшен-вебхук)

В деплое **не** используется Stripe CLI. Нужен постоянный webhook-endpoint:

1. Stripe Dashboard → **Developers → Webhooks → Add endpoint**
2. Endpoint URL: `https://ВАШ-ДОМЕН.vercel.app/api/webhooks/stripe`
3. События: выберите **`checkout.session.completed`**
4. После создания скопируйте **Signing secret** (`whsec_...`) — это значение
   `STRIPE_WEBHOOK_SECRET` для продакшена (оно отличается от секрета CLI).

Для реальных платежей переключитесь с тестовых ключей (`sk_test_…`) на
боевые (`sk_live_…`) — но для демо можно остаться в Test mode.

---

## 3. Деплой на Vercel

1. Запушьте проект в GitHub.
2. [vercel.com](https://vercel.com) → **Add New → Project** → импортируйте репозиторий.
3. Framework определится автоматически (**Next.js**). Build command и output —
   по умолчанию. `prisma generate` запускается автоматически через `postinstall`.
4. Добавьте переменные окружения (см. ниже) в **Settings → Environment Variables**.
5. **Deploy**.

### Переменные окружения (Vercel)

```env
DATABASE_URL=postgresql://...:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://...:5432/postgres

NEXTAUTH_SECRET=<openssl rand -base64 32>
NEXTAUTH_URL=https://ВАШ-ДОМЕН.vercel.app

# опционально (Google OAuth)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

STRIPE_SECRET_KEY=sk_test_... (или sk_live_...)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_... (или pk_live_...)
STRIPE_WEBHOOK_SECRET=whsec_... (из продакшен-вебхука, шаг 2)

NEXT_PUBLIC_APP_URL=https://ВАШ-ДОМЕН.vercel.app
```

> ⚠️ `NEXTAUTH_URL` и `NEXT_PUBLIC_APP_URL` должны указывать на реальный домен,
> иначе редиректы логина и Stripe сломаются.

---

## 4. Применить миграции и сиды к продакшен-базе

Локально, указав продакшен-строки в `.env` (или через переменные окружения):

```bash
npx prisma migrate deploy   # применяет существующие миграции (без создания новых)
npm run db:seed             # опционально — наполнить тестовыми товарами
```

`migrate deploy` использует `DIRECT_URL` из `prisma.config.ts`.

---

## 5. Google OAuth для продакшена (если используется)

Google Cloud Console → OAuth client → **Authorized redirect URIs**:

```
https://ВАШ-ДОМЕН.vercel.app/api/auth/callback/google
```

---

## 6. Заметка про SSL

В `src/lib/prisma.ts` и `prisma/seed.ts` драйвер `pg` настроен с
`ssl: { rejectUnauthorized: false }` — это стандартный и рабочий вариант для
подключения к Supabase (их пулеры используют SSL). Для максимальной строгости
можно передать корневой сертификат Supabase через `ssl: { ca: ... }`, но для
большинства проектов текущая настройка подходит.

---

## Готово ✅

После деплоя проверьте:

- главная и каталог открываются, картинки грузятся;
- регистрация / вход работают;
- оформление заказа уводит на Stripe Checkout;
- после оплаты приходит вебхук и заказ становится `PAID` (Stripe → Webhooks → логи).
```
