resource "random_password" "db" {
  length  = var.db_password_length
  special = false
}

resource "aws_secretsmanager_secret" "db" {
  name                    = "${var.project_name}/db"
  recovery_window_in_days = 0
}

resource "aws_secretsmanager_secret_version" "db" {
  secret_id = aws_secretsmanager_secret.db.id
  secret_string = jsonencode({
    DB_HOST              = aws_db_instance.main.address
    DB_PORT              = tostring(var.db_port)
    DB_USER              = var.db_username
    DB_PASSWORD          = random_password.db.result
    DB_NAME              = var.db_name
    DB_SSL               = tostring(var.db_ssl)
    COGNITO_USER_POOL_ID = aws_cognito_user_pool.main.id
    COGNITO_CLIENT_ID    = aws_cognito_user_pool_client.app.id
    REDIS_URL            = "redis://${aws_elasticache_cluster.redis.cache_nodes[0].address}:${var.redis_port}"
  })
}

resource "aws_db_subnet_group" "main" {
  name       = "${var.project_name}-db-subnets"
  subnet_ids = aws_subnet.private[*].id

  tags = { Name = "${var.project_name}-db-subnets" }
}

resource "aws_db_instance" "main" {
  identifier = "${var.project_name}-db"

  engine         = var.db_engine
  engine_version = 16
  instance_class = "db.t4g.micro"

  allocated_storage = 20
  storage_type      = "gp3"

  db_name  = var.db_name
  username = var.db_username
  password = random_password.db.result

  db_subnet_group_name   = aws_db_subnet_group.main.name
  vpc_security_group_ids = [aws_security_group.db.id]
  publicly_accessible    = var.db_publicly_accessible
  multi_az               = false

  backup_retention_period = 0
  skip_final_snapshot     = true
  deletion_protection     = false
  apply_immediately       = true
}
