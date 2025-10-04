provider "aws" {
  region = var.region
}

# VPC Module
module "vpc" {
  source         = "../../modules/vpc"
  vpc_name       = var.vpc_name
  cidr_block     = var.cidr_block
  subnet_cidrs   = var.subnet_cidrs
  subnet_regions = var.subnet_regions
  my_ip          = var.my_ip
}

# S3 Module
module "s3" {
  source      = "../../modules/s3"
  bucket_name = "${var.env}-financial-app-bucket"
  region      = var.region
}

# IAM Module
module "iam" {
  source        = "../../modules/IAM"
  env           = var.env
  s3_bucket_arn = module.s3.bucket_arn
}

# EC2 Module - one instance in each public subnet
module "ec2_public_a" {
  source               = "../../modules/ec2"
  instance_type        = var.instance_type
  ami_id               = var.ami_id
  key_name             = var.key_name
  subnet_id            = [module.vpc.public_subnet_ids[0]]
  security_group_ids   = [module.vpc.default_sg_id]
  iam_instance_profile = module.iam.iam_instance_profile_name
  tags                 = var.tags
  name_suffix          = "a"
  depends_on           = [module.iam]
}

module "ec2_public_b" {
  source               = "../../modules/ec2"
  instance_type        = var.instance_type
  ami_id               = var.ami_id
  key_name             = var.key_name
  subnet_id            = [module.vpc.public_subnet_ids[1]]
  security_group_ids   = [module.vpc.default_sg_id]
  iam_instance_profile = module.iam.iam_instance_profile_name
  tags                 = var.tags
  name_suffix          = "b"
  depends_on           = [module.iam]
}

module "ec2_public_c" {
  source               = "../../modules/ec2"
  instance_type        = var.instance_type
  ami_id               = var.ami_id
  key_name             = var.key_name
  subnet_id            = [module.vpc.public_subnet_ids[2]]
  security_group_ids   = [module.vpc.default_sg_id]
  iam_instance_profile = module.iam.iam_instance_profile_name
  tags                 = var.tags
  name_suffix          = "c"
  depends_on           = [module.iam]
}
