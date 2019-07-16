sleep 5

echo "should serve application..."
if curl docker_dind:8080 | grep -i "nodehaven"; then
  printf "\n- application loaded successfully\n"
  exit 0
else
  printf "\n- application failed to load\n"
  exit 1
fi
