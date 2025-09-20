variable "env" {
  description = "The environment for the resources (e.g., dev, qa, prod)"
  type        = string
  default     = "dev"
}

variable "s3_bucket_arn" {
  description = "The ARN of the S3 bucket that the EC2 instance should access"
  type        = string
}