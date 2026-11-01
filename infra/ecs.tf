resource "aws_cloudwatch_log_group" "app" {
  name              = "/ecs/${var.project_name}"
  retention_in_days = 7
}

resource "aws_ecs_cluster" "main" {
  name = "${var.project_name}-cluster"
}

resource "aws_ecs_task_definition" "app" {
  family                   = "${var.project_name}-app"
  requires_compatibilities = ["FARGATE"]
  network_mode             = "awsvpc"
  cpu                      = var.task_cpu
  memory                   = var.task_memory
  execution_role_arn       = aws_iam_role.task_execution.arn

  runtime_platform {
    operating_system_family = "LINUX"
    cpu_architecture        = "X86_64"
  }

  container_definitions = jsonencode([
    {
      name      = "app"
      image     = "${aws_ecr_repository.app.repository_url}:${var.image_tag}"
      essential = true

      portMappings = [
        {
          containerPort = var.container_port
          protocol      = "tcp"
        }
      ]

      environment = [
        { name = "PORT",                 value = tostring(var.container_port) },
        { name = "AWS_REGION",           value = data.aws_region.current.id },
      ]

      secrets = [
        { name = "DB_HOST",              valueFrom = "${aws_secretsmanager_secret.db.arn}:DB_HOST::" },
        { name = "DB_PORT",              valueFrom = "${aws_secretsmanager_secret.db.arn}:DB_PORT::" },
        { name = "DB_USER",              valueFrom = "${aws_secretsmanager_secret.db.arn}:DB_USER::" },
        { name = "DB_PASSWORD",          valueFrom = "${aws_secretsmanager_secret.db.arn}:DB_PASSWORD::" },
        { name = "DB_NAME",              valueFrom = "${aws_secretsmanager_secret.db.arn}:DB_NAME::" },
        { name = "DB_SSL",               valueFrom = "${aws_secretsmanager_secret.db.arn}:DB_SSL::" },
        { name = "COGNITO_USER_POOL_ID", valueFrom = "${aws_secretsmanager_secret.db.arn}:COGNITO_USER_POOL_ID::" },
        { name = "COGNITO_CLIENT_ID",    valueFrom = "${aws_secretsmanager_secret.db.arn}:COGNITO_CLIENT_ID::" },
      ]

      logConfiguration = {
        logDriver = "awslogs"
        options = {
          "awslogs-group"         = aws_cloudwatch_log_group.app.name
          "awslogs-region"        = var.region
          "awslogs-stream-prefix" = "app"
        }
      }
    }
  ])
}

resource "aws_ecs_service" "app" {
  name            = "${var.project_name}-svc"
  cluster         = aws_ecs_cluster.main.id
  task_definition = aws_ecs_task_definition.app.arn
  desired_count   = 1
  launch_type     = "FARGATE"

  health_check_grace_period_seconds = var.health_check_grace_period_seconds

  network_configuration {
    subnets          = aws_subnet.public[*].id
    security_groups  = [aws_security_group.app.id]
    assign_public_ip = true
  }

  load_balancer {
    target_group_arn = aws_lb_target_group.app.arn
    container_name   = "app"
    container_port   = var.container_port
  }

  depends_on = [aws_lb_listener.http]

  lifecycle {
    ignore_changes = [task_definition]
  }
}
