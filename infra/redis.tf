resource "aws_security_group" "redis" {
  name        = "${var.project_name}-redis-sg"
  vpc_id      = aws_vpc.main.id

  ingress {
    from_port       = var.redis_port
    to_port         = var.redis_port
    protocol        = "tcp"
    security_groups = [aws_security_group.app.id]
  }

  tags = { Name = "${var.project_name}-redis-sg" }
}

resource "aws_elasticache_subnet_group" "redis" {
  name       = "${var.project_name}-redis-subnets"
  subnet_ids = aws_subnet.private[*].id
}

resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "${var.project_name}-redis"
  engine               = var.redis_engine
  engine_version       = var.redis_engine_version
  node_type            = var.redis_cache_node_type
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = var.redis_port
  subnet_group_name    = aws_elasticache_subnet_group.redis.name
  security_group_ids   = [aws_security_group.redis.id]
}
