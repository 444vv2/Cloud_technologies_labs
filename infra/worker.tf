resource "aws_ecs_task_definition" "worker" {
  family                   = "${var.project_name}-worker"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  execution_role_arn       = aws_iam_role.task_execution.arn
  task_role_arn            = aws_iam_role.task.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name      = "worker"
      image     = "${aws_ecr_repository.app.repository_url}:${var.image_tag}"
      essential = true
      command   = ["node", "dist/worker.js"]
      stopTimeout = 30

      environment = [
        { name = "AWS_REGION", value = data.aws_region.current.id },
        { name = "CACHE_ENABLED", value = tostring(var.cache_enabled) },
        { name = "ASYNC_WRITES", value = "true" },
      ]

      secrets = [
        { name = "DB_HOST", valueFrom = "${aws_secretsmanager_secret.db.arn}:DB_HOST::" },
        { name = "DB_PORT", valueFrom = "${aws_secretsmanager_secret.db.arn}:DB_PORT::" },
        { name = "DB_USER", valueFrom = "${aws_secretsmanager_secret.db.arn}:DB_USER::" },
        { name = "DB_PASSWORD", valueFrom = "${aws_secretsmanager_secret.db.arn}:DB_PASSWORD::" },
        { name = "DB_NAME", valueFrom = "${aws_secretsmanager_secret.db.arn}:DB_NAME::" },
        { name = "DB_SSL", valueFrom = "${aws_secretsmanager_secret.db.arn}:DB_SSL::" },
        { name = "COGNITO_USER_POOL_ID", valueFrom = "${aws_secretsmanager_secret.db.arn}:COGNITO_USER_POOL_ID::" },
        { name = "COGNITO_CLIENT_ID", valueFrom = "${aws_secretsmanager_secret.db.arn}:COGNITO_CLIENT_ID::" },
        { name = "REDIS_URL", valueFrom = "${aws_secretsmanager_secret.db.arn}:REDIS_URL::" },
        { name = "QUEUE_URL", valueFrom = "${aws_secretsmanager_secret.db.arn}:QUEUE_URL::" },
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.app.name
          "awslogs-region"        = var.region
          "awslogs-stream-prefix" = "worker"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "worker" {
  name            = "${var.project_name}-worker"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.worker.arn
  desired_count   = var.worker_min
  launch_type     = "FARGATE"

  network_configuration {
    subnets          = aws_subnet.public[*].id
    security_groups  = [aws_security_group.app.id]
    assign_public_ip = true
  }

  lifecycle {
    ignore_changes = [task_definition, desired_count]
  }
}
