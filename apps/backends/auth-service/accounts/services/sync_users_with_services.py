import os
import requests # type: ignore
import logging
from celery import shared_task # type: ignore
from accounts.models import User
from .send_request_to_create_user import generate_password, generate_authorization_header


logger = logging.getLogger(__name__)


@shared_task
def sync_users_with_services():
    """
    Задача для синхронизации всех активных пользователей с микросервисами.
    Запускается каждую минуту и отправляет запросы на создание пользователей
    во все настроенные микросервисы.
    """
    try:
        # Получаем всех активных пользователей
        active_users = User.objects.filter(is_active=True)
        total_users = active_users.count()
        
        if total_users == 0:
            logger.info("No active users found for synchronization")
            return
        
        logger.info(f"Starting synchronization for {total_users} active users")
        
        # Получаем эндпойнты для создания пользователей
        endpoints = os.getenv('USER_CREATION_ENDPOINTS', '').split(',')
        
        if not endpoints or endpoints == ['']:
            logger.warning("No user creation endpoints configured")
            return
        
        # Фильтруем пустые эндпойнты
        endpoints = [endpoint.strip() for endpoint in endpoints if endpoint.strip()]
        
        if not endpoints:
            logger.warning("No valid user creation endpoints found")
            return
        
        logger.info(f"Will sync users to {len(endpoints)} services: {endpoints}")
        
        # Статистика
        total_requests = 0
        successful_creations = 0  # 201 статус
        already_exist = 0  # 400 статус
        other_responses = 0
        errors = 0
        
        # Генерируем заголовок Authorization
        auth_header = generate_authorization_header()
        
        headers = {
            'Content-Type': 'application/json'
        }
        
        if auth_header:
            headers['Authorization'] = auth_header
        
        # Обрабатываем каждого пользователя
        for user in active_users:
            logger.info(f"Processing user: {user.email} (ID: {user.id})")
            
            # Генерируем пароль для внешних сервисов
            password = generate_password()
            
            payload = {
                "email": user.email,
                "password": password
            }
            
            # Отправляем запросы во все микросервисы
            for endpoint in endpoints:
                total_requests += 1
                
                try:
                    logger.info(f"Sending POST request to {endpoint} for user {user.email}")
                    response = requests.post(
                        endpoint,
                        json=payload,
                        headers=headers,
                        timeout=30  # Таймаут 30 секунд
                    )
                    
                    if response.status_code == 201:
                        logger.info(f"Successfully created user {user.email} in service {endpoint}")
                        successful_creations += 1
                    elif response.status_code == 400:
                        logger.info(f"User {user.email} already exists in service {endpoint}")
                        already_exist += 1
                    else:
                        logger.warning(f"Unexpected response for user {user.email} from {endpoint}. Status: {response.status_code}, Response: {response.text}")
                        other_responses += 1
                        
                except requests.exceptions.Timeout:
                    logger.error(f"Timeout error sending request to {endpoint} for user {user.email}")
                    errors += 1
                except requests.exceptions.RequestException as e:
                    logger.error(f"Request error sending to {endpoint} for user {user.email}: {str(e)}")
                    errors += 1
                except Exception as e:
                    logger.error(f"Unexpected error sending request to {endpoint} for user {user.email}: {str(e)}")
                    errors += 1
        
        # Выводим итоговую статистику
        logger.info(f"=== SYNCHRONIZATION SUMMARY ===")
        logger.info(f"Total users processed: {total_users}")
        logger.info(f"Total requests sent: {total_requests}")
        logger.info(f"Successful creations (201): {successful_creations}")
        logger.info(f"Already exist (400): {already_exist}")
        logger.info(f"Other responses: {other_responses}")
        logger.info(f"Errors: {errors}")
        logger.info(f"Users created in at least one service: {successful_creations}")
        logger.info(f"=== END SYNCHRONIZATION ===")
        
    except Exception as exc:
        logger.error(f"Error during user synchronization: {exc}")
        # Не поднимаем исключение, чтобы задача не падала
        # и продолжала выполняться по расписанию 