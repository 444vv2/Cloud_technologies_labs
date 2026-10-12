
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
├─ infra
│  ├─ .terraform.lock.hcl
│  ├─ alb.tf
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
│  ├─ security.tf
│  └─ variables.tf
└─ README.md

```