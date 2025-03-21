#!/bin/bash
set -e  # Exit immediately if a command fails

# Update and install required packages (Amazon Linux uses yum/dnf, not apt)
sudo yum update -y
sudo yum install -y curl tar unzip ca-certificates

# Install Docker
sudo yum install -y docker
sudo systemctl enable docker
sudo systemctl start docker

# Install kubectl (Use Amazon Linux-compatible URL)
sudo curl -LO "https://dl.k8s.io/release/$(curl -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl

# Install kind
sudo curl -Lo kind https://kind.sigs.k8s.io/dl/latest/kind-linux-amd64
sudo chmod +x kind
sudo mv kind /usr/local/bin/kind

# Create kind cluster
sudo /usr/local/bin/kind create cluster

# Add user to Docker group (Amazon Linux uses 'ec2-user' instead of 'ubuntu')
sudo usermod -aG docker ec2-user

# Output versions
docker --version
kubectl version --client
kind version