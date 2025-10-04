variable "cluster_name" {
  type        = string
  description = "What do you want to call your cluster? (e.g., 'my-qa-cluster')"
}

variable "subnet_ids" {
  type        = list(string)
  description = "Which subnets should EKS use? Provide at least 2 subnet IDs from your VPC"
}

variable "desired_size" {
  type        = number
  default     = 2
  description = "Normal number of worker nodes you want running"
}

variable "min_size" {
  type        = number
  default     = 1
  description = "Minimum nodes"
}

variable "max_size" {
  type        = number
  default     = 3
  description = "Maximum nodes"
}

variable "instance_type" {
  type        = string
  default     = "t3.medium"
  description = "Size of each worker node"
  
}
