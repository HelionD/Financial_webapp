variable "instance_type" {
  description = "The type of instance to create"
  type        = string
}

variable "key_name" {
  description = "The name of the key pair to use for the instance"
  type        = string
  default     = null
}

variable "subnet_id" {
  description = "List of VPC Subnet IDs to launch instances in"
  type        = list(string)
}

variable "security_group_ids" {
  description = "List of security group IDs to associate with the instances"
  type        = list(string)
}

variable "iam_instance_profile" {
  description = "The IAM instance profile name to attach to EC2 instances"
  type        = string
}

variable "tags" {
  description = "A map of tags to assign to the resource"
  type        = map(string)
  default     = {}
}