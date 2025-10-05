Запуск:
1. Добавить в .env API_KEY
2. Запуск: sudo docker compose up --build
3. Сервис coin-market-cap запускается с помощью команды 
```
gunicorn main:app --workers 2 --worker-class uvicorn.workers.UvicornWorker --bind 0.0.0.0:8083
```
4. Сваггер http://0.0.0.0:8084/docs