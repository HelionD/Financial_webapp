# Create the VPC
resource "aws_vpc" "dev_vpc" {
  cidr_block           = var.cidr_block
  enable_dns_support   = true
  enable_dns_hostnames = true

  tags = {
    Name = var.vpc_name
  }
}

# Internet Gateway
resource "aws_internet_gateway" "igw" {
  vpc_id = aws_vpc.dev_vpc.id

  tags = {
    Name = "${var.vpc_name}-igw"
  }
}

# Public Subnets
resource "aws_subnet" "public_a" {
  vpc_id                  = aws_vpc.dev_vpc.id
  cidr_block              = var.subnet_cidrs["public_a"]
  availability_zone       = var.subnet_regions[0]
  map_public_ip_on_launch = true

  tags = {
    Name = "public-${var.subnet_regions[0]}"
  }
}

resource "aws_subnet" "public_b" {
  vpc_id                  = aws_vpc.dev_vpc.id
  cidr_block              = var.subnet_cidrs["public_b"]
  availability_zone       = var.subnet_regions[1]
  map_public_ip_on_launch = true

  tags = {
    Name = "public-${var.subnet_regions[1]}"
  }
}

resource "aws_subnet" "public_c" {
  vpc_id                  = aws_vpc.dev_vpc.id
  cidr_block              = var.subnet_cidrs["public_c"]
  availability_zone       = var.subnet_regions[2]
  map_public_ip_on_launch = true

  tags = {
    Name = "public-${var.subnet_regions[2]}"
  }
}

# Private Subnets
resource "aws_subnet" "private_a" {
  vpc_id                  = aws_vpc.dev_vpc.id
  cidr_block              = var.subnet_cidrs["private_a"]
  availability_zone       = var.subnet_regions[0]
  map_public_ip_on_launch = false

  tags = {
    Name = "private-${var.subnet_regions[0]}"
  }
}

resource "aws_subnet" "private_b" {
  vpc_id                  = aws_vpc.dev_vpc.id
  cidr_block              = var.subnet_cidrs["private_b"]
  availability_zone       = var.subnet_regions[1]
  map_public_ip_on_launch = false

  tags = {
    Name = "private-${var.subnet_regions[1]}"
  }
}

resource "aws_subnet" "private_c" {
  vpc_id                  = aws_vpc.dev_vpc.id
  cidr_block              = var.subnet_cidrs["private_c"]
  availability_zone       = var.subnet_regions[2]
  map_public_ip_on_launch = false

  tags = {
    Name = "private-${var.subnet_regions[2]}"
  }
}

# Security Group
resource "aws_security_group" "default" {
  name        = "${var.vpc_name}-sg"
  description = "Default security group for ${var.vpc_name}"
  vpc_id      = aws_vpc.dev_vpc.id

  # SSH access from your IP only
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["${var.my_ip}/32"]
  }

  # HTTP access
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # All outbound traffic
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

# Public Route Table
resource "aws_route_table" "public" {
  vpc_id = aws_vpc.dev_vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.igw.id
  }

  tags = {
    Name = "${var.vpc_name}-public-rt"
  }
}

# Associate public subnets with public route table
resource "aws_route_table_association" "public_a" {
  subnet_id      = aws_subnet.public_a.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_b" {
  subnet_id      = aws_subnet.public_b.id
  route_table_id = aws_route_table.public.id
}

resource "aws_route_table_association" "public_c" {
  subnet_id      = aws_subnet.public_c.id
  route_table_id = aws_route_table.public.id
}
