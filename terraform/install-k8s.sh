#!/bin/bash
set -e

# Update and install required packages
sudo apt update -y
sudo apt install -y curl apt-transport-https ca-certificates software-properties-common

# Install Docker
sudo apt install -y docker.io
sudo systemctl enable docker
sudo systemctl start docker

# Install k3s (Lightweight Kubernetes)
curl -sfL https://get.k3s.io | sh -

# Add user to Docker group (Optional)
sudo usermod -aG docker ubuntu

# Output versions
docker --version
k3s --version
