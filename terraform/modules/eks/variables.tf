# variables.tf
# This file defines all the inputs you can customize when creating your EKS cluster

variable "cluster_name" {
  type        = string
  description = "What do you want to call your cluster? (e.g., 'my-qa-cluster')"
}

variable "subnet_ids" {
  type        = list(string)
  description = "Which subnets should EKS use? Provide at least 2 subnet IDs from your VPC"
  # Example: ["subnet-abc123", "subnet-def456"]
}

# How many servers (nodes) do you want running?
variable "desired_size" {
  type        = number
  default     = 2
  description = "Normal number of worker nodes you want running"
}

variable "min_size" {
  type        = number
  default     = 1
  description = "Minimum nodes - EKS won't go below this"
}

variable "max_size" {
  type        = number
  default     = 3
  description = "Maximum nodes - EKS won't scale above this"
}

variable "instance_type" {
  type        = string
  default     = "t3.medium"
  description = "Size of each worker node (t3.medium is good for QA)"
  # t3.medium = 2 vCPUs, 4GB RAM - costs about $0.04/hour
}
