output "names" {
  description = "The names of the EC2 instances"
  value       = aws_instance.primary_instance[*].tags["Name"]
}

# What the dev environment expects
output "instance_id" {
  description = "The ID of the first EC2 instance"
  value       = length(aws_instance.primary_instance) > 0 ? aws_instance.primary_instance[0].id : null
}

# Keep the plural version too
output "instance_ids" {
  description = "The IDs of all EC2 instances"
  value       = aws_instance.primary_instance[*].id
}

# What the dev environment expects
output "public_ip" {
  description = "The public IP of the first EC2 instance"
  value       = length(aws_instance.primary_instance) > 0 ? aws_instance.primary_instance[0].public_ip : null
}

# Keep the plural version too
output "public_ips" {
  description = "The public IP addresses of all EC2 instances"
  value       = aws_instance.primary_instance[*].public_ip
}

output "amis" {
  description = "The AMI IDs of the EC2 instances"
  value       = aws_instance.primary_instance[*].ami
}