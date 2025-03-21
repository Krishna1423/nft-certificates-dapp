#!/bin/bash
exec > /var/log/user-data.log 2>&1  # Redirect logs for debugging
set -e  # Exit immediately if any command fails

echo "User data script started"

# Ensure networking is available before installation
sleep 20

# Update package repository
sudo dnf update -y

# Install required dependencies
sudo dnf install -y tar unzip ca-certificates curl git

# Install Docker
sudo dnf install -y docker
sudo systemctl enable --now docker  # Enables and starts Docker
sudo usermod -aG docker ec2-user  # Add ec2-user to Docker group

# Install kubectl (Amazon Linux 2023)
curl -LO "https://dl.k8s.io/release/$(curl -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/kubectl

# Install Kind
curl -Lo kind https://kind.sigs.k8s.io/dl/latest/kind-linux-amd64
chmod +x kind
sudo mv kind /usr/local/bin/kind

# Restart Docker (ensure it's running)
sudo systemctl restart docker

# Create a Kind cluster
kind create cluster --name my-cluster

# Output installed versions
docker --version
kubectl version --client
kind version

echo "User data script completed"