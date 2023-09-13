# Processo para manutenção/ atualização do backend


docker build -t notificacoes-app -f Dockerfile.prod .
docker build -t eshows/notificacoes-app -f Dockerfile.prod .
docker push eshows/notificacoes-app

# Reload aplicação

kubectl rollout restart deployment notificacoes-app