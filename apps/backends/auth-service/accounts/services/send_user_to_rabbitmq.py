import logging
from typing import Any

from celery import shared_task
from django.contrib.auth import get_user_model
from django.core.paginator import Paginator

from accounts.utils.send_event_to_rabbitmq import send_event_to_rabbitmq

User = get_user_model()
logger = logging.getLogger(__name__)


@shared_task
def send_user_to_rabbitmq(user_id: int) -> bool:
    """
    Отправляет данные пользователя в очередь RabbitMQ.
    
    Args:
        user_id: ID пользователя для отправки
        
    Returns:
        bool: True если отправка успешна, False в противном случае
    """
    try:
        logger.info(f"Starting to send user {user_id} to RabbitMQ")

        # Получаем пользователя из базы данных
        try:
            user = User.objects.get(id=user_id)
            logger.info(f"Retrieved user {user_id} from database: {user.email}")
        except User.DoesNotExist:
            logger.error(f"User with ID {user_id} not found in database")
            return False

        # Собираем данные пользователя в JSON
        user_data = _collect_user_data(user)
        logger.info(f"Collected user data for {user.email}: {user_data}")
        
        # Отправляем в RabbitMQ
        success = send_event_to_rabbitmq(event_type="user", data=user_data)
        
        if success:
            logger.info(f"Successfully sent user {user_id} ({user.email}) to RabbitMQ")
        else:
            logger.error(f"Failed to send user {user_id} ({user.email}) to RabbitMQ")
            
        return success
        
    except Exception as e:
        logger.error(f"Unexpected error while sending user {user_id} to RabbitMQ: {str(e)}")
        return False


@shared_task
def send_all_users_to_rabbitmq() -> bool:
    """
    Отправляет данные всех пользователей в очередь RabbitMQ пачками по 1000 записей

    Returns:
        bool: True если отправка всех пачек успешна, False если хотя бы одна пачка не отправилась
    """
    try:
        logger.info("Starting to send all users to RabbitMQ with pagination (1000 per batch)")

        # Получаем всех пользователей
        users = User.objects.all()
        total_users = users.count()
        logger.info(f"Retrieved {total_users} users from database")

        if total_users == 0:
            logger.warning("No users found. Nothing to send.")
            return False

        # Создаем пагинатор, разбивая queryset на страницы по 1000 записей
        paginator = Paginator(users, 1000)  # 1000 записей на страницу
        all_batches_success = True  # Флаг для отслеживания общей успешности

        # Проходим по каждой странице (пачке)
        for page_number in paginator.page_range:
            try:
                page = paginator.page(page_number)
                logger.info(f"Processing batch {page_number} of {paginator.num_pages} (users {page.start_index()}-{page.end_index()})")

                # Собираем данные для текущей пачки
                batch_data = []
                for user in page.object_list:
                    try:
                        user_data = _collect_user_data(user)
                        batch_data.append(user_data)
                        logger.debug(f"Collected data for user {user.email} in batch {page_number}")
                    except Exception as e:
                        logger.error(f"Error collecting data for user {user.id} ({user.email}) in batch {page_number}: {str(e)}")
                        # Пропускаем проблемного пользователя, но продолжаем сбор для остальных в пачке
                        continue

                if not batch_data:
                    logger.warning(f"Batch {page_number} is empty after data collection. Skipping.")
                    continue

                success = send_event_to_rabbitmq(event_type="users", data=batch_data)

                if success:
                    logger.info(f"Successfully sent batch {page_number} ({len(batch_data)} users) to RabbitMQ")
                else:
                    logger.error(f"Failed to send batch {page_number} to RabbitMQ")
                    all_batches_success = False

            except Exception as e:
                logger.error(f"Unexpected error while processing batch {page_number}: {str(e)}")
                all_batches_success = False

        if all_batches_success:
            logger.info(f"Successfully sent ALL {total_users} users to RabbitMQ in {paginator.num_pages} batches")
        else:
            logger.warning("Finished sending users, but some batches failed")

        return all_batches_success

    except Exception as e:
        logger.error(f"Unexpected error while sending ALL users to RabbitMQ: {str(e)}")
        return False

def _collect_user_data(user) -> dict[str, Any]:
    """
    Собирает данные пользователя в словарь для отправки в RabbitMQ.

    Args:
        user: Объект пользователя

    Returns:
        Dict с данными пользователя
    """
    logger.debug(f"Collecting data for user {user.id} ({user.email})")

    # Основные поля пользователя
    data = {
        "TyrianID__c": str(user.id),
        "PersonEmail": user.email,
        "LastName": user.name or user.email,
        "UserName__c": user.username,
        "Website": user.website,
        "Role__c": user.role.name if user.role else None,
        "Sector__c": ",".join([sector.name for sector in user.sectors.all()]),
        "BIO__c": user.bio,
        "AvatarURL__c": str(user.avatar) if user.avatar else None,
        "Phone": user.phone,
        "LastLoginDate__c": user.last_login.strftime("%Y-%m-%d") if user.last_login else None,
        "StartDate__c": user.date_joined.strftime("%Y-%m-%d") if user.date_joined else None,
        "AccountStatus__c": "Blocked" if user.is_deleted else "Active",
    }

    logger.debug(f"Collected data for user {user.id}: {data}")
    return data

