variable "aws_region" {
  description = "AWS region"
  default     = "us-east-2"
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t2.micro"
}

variable "ami_id" {
  description = "Amazon Machine Image (AMI) ID for Ubuntu"
  default     = "ami-0d0f28110d16ee7d6" # Update with your region-specific Ubuntu AMI
}

variable "key_name" {
  description = "Name of the SSH key pair"
  default     = "VM1"
}
