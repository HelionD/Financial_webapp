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

variable "instance_type" {
  type = string
}

variable "key_name" {
  type = string
}

variable "env" {
  type = string
}

variable "my_ip" {
  type = string
}

variable "tags" {
  type = map(string)
}
variable "ami_id" {
  type = string
}