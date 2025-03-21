variable "aws_region" {
  description = "AWS region"
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t2.micro"
}

variable "ami_id" {
  description = "Amazon Machine Image (AMI) ID for Ubuntu"
  default     = "ami-0c55b159cbfafe1f0" # Update with your region-specific Ubuntu AMI
}

variable "key_name" {
  description = "Name of the SSH key pair"
  default     = "my-aws-key"
}
