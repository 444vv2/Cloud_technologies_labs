# Навантажувальне тестування

Інструмент: k6. Сценарій: `loadtest/k6.js`.

```
k6 run -e BASE_URL=http://<alb-dns> -e EMAIL=... -e PASSWORD=... -e VUS=40 loadtest/k6.js
```

Профіль: на ітерацію 1×`POST /songs` + 9 читань (`GET /songs`, `GET /songs/:id`, `GET /artists/:id`). Фази: 0→N за 2,5 хв, N 5 хв, N→0 за 2 хв. N (`VUS`) підібрано = _TODO_.

## Результати (кеш вимкнено)

| Запитів | Частка помилок | p50  | p95  | p99  |
| ------- | -------------- | ---- | ---- | ---- |
| TODO    | TODO           | TODO | TODO | TODO |
