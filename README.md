
```
Cloud
├─ app
│  ├─ Dockerfile                              # Контейнеризація бекенду для запуску в Docker
│  ├─ package.json                            # Залежності, скрипти запуску та збірки проєкту
│  ├─ src
│  │  ├─ main.ts                             # Точка запуску NestJS застосунку
│  │  ├─ app.module.ts                       # Головний модуль, де підключаються всі компоненти
│  │  ├─ artists                             # Модуль для роботи з артистами
│  │  │  ├─ artist.entity.ts                 # Модель даних артиста для ORM
│  │  │  ├─ artists.controller.ts            # API для CRUD-операцій над артистами
│  │  │  ├─ artists.module.ts                # Реєстрація модуля артистів
│  │  │  ├─ artists.service.ts               # Бізнес-логіка для артистів
│  │  │  └─ dto                              # DTO для валідації даних
│  │  │     ├─ create-artist.dto.ts
│  │  │     └─ update-artist.dto.ts
│  │  ├─ songs                               # Модуль для роботи з піснями
│  │  │  ├─ song.entity.ts                   # Модель даних пісні для ORM
│  │  │  ├─ songs.controller.ts              # API для CRUD-операцій над піснями
│  │  │  ├─ songs.module.ts                  # Реєстрація модуля пісень
│  │  │  ├─ songs.service.ts                 # Бізнес-логіка для пісень
│  │  │  └─ dto                              # DTO для валідації даних
│  │  │     ├─ create-song.dto.ts
│  │  │     └─ update-song.dto.ts
│  │  ├─ auth                                # Авторизація та аутентифікація користувачів
│  │  │  ├─ auth.controller.ts               # Логін, реєстрація та перевірка доступу
│  │  │  ├─ auth.module.ts                   # Реєстрація модулів авторизації
│  │  │  ├─ auth.service.ts                  # Логіка роботи з користувачами та JWT
│  │  │  ├─ jwt.strategy.ts                  # Стратегія перевірки JWT-токена
│  │  │  ├─ jwt-auth.guard.ts                # Guard для захищених маршрутів
│  │  │  ├─ public.decorator.ts              # Маркер виключення авторизації для публічних маршрутів
│  │  │  └─ dto                              # DTO для логіну та реєстрації
│  │  │     ├─ confirm.dto.ts
│  │  │     ├─ login.dto.ts
│  │  │     └─ sign-up.dto.ts
│  │  ├─ health.controller.ts                # Ендпоінт перевірки стану сервісу
│  │  └─ debug.controller.ts                 # Для перевірки аларму
│  ├─ .dockerignore                           # Виключає непотрібні файли з Docker image
│  ├─ .prettierrc                           
│  ├─ eslint.config.mjs                       
│  ├─ nest-cli.json                         
│  ├─ tsconfig.build.json                    
│  └─ tsconfig.json                           
├─ docker-compose.yaml                       # Запуск локальних контейнерів і сервісів для розробки
├─ infra                                      # AWS-інфраструктура проєкту
│  ├─ .terraform.lock.hcl                     # Фіксація версій Terraform-плагінів
│  ├─ providers.tf                            # Підключення провайдера AWS
│  ├─ network.tf                              # Мережа, підмережі та маршрутизація
│  ├─ security.tf                             # Групи безпеки та правила доступу
│  ├─ rds.tf                                  # Конфігурація бази даних Amazon RDS
│  ├─ ecs.tf                                  # Запуск застосунку в Amazon ECS
│  ├─ ecr.tf                                  # Реєстр контейнерних образів
│  ├─ alb.tf                                  # Балансувальник навантаження ALB
│  ├─ cognito.tf                              # Автентифікація через AWS Cognito
│  ├─ iam.tf                                  # Ролі, політики та права доступу
│  ├─ monitoring.tf                           # Логування та моніторинг системи
│  ├─ github_oidc.tf                          # Автоматизація деплойменту через GitHub Actions
│  ├─ outputs.tf                              # Вивід основних параметрів після розгортання
│  ├─ variables.tf                            # Змінні конфігурації інфраструктури
└─ README.md                                   # документація проєкту

```