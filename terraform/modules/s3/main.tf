resource "aws_s3_bucket" "dev_bucket_hd_100202025" {
  bucket = var.bucket_name

  tags = {
    Name = var.bucket_name
  }
}
