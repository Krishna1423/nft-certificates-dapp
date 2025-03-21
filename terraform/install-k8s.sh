#!/bin/bash
set -e  # Exit immediately if a command fails

# Update package repository
sudo dnf update -y

# Install required utilities
sudo dnf install -y tar unzip ca-certificates curl git

# Install Docker
sudo dnf install -y docker
sudo systemctl enable --now docker  # Enables and starts Docker
sudo usermod -aG docker ec2-user    # Add ec2-user to Docker group to allow running Docker without sudo

# Install kubectl (Amazon Linux 2023)
curl -LO "https://dl.k8s.io/release/$(curl -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
chmod +x kubectl
sudo mv kubectl /usr/local/bin/kubectl

# Install Kind
curl -Lo kind https://kind.sigs.k8s.io/dl/latest/kind-linux-amd64
chmod +x kind
sudo mv kind /usr/local/bin/kind

# Ensure Docker service is running (needed for Kind)
sudo systemctl restart docker

# Create a Kind cluster
kind create cluster

# Output installed versions
docker --version
kubectl version --client
kind version