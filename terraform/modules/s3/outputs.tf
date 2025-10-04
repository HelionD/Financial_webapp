output "region" {
  value = var.region
}

output "bucket_name" {
  value = var.bucket_name
}

output "bucket_arn" {
  description = "ARN of the S3 bucket"
  value       = aws_s3_bucket.dev_bucket_hd_100202025.arn
}
