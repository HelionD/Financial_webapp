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

module "s3" {
  source      = "../../modules/s3"
  bucket_name = "${var.env}-financial-app-bucket"
  region      = var.region
  versioning  = true
}

module "iam" {
  source        = "../../modules/IAM"
  env           = var.env
  s3_bucket_arn = module.s3.bucket_arn
}

module "ec2" {
  source               = "../../modules/ec2"
  instance_type        = var.instance_type
  ami_id               = var.ami_id
  key_name             = var.key_name
  subnet_id            = module.vpc.public_subnet_ids
  iam_instance_profile = module.iam.iam_instance_profile_name
  tags                 = var.tags
  depends_on           = [module.iam]
}