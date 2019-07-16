variable "token" {}
variable "ssh_key_id" {}

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
    connection {
      type        = "ssh"
      host        = "${digitalocean_droplet.haven-fe.ipv4_address}"
      private_key = "${file("~/.ssh/id_rsa")}"
      user        = "root"
      timeout     = "2m"
    }
  }
}
