# main.tf
# This creates your EKS cluster and all the permissions it needs

# ------------------------------------------------------------------------------
# STEP 1: Create a role for the EKS control plane
# Think of this as giving EKS permission to manage your cluster
# ------------------------------------------------------------------------------

resource "aws_iam_role" "cluster_role" {
  name = "${var.cluster_name}-cluster-role"

  # This policy says "EKS service can use this role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "eks.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

# Attach AWS's pre-made policy that gives EKS the permissions it needs
resource "aws_iam_role_policy_attachment" "cluster_policy" {
  role       = aws_iam_role.cluster_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
}

# ------------------------------------------------------------------------------
# STEP 2: Create a role for the worker nodes (your actual servers)
# These are the machines that will run your containers
# ------------------------------------------------------------------------------

resource "aws_iam_role" "node_role" {
  name = "${var.cluster_name}-node-role"

  # This says "EC2 instances can use this role"
  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [{
      Effect = "Allow"
      Principal = {
        Service = "ec2.amazonaws.com"
      }
      Action = "sts:AssumeRole"
    }]
  })
}

# These three policies give your nodes the permissions they need:

# 1. Basic worker node permissions
resource "aws_iam_role_policy_attachment" "node_worker_policy" {
  role       = aws_iam_role.node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy"
}

# 2. Networking permissions (so pods can talk to each other)
resource "aws_iam_role_policy_attachment" "node_cni_policy" {
  role       = aws_iam_role.node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy"
}

# 3. Permission to pull Docker images from ECR
resource "aws_iam_role_policy_attachment" "node_ecr_policy" {
  role       = aws_iam_role.node_role.name
  policy_arn = "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
}

# ------------------------------------------------------------------------------
# STEP 3: Create the actual EKS cluster
# This is the brain that orchestrates everything
# ------------------------------------------------------------------------------

resource "aws_eks_cluster" "main" {
  name     = var.cluster_name
  role_arn = aws_iam_role.cluster_role.arn

  vpc_config {
    subnet_ids = var.subnet_ids
  }

  # Make sure the permissions are set up before creating the cluster
  depends_on = [aws_iam_role_policy_attachment.cluster_policy]
}

# ------------------------------------------------------------------------------
# STEP 4: Create the worker nodes
# These are the actual EC2 instances that run your applications
# ------------------------------------------------------------------------------

resource "aws_eks_node_group" "main" {
  cluster_name    = aws_eks_cluster.main.name
  node_group_name = "${var.cluster_name}-workers"
  node_role_arn   = aws_iam_role.node_role.arn
  subnet_ids      = var.subnet_ids

  # How many nodes do you want?
  scaling_config {
    desired_size = var.desired_size  # Start with this many
    min_size     = var.min_size      # Never go below this
    max_size     = var.max_size      # Never go above this
  }

  instance_types = [var.instance_type]

  # Make sure all the node permissions are ready first
  depends_on = [
    aws_iam_role_policy_attachment.node_worker_policy,
    aws_iam_role_policy_attachment.node_cni_policy,
    aws_iam_role_policy_attachment.node_ecr_policy
  ]
}