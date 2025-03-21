#!/bin/bash
set -e

# Update and install required packages
sudo apt update -y
sudo apt install -y curl apt-transport-https ca-certificates software-properties-common

# Install Docker
sudo apt install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker

# Install kubectl
sudo curl -LO "https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl"
sudo chmod +x ./kubectl
sudo mv ./kubectl /usr/local/bin/kubectl

# Install kind
sudo curl -Lo kind https://kind.sigs.k8s.io/dl/latest/kind-linux-amd64
sudo chmod +x kind
sudo mv kind /usr/local/bin/kind

# Create kind cluster
sudo kind create cluster

# Add user to Docker group (Optional)
sudo usermod -aG docker ubuntu

# Output versions
docker --version
kubectl --version
kind version