resource "aws_s3_bucket" "bucket_hd_04102025" {
  bucket = var.bucket_name

  tags = {
    Name = var.bucket_name
  }
}
