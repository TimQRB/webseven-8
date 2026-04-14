# Lakes Admin

Готовая административная панель для `lakes-backend` на Next.js App Router.

## Что делает админка

Панель позволяет:

- входить через `/auth/login`
- просматривать, создавать, редактировать и удалять пользователей
- просматривать, создавать, редактировать и удалять водоёмы
- для каждого водоёма редактировать паспорт
- добавлять и удалять измерения
- смотреть простую визуализацию по воде через график

## Что должно быть на backend

Эта админка ориентирована на такие маршруты:

- `POST /auth/login`
- `GET /users`
- `POST /users`
- `PATCH /users/:id`
- `DELETE /users/:id`
- `GET /water-bodies`
- `GET /water-bodies/:id`
- `POST /water-bodies`
- `PATCH /water-bodies/:id`
- `DELETE /water-bodies/:id`
- `PUT /water-bodies/:id/passport`
- `POST /water-bodies/:id/measurements`
- `PATCH /measurements/:id`
- `DELETE /measurements/:id`

Если в вашем `lakes-backend` пока есть только `findAll` и `findOne`, нужно добавить write-endpoints.

## Запуск

1. Создайте `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

2. Установите зависимости:

```bash
npm install
```

3. Запустите проект:

```bash
npm run dev
```

## Почему именно это нужно в админе

По структуре backend у вас уже видны сущности `User`, `WaterBody`, `WaterBodyPassport` и DTO для измерений. Значит админ-панель должна управлять именно этими сущностями и показывать данные не только в таблицах, но и в визуальной форме.


## Важно по ошибке с HTML вместо JSON

Если на странице логина внизу показывается большой HTML-код, это означает, что админка стучится не в NestJS backend, а в сам Next.js frontend. Обычно причина в неверном `NEXT_PUBLIC_API_URL`. Для `lakes-backend` укажите реальный адрес backend, например `http://localhost:3001`.


## Login note
This build sends `{ login, password }` to `/auth/login` because the backend user table uses the `login` field.
