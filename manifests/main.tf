variable "token" {}
variable "ssh_key_id" {}
variable "username" {}
variable "password" {}
variable "image" {}
variable "registry" {}

provider "digitalocean" {
  token = "${var.token}"
}

resource "digitalocean_droplet" "haven-fe" {
  ssh_keys = ["${var.ssh_key_id}"]
  image    = "debian-9-x64"
  region   = "nyc3"
  size     = "512mb"
  name     = "haven-fe"

  provisioner "remote-exec" {
    inline = [
      "sudo apt update",
      "sudo apt install -y apt-transport-https ca-certificates curl gnupg2 software-properties-common",
      "curl -fsSL https://download.docker.com/linux/debian/gpg | sudo apt-key add -",
      "sudo add-apt-repository \"deb [arch=amd64] https://download.docker.com/linux/debian $(lsb_release -cs) stable\"",
      "sudo apt update",
      "sudo apt install -y docker-ce docker-ce-cli containerd.io",
      "docker login -u ${var.username} -p ${var.password} ${var.registry}",
      "docker pull ${var.image}",
      "docker run -d -p 80:80 ${var.image}"
    ]

    connection {
      type        = "ssh"
      host        = "${digitalocean_droplet.haven-fe.ipv4_address}"
      private_key = "${file("~/.ssh/id_rsa")}"
      user        = "root"
      timeout     = "2m"
    }
  }
}
