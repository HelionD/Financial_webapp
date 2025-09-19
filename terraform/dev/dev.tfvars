region = "eu-west-1"
vpc_name = "dev-vpc"
cidr_block = "10.0.0.0/16"

subnet_regions = ["eu-west-1a", "eu-west-1b", "eu-west-1c"]
subnet_cidrs = {
  public_a  = "10.1.0.0/20"
  public_b  = "10.1.16.0/20"
  public_c  = "10.1.32.0/20"
  private_c = "10.1.48.0/20"
}
