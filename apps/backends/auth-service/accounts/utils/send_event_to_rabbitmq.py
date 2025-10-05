import json
import logging
from typing import Any

import pika
from django.conf import settings
from django.contrib.auth import get_user_model

User = get_user_model()
logger = logging.getLogger(__name__)

def send_event_to_rabbitmq(event_type: str,data: dict[str, Any] | list[dict[str, Any]]) -> bool:
    """
    Отправляет данные события в очередь RabbitMQ.

    Args:
        event_type: Название события
        data: Словарь с данными события

    Returns:
        bool: True если отправка успешна, False в противном случае
    """
    try:
        # Получаем параметры подключения из переменных окружения
        rabbitmq_url = settings.RABBITMQ_URL
        queue_name = settings.OUTGOING_QUEUE_NAME

        if not rabbitmq_url:
            logger.error("RABBITMQ_URL environment variable is not set")
            return False

        if not queue_name:
            logger.error("OUTGOING_QUEUE_NAME environment variable is not set")
            return False

        logger.info(f"Connecting to RabbitMQ at {rabbitmq_url}")
        logger.info(f"Target queue: {queue_name}")

        # Подключаемся к RabbitMQ
        connection = pika.BlockingConnection(pika.URLParameters(rabbitmq_url))
        channel = connection.channel()

        # Объявляем очередь (создаем если не существует)
        channel.queue_declare(queue=queue_name, durable=True)
        logger.info(f"Declared queue: {queue_name}")

        # Формируем JSON сообщение
        message = {
            "type": event_type,
            "data": data
        }

        json_message = json.dumps(message, ensure_ascii=False)
        logger.info(f"Prepared message for RabbitMQ: {json_message}")

        # Отправляем сообщение
        channel.basic_publish(
            exchange='',
            routing_key=queue_name,
            body=json_message,
            properties=pika.BasicProperties(
                delivery_mode=2,  # Делаем сообщение персистентным
            )
        )

        logger.info(f"Message sent to queue {queue_name} successfully")

        # Закрываем соединение
        connection.close()
        logger.info("RabbitMQ connection closed")

        return True

    except pika.exceptions.AMQPConnectionError as e:
        logger.error(f"Failed to connect to RabbitMQ: {str(e)}")
        return False
    except pika.exceptions.AMQPChannelError as e:
        logger.error(f"RabbitMQ channel error: {str(e)}")
        return False
    except (TypeError, ValueError) as e:
        logger.error(f"Failed to encode user data to JSON: {str(e)}")
        return False
    except Exception as e:
        logger.error(f"Unexpected error while sending to RabbitMQ: {str(e)}")
        return False


