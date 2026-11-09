variable "region" {
  type = string
}
variable "project_name" {
  type = string
}
variable "vpc_cidr" {
  type = string
}
variable "container_port" {
  type = number
}
variable "alb_port" {
  type = number
}
variable "image_tag" {
  type = string
}
variable "task_cpu" {
  type = number
}
variable "task_memory" {
  type = number
}



variable "db_name" {
  type = string
}
variable "db_username" {
  type = string
}
variable "db_port" {
  type = number
}
variable "db_engine" {
  type = string
}
variable "db_publicly_accessible" {
  type = bool
}
variable "db_password_length" {
  type = number
}
variable "db_ssl" {
  type = bool
}
variable "redis_port" {
  type = number
}
variable "redis_engine_version" {
  type = number
}
variable "redis_engine" {
  type = string
}
variable "redis_cache_node_type" {
  type = string
}


variable "target_group_deregistration_delay" {
  type = number
}
variable "subnet_count" {
  type = number
}
variable "subnet_newbits" {
  type = number
}
variable "private_subnet_offset" {
  type = number
}
variable "internet_cidr" {
  type = string
}



variable "health_check_path" {
  type = string
}
variable "health_check_grace_period_seconds" {
  type = number
}
variable "health_check_matcher" {
  type = string
}
variable "health_check_interval" {
  type = number
}
variable "health_check_timeout" {
  type = number
}
variable "health_check_healthy_threshold" {
  type = number
}
variable "health_check_unhealthy_threshold" {
  type = number
}

variable "github_repo" {
  type = string
}
variable "alert_email" {
  type = string
}

variable "cache_enabled" {
  type = bool
}
variable "autoscaling_min" {
  type = number
}
variable "autoscaling_max" {
  type = number
}
variable "autoscaling_cpu_target" {
  type = number
}
variable "scale_out_cooldown" {
  type = number
}
variable "scale_in_cooldown" {
  type = number
}

variable "async_writes" {
  type = bool
}
variable "queue_visibility_timeout" {
  type = number
}
variable "worker_min" {
  type = number
}
variable "worker_max" {
  type = number
}
variable "worker_backlog_target" {
  type = number
}

variable "schedule_day_cron" {
  type = string
}
variable "schedule_night_cron" {
  type = string
}
variable "schedule_timezone" {
  type = string
}
variable "schedule_day_min" {
  type = number
}
variable "schedule_night_min" {
  type = number
}
