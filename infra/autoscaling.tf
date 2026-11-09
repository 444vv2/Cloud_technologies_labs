resource "aws_appautoscaling_target" "app" {
  service_namespace  = "ecs"
  scalable_dimension = "ecs:service:DesiredCount"
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.app.name}"
  min_capacity       = var.autoscaling_min
  max_capacity       = var.autoscaling_max

  lifecycle {
    ignore_changes = [min_capacity, max_capacity]
  }
}

resource "aws_appautoscaling_scheduled_action" "day" {
  name               = "${var.project_name}-day"
  service_namespace  = aws_appautoscaling_target.app.service_namespace
  scalable_dimension = aws_appautoscaling_target.app.scalable_dimension
  resource_id        = aws_appautoscaling_target.app.resource_id
  schedule           = var.schedule_day_cron
  timezone           = var.schedule_timezone

  scalable_target_action {
    min_capacity = var.schedule_day_min
    max_capacity = var.autoscaling_max
  }
}

resource "aws_appautoscaling_scheduled_action" "night" {
  name               = "${var.project_name}-night"
  service_namespace  = aws_appautoscaling_target.app.service_namespace
  scalable_dimension = aws_appautoscaling_target.app.scalable_dimension
  resource_id        = aws_appautoscaling_target.app.resource_id
  schedule           = var.schedule_night_cron
  timezone           = var.schedule_timezone

  scalable_target_action {
    min_capacity = var.schedule_night_min
    max_capacity = var.autoscaling_max
  }
}

resource "aws_appautoscaling_target" "worker" {
  service_namespace  = "ecs"
  scalable_dimension = "ecs:service:DesiredCount"
  resource_id        = "service/${aws_ecs_cluster.main.name}/${aws_ecs_service.worker.name}"
  min_capacity       = var.worker_min
  max_capacity       = var.worker_max
}

resource "aws_appautoscaling_policy" "worker_backlog" {
  name               = "${var.project_name}-worker-backlog"
  policy_type        = "TargetTrackingScaling"
  service_namespace  = aws_appautoscaling_target.worker.service_namespace
  scalable_dimension = aws_appautoscaling_target.worker.scalable_dimension
  resource_id        = aws_appautoscaling_target.worker.resource_id

  target_tracking_scaling_policy_configuration {
    target_value       = var.worker_backlog_target
    scale_out_cooldown = var.scale_out_cooldown
    scale_in_cooldown  = var.scale_in_cooldown

    customized_metric_specification {
      metrics {
        id          = "visible"
        return_data = false
        metric_stat {
          stat = "Average"
          metric {
            namespace   = "AWS/SQS"
            metric_name = "ApproximateNumberOfMessagesVisible"
            dimensions {
              name  = "QueueName"
              value = aws_sqs_queue.songs.name
            }
          }
        }
      }
      metrics {
        id          = "running"
        return_data = false
        metric_stat {
          stat = "Average"
          metric {
            namespace   = "ECS/ContainerInsights"
            metric_name = "RunningTaskCount"
            dimensions {
              name  = "ClusterName"
              value = aws_ecs_cluster.main.name
            }
            dimensions {
              name  = "ServiceName"
              value = aws_ecs_service.worker.name
            }
          }
        }
      }
      metrics {
        id          = "backlog"
        expression  = "visible / running"
        label       = "Backlog per task"
        return_data = true
      }
    }
  }
}

resource "aws_appautoscaling_policy" "cpu" {
  name               = "${var.project_name}-cpu-target"
  policy_type        = "TargetTrackingScaling"
  service_namespace  = aws_appautoscaling_target.app.service_namespace
  scalable_dimension = aws_appautoscaling_target.app.scalable_dimension
  resource_id        = aws_appautoscaling_target.app.resource_id

  target_tracking_scaling_policy_configuration {
    target_value       = var.autoscaling_cpu_target
    scale_out_cooldown = var.scale_out_cooldown
    scale_in_cooldown  = var.scale_in_cooldown

    predefined_metric_specification {
      predefined_metric_type = "ECSServiceAverageCPUUtilization"
    }
  }
}
