import os
import requests # type: ignore
import logging
import secrets
import string
import base64
from cryptography.fernet import Fernet
from celery import shared_task # type: ignore
from accounts.models import User


logger = logging.getLogger(__name__)


def generate_password(length=12):
    """Генерирует случайный пароль"""
    alphabet = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(secrets.choice(alphabet) for _ in range(length))


def encrypt_passphrase(passphrase: str, secret_key: str) -> str:
    """Шифрует парольную фразу с помощью секретного ключа"""
    try:
        # Создаем ключ из секретного ключа (дополняем до 32 байт)
        key_bytes = secret_key.encode()
        if len(key_bytes) < 32:
            key_bytes = key_bytes + b'\0' * (32 - len(key_bytes))
        elif len(key_bytes) > 32:
            key_bytes = key_bytes[:32]
        
        key = base64.urlsafe_b64encode(key_bytes)
        
        # Создаем Fernet для шифрования
        fernet = Fernet(key)
        
        # Шифруем парольную фразу
        encrypted_data = fernet.encrypt(passphrase.encode())
        
        return base64.urlsafe_b64encode(encrypted_data).decode()
    except Exception as e:
        logger.error(f"Error encrypting passphrase: {e}")
        return ""


def decrypt_passphrase(encrypted_passphrase: str, secret_key: str) -> str:
    """Расшифровывает парольную фразу с помощью секретного ключа"""
    try:
        # Создаем ключ из секретного ключа (дополняем до 32 байт)
        key_bytes = secret_key.encode()
        if len(key_bytes) < 32:
            key_bytes = key_bytes + b'\0' * (32 - len(key_bytes))
        elif len(key_bytes) > 32:
            key_bytes = key_bytes[:32]
        
        key = base64.urlsafe_b64encode(key_bytes)
        
        # Создаем Fernet для дешифрования
        fernet = Fernet(key)
        
        # Декодируем и расшифровываем
        encrypted_data = base64.urlsafe_b64decode(encrypted_passphrase.encode())
        decrypted_data = fernet.decrypt(encrypted_data)
        
        return decrypted_data.decode()
    except Exception as e:
        logger.error(f"Error decrypting passphrase: {e}")
        return ""


def generate_authorization_header() -> str:
    """Генерирует заголовок Authorization с зашифрованной парольной фразой"""
    passphrase = os.getenv('AXA_SERVICES_PASSPHRASE')
    secret_key = os.getenv('AXA_SERVICES_SECRET_KEY')
    
    if not passphrase or not secret_key:
        logger.warning("AXA_SERVICES_PASSPHRASE or AXA_SERVICES_SECRET_KEY not set")
        return ""
    
    encrypted_passphrase = encrypt_passphrase(passphrase, secret_key)
    
    # Тестируем расшифровку
    decrypted_passphrase = decrypt_passphrase(encrypted_passphrase, secret_key)
    logger.info(f"Authorization header test - Original: {passphrase}, Decrypted: {decrypted_passphrase}")
    
    return f"Bearer {encrypted_passphrase}"


@shared_task
def send_request_to_create_user_in_services(user_id):
    """Отправляет запросы на создание пользователя во внешних сервисах"""
    
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        logger.error(f"User with id {user_id} does not exist")
        return
    
    endpoints = os.getenv('USER_CREATION_ENDPOINTS', '').split(',')
    
    if not endpoints or endpoints == ['']:
        logger.info(f"No user creation endpoints configured for user {user.email}")
        return
    
    # Генерируем пароль для внешних сервисов
    password = generate_password()
    
    payload = {
        "email": user.email,
        "password": password
    }
    
    # Генерируем заголовок Authorization
    auth_header = generate_authorization_header()
    
    headers = {
        'Content-Type': 'application/json'
    }
    
    if auth_header:
        headers['Authorization'] = auth_header
    
    logger.info(f"Sending user creation requests to {len(endpoints)} endpoints for user {user.email}")
    
    for endpoint in endpoints:
        endpoint = endpoint.strip()
        if not endpoint:
            continue
            
        try:
            logger.info(f"Sending POST request to {endpoint}")
            response = requests.post(
                endpoint,
                json=payload,
                headers=headers
            )
            
            if response.status_code in [200, 201]:
                logger.info(f"Successfully created user in service {endpoint}")
            else:
                logger.error(f"Failed to create user in service {endpoint}. Status: {response.status_code}, Response: {response.text}")
                
        except requests.exceptions.RequestException as e:
            logger.error(f"Error sending request to {endpoint}: {str(e)}")
        except Exception as e:
            logger.error(f"Unexpected error sending request to {endpoint}: {str(e)}")
    
    logger.info(f"Completed user creation requests for user {user.email}")
