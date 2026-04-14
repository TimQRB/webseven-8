# Backend notes for client app

Для клиентской версии не нужны административные write-endpoints.

## Достаточно таких маршрутов

- `POST /auth/login`
- `POST /auth/register`
- `POST /auth/refresh`
- `GET /auth/me` или `GET /auth/profile` или `GET /users/me`
- `GET /water-bodies`
- `GET /water-bodies/:id`
- `GET /water-bodies/:id/measurements`

## Желательно

1. Возвращать `avatarUrl` у пользователя.
2. Возвращать `latitude` и `longitude` у водоёмов.
3. На `register` отдавать тот же ответ, что и на `login`, чтобы можно было сразу авторизовать клиента.
