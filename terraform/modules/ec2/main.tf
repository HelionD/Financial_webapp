data "aws_ami" "latest" {
  most_recent = true
  owners      = ["amazon"]

  filter {
    name   = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_instance" "primary_instance" {
  count                  = length(var.subnet_id)
  ami                    = data.aws_ami.latest.id
  instance_type          = var.instance_type
  key_name               = var.key_name
  subnet_id              = var.subnet_id[count.index]
  vpc_security_group_ids = var.security_group_ids
  iam_instance_profile   = var.iam_instance_profile
  
  tags = merge(var.tags, {
    Name = "primary-instance-${count.index + 1}"
  })
}