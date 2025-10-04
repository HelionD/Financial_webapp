variable "region" {
  type        = string
  description = "Which AWS region? (e.g., eu-west-1)"
}

variable "env" {
  type        = string
  description = "Environment name (qa, dev, prod)"
}

variable "my_ip" {
  type        = string
  description = "Your IP address for SSH access (get it from whatismyip.com)"
}

variable "tags" {
  type        = map(string)
  description = "Tags to add to all resources"
}

# VPC / NETWORK SETTINGS

variable "vpc_name" {
  type        = string
  description = "Name for your VPC"
}

variable "cidr_block" {
  type        = string
  description = "IP range for your VPC (e.g., 10.1.0.0/16)"
}

variable "subnet_cidrs" {
  type        = map(string)
  description = "Map of subnet names to their IP ranges"
}

variable "subnet_regions" {
  type        = list(string)
  description = "Which availability zones to use"
}

# EC2 SETTINGS

variable "instance_type" {
  type        = string
  description = "Size of EC2 instance (t3.micro for testing)"
}

variable "ami_id" {
  type        = string
  description = "Which Amazon Machine Image to use"
}

variable "key_name" {
  type        = string
  description = "SSH key pair name for connecting to EC2"
}

# EKS SETTINGS

variable "eks_desired_size" {
  type        = number
  default     = 2
  description = "How many EKS worker nodes to start with"
}

variable "eks_min_size" {
  type        = number
  default     = 1
  description = "Minimum EKS worker nodes"
}

variable "eks_max_size" {
  type        = number
  default     = 4
  description = "Maximum EKS worker nodes"
}

variable "eks_instance_type" {
  type        = string
  default     = "t3.medium"
  description = "Size of EKS worker nodes (t3.medium is good for QA)"
}