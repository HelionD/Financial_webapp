data "aws_ami" "latest_ami" {
  most_recent = true
  owners      = ["amazon"]
}

resource "aws_instance" "primary_instance" {
    count         = length(var.subnet_id)
    ami           = data.aws_ami.latest_ami.id
    instance_type = var.instance_type
    key_name      = var.key_name
    subnet_id     = var.subnet_id[count.index]
    vpc_security_group_ids = var.security_group_ids
    
  tags = merge(var.tags, {
    Name = "primary-instance-${count.index + 1}"
  })
}