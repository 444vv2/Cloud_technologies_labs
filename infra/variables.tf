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