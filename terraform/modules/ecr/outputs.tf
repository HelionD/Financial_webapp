output "ecr_repo" {
    description = "ECR Repository"
    value       = aws_ecr_repository.ecr_repo  
}
output "ecr_repo_arn" {
    description = "ECR Repository ARN"
    value       = aws_ecr_repository.ecr_repo.arn
}
output "ecr_repo_url" {
    description = "ECR Repository URL"
    value       = aws_ecr_repository.ecr_repo.repository_url
}