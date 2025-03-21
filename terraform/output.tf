output "ec2_public_ip" {
  description = "Public IP address of the Kubernetes EC2 instance"
  value       = aws_instance.project_instance.public_ip
}
