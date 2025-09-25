variable "vpc_name" {
  description = "Name of the VPC"
  type        = string
}

variable "cidr_block" {
  description = "CIDR block for the VPC"
  type        = string
}

variable "subnet_regions" {
  description = "List of availability zones for subnets"
  type        = list(string)
}

variable "subnet_cidrs" {
  description = "Map of subnet CIDRs"
  type        = map(string)
}

variable "my_ip" {
  description = "Your IP address for SSH access"
  type        = string
}