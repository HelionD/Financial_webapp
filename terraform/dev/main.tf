provider "aws" {
  region = var.region
}

module "vpc" {
  source         = "../../modules/vpc"
  vpc_name       = var.vpc_name
  cidr_block     = var.cidr_block
  subnet_cidrs   = var.subnet_cidrs
  subnet_regions = var.subnet_regions
}
