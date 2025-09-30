# qa.tfvars
# Your actual QA environment values

# Basic settings
region = "eu-west-1"
env    = "qa"

# Your IP for SSH access (update this with your actual IP)
my_ip = "YOUR_IP_HERE/32"  # Get from whatismyip.com

# VPC network configuration
vpc_name   = "qa-vpc"
cidr_block = "10.1.0.0/16"

subnet_regions = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]
subnet_cidrs = {
  public_a  = "10.1.1.0/24"
  public_b  = "10.1.2.0/24"
  public_c  = "10.1.3.0/24"
  private_a = "10.1.10.0/24"  # Added for EKS
  private_b = "10.1.11.0/24"  # Added for EKS
  private_c = "10.1.12.0/24"  # EKS needs at least 2 private subnets
}

# EC2 instance settings (your traditional server)
instance_type = "t3.micro"
ami_id        = "ami-0c55b159cbfafe1f0"  # Double-check this AMI exists in eu-west-1
key_name      = "qa-key-pair"

# EKS cluster settings (your Kubernetes cluster)
eks_desired_size  = 2    # Start with 2 nodes
eks_min_size      = 1    # Can scale down to 1
eks_max_size      = 4    # Can scale up to 4
eks_instance_type = "t3.medium"

# Tags for all resources
tags = {
  Environment = "qa"
  Project     = "FinancialApp"
  ManagedBy   = "Terraform"
}