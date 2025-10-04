provider "aws" {
  region = var.region
}

# Create the network (VPC, subnets, security groups)
module "vpc" {
  source         = "../../modules/vpc"
  vpc_name       = var.vpc_name
  cidr_block     = var.cidr_block
  subnet_cidrs   = var.subnet_cidrs
  subnet_regions = var.subnet_regions
  my_ip          = var.my_ip
}

# S3 bucket for hosting files
module "s3" {
  source      = "../../modules/s3"
  bucket_name = "${var.env}-financial-app-bucket"
  region      = var.region
}

# IAM roles and permissions
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
  security_group_ids   = [module.vpc.default_sg_id]
  iam_instance_profile = module.iam.iam_instance_profile_name
  tags                 = var.tags
  name_suffix          = "qa"
  depends_on           = [module.iam]
}

# Create EKS cluster 
module "eks" {
  source = "../../modules/eks"
  
  cluster_name = "${var.env}-financial-app-cluster"
  
  # Private subnets for EKS
  subnet_ids = module.vpc.private_subnet_ids
  
  # Node configuration
  desired_size  = var.eks_desired_size
  min_size      = var.eks_min_size
  max_size      = var.eks_max_size
  instance_type = var.eks_instance_type
  
  depends_on = [module.vpc]
}