
```
Cloud
├─ app
│  ├─ .dockerignore
│  ├─ .prettierrc
│  ├─ Dockerfile
│  ├─ eslint.config.mjs
│  ├─ nest-cli.json
│  ├─ package-lock.json
│  ├─ package.json
│  ├─ src
│  │  ├─ app.module.ts
│  │  ├─ artists
│  │  │  ├─ artist.entity.ts
│  │  │  ├─ artists.controller.ts
│  │  │  ├─ artists.module.ts
│  │  │  ├─ artists.service.ts
│  │  │  └─ dto
│  │  │     ├─ create-artist.dto.ts
│  │  │     └─ update-artist.dto.ts
│  │  ├─ auth
│  │  │  ├─ auth.controller.ts
│  │  │  ├─ auth.module.ts
│  │  │  ├─ auth.service.ts
│  │  │  ├─ dto
│  │  │  │  ├─ confirm.dto.ts
│  │  │  │  ├─ login.dto.ts
│  │  │  │  └─ sign-up.dto.ts
│  │  │  ├─ jwt-auth.guard.ts
│  │  │  ├─ jwt.strategy.ts
│  │  │  └─ public.decorator.ts
│  │  ├─ cache
│  │  │  ├─ cache.module.ts
│  │  │  └─ cache.service.ts
│  │  ├─ debug.controller.ts
│  │  ├─ health.controller.ts
│  │  ├─ main.ts
│  │  └─ songs
│  │     ├─ dto
│  │     │  ├─ create-song.dto.ts
│  │     │  └─ update-song.dto.ts
│  │     ├─ song.entity.ts
│  │     ├─ songs.controller.ts
│  │     ├─ songs.module.ts
│  │     └─ songs.service.ts
│  ├─ tsconfig.build.json
│  └─ tsconfig.json
├─ docker-compose.yaml
├─ docs
│  ├─ ALERTS.md
│  ├─ AUTOSCALING.md
│  ├─ CACHE-LOADTEST.md
│  └─ public
│     ├─ cache
│     │  ├─ alarm_msg.png
│     │  ├─ ecs.png
│     │  ├─ monitors.png
│     │  └─ rds.png
│     └─ no_cache
│        ├─ alarm_msg.png
│        ├─ cpu_metric.png
│        ├─ ecs.png
│        └─ monitors.png
├─ infra
│  ├─ .terraform.lock.hcl
│  ├─ alb.tf
│  ├─ autoscaling.tf
│  ├─ cognito.tf
│  ├─ ecr.tf
│  ├─ ecs.tf
│  ├─ github_oidc.tf
│  ├─ iam.tf
│  ├─ monitoring.tf
│  ├─ network.tf
│  ├─ outputs.tf
│  ├─ providers.tf
│  ├─ rds.tf
│  ├─ redis.tf
│  ├─ security.tf
│  └─ variables.tf
├─ loadtest
│  └─ k6.js
└─ README.md

```