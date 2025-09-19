provider "aws" {
  region = var.region
}

# Create the VPC
resource "aws_vpc" "dev_vpc" {
  cidr_block = var.cidr_block
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = var.vpc_name
  }
}

# Public subnet in eu-west-1a
resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.dev_vpc.id
  cidr_block              = var.subnet_cidrs["public_a"]
  availability_zone       = var.subnet_regions[0]
  map_public_ip_on_launch = true
  tags = {
    Name = "public-${var.subnet_regions[0]}"
  }
}

# Public subnet in eu-west-1b
resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.dev_vpc.id
  cidr_block              = var.subnet_cidrs["public_b"]
  availability_zone       = var.subnet_regions[1]
  map_public_ip_on_launch = true
  tags = {
    Name = "public-${var.subnet_regions[1]}"
  }
}

# Public subnet in eu-west-1c
resource "aws_subnet" "public_c" {
  vpc_id                  = aws_vpc.dev_vpc.id
  cidr_block              = var.subnet_cidrs["public_c"]
  availability_zone       = var.subnet_regions[2]
  map_public_ip_on_launch = true
  tags = {
    Name = "public-${var.subnet_regions[2]}"
  }
}

# Create private subnets
resource "aws_subnet" "private_c" {
  vpc_id                  = aws_vpc.dev_vpc.id
  cidr_block              = var.subnet_cidrs["private_c"]
  availability_zone       = var.subnet_regions[2]
  map_public_ip_on_launch = false
  tags = {
    Name = "private-${var.subnet_regions[2]}"
  }
}

# Default security group
resource "aws_security_group" "default" {
  name        = "${var.vpc_name}-sg"
  description = "Default security group for ${var.vpc_name}"
  vpc_id      = aws_vpc.dev_vpc.id

  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "${var.vpc_name}-sg"
  }
}
