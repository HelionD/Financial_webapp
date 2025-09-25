output "names" {
  description = "The names of the EC2 instances"
  value       = aws_instance.primary_instance[*].tags["Name"]
}

output "instance_ids" {
  description = "The IDs of the EC2 instances"
  value       = aws_instance.primary_instance[*].id
}

output "public_ips" {
  description = "The public IP addresses of the EC2 instances"
  value       = aws_instance.primary_instance[*].public_ip
}

output "amis" {
  description = "The AMI IDs of the EC2 instances"
  value       = aws_instance.primary_instance[*].ami
}