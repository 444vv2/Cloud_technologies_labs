# Автоматичне масштабування

Файл: `infra/autoscaling.tf` (ECS Service Auto Scaling, Target Tracking).

| Параметр           | Значення                          | 
| ------------------ | --------------------------------- |
| min / max          | 1 / 3                             |
| Метрика            | `ECSServiceAverageCPUUtilization` |
| Ціль               | 50%                               |
| scale_out_cooldown | 60 с                              | 
| scale_in_cooldown  | 300 с                             |
