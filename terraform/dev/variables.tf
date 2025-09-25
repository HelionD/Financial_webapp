variable "region" {
  type = string
}

variable "vpc_name" {
  type = string
}

variable "cidr_block" {
  type = string
}

variable "subnet_cidrs" {
  type = map(string)
}

variable "subnet_regions" {
  type = list(string)
}