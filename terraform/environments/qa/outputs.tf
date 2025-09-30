# outputs.tf - QA Environment
# After running terraform apply, you'll see these values

# ============================================================================
# VPC OUTPUTS
# ============================================================================

output "vpc_id" {
  value       = module.vpc.vpc_id
  description = "ID of your VPC"
}

output "public_subnet_ids" {
  value       = module.vpc.public_subnet_ids
  description = "IDs of public subnets (for EC2)"
}

output "private_subnet_ids" {
  value       = module.vpc.private_subnet_ids
  description = "IDs of private subnets (for EKS)"
}

# ============================================================================
# S3 OUTPUTS
# ============================================================================

output "s3_bucket_name" {
  value       = module.s3.bucket_name
  description = "Name of your S3 bucket"
}

# ============================================================================
# EC2 OUTPUTS
# ============================================================================

output "ec2_instance_id" {
  value       = module.ec2.instance_id
  description = "ID of your EC2 instance"
}

output "ec2_public_ip" {
  value       = module.ec2.public_ip
  description = "Public IP to SSH into your EC2 instance"
}

# ============================================================================
# EKS OUTPUTS
# ============================================================================

output "eks_cluster_name" {
  value       = module.eks.cluster_name
  description = "Name of your EKS cluster"
}

output "eks_cluster_endpoint" {
  value       = module.eks.cluster_endpoint
  description = "Endpoint for your EKS cluster"
}

output "eks_cluster_status" {
  value       = module.eks.cluster_status
  description = "Status of your EKS cluster (should be ACTIVE)"
}