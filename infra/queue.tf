resource "aws_sqs_queue" "songs_dlq" {
  name                      = "${var.project_name}-songs-dlq"
  message_retention_seconds = 1209600
}

resource "aws_sqs_queue" "songs" {
  name                       = "${var.project_name}-songs"
  visibility_timeout_seconds = var.queue_visibility_timeout

  redrive_policy = jsonencode({
    deadLetterTargetArn = aws_sqs_queue.songs_dlq.arn
    maxReceiveCount     = 3
  })
}
