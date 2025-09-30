# outputs.tf
# After Terraform creates your cluster, these are the values you'll need

output "cluster_name" {
  value       = aws_eks_cluster.main.name
  description = "The name of your EKS cluster"
}

output "cluster_endpoint" {
  value       = aws_eks_cluster.main.endpoint
  description = "The URL where kubectl talks to your cluster"
  # You'll use this with: aws eks update-kubeconfig --name <cluster_name>
}

output "cluster_security_group_id" {
  value       = aws_eks_cluster.main.vpc_config[0].cluster_security_group_id
  description = "Security group that EKS created for the cluster"
}

output "node_group_name" {
  value       = aws_eks_node_group.main.node_group_name
  description = "The name of your worker node group"
}

output "node_group_status" {
  value       = aws_eks_node_group.main.status
  description = "Status of your node group (should say ACTIVE when ready)"
}