output "iam_role_name" {
  description = "The name of the IAM role"
  value       = aws_iam_role.ec2_role.name
}

output "iam_role_arn" {
  description = "The ARN of the IAM role"
  value       = aws_iam_role.ec2_role.arn
}

output "iam_instance_profile_name" {
  description = "The instance profile name to attach to EC2"
  value       = aws_iam_instance_profile.ec2_instance_profile.name
}

output "iam_instance_profile" {
  description = "The instance profile to attach to EC2 (old name for backward compatibility)"
  value       = aws_iam_instance_profile.ec2_instance_profile.name
}

output "policy_arn" {
  description = "The ARN of the S3 access policy"
  value       = aws_iam_policy.ec2_s3_policy.arn
}
