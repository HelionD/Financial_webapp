region       = "eu-west-1"
vpc_name     = "dev-vpc"
cidr_block   = "10.0.0.0/16"

subnet_regions = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]
subnet_cidrs = {
  public_a  = "10.0.1.0/24"   
  public_b  = "10.0.2.0/24"
  public_c  = "10.0.3.0/24"
  private_c = "10.0.10.0/24"
}

instance_type = "t2.micro"
ami_id        = "ami-0c55b159cbfafe1f0"
key_name      = "my-key-pair"
env  = "dev"
tags = {
  Environment = "dev"
  Project     = "FinancialApp"
}