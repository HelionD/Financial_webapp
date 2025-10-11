variable "ecr_repository_name" {
  description = "The name of the ECR repository"
  type        = string
}
variable "image_tag_mutability" {
    description = "The tag mutability setting for the repository"
    type        = string
    default     = "MUTABLE"
}
variable "scan_on_push" {
    description = "Whether to scan images after they are pushed to the repository"
    type        = bool
    default     = true
}
variable "tags" {
    description = "A map of tags to assign to the resource"
    type        = map(string)
    default     = {}
}
