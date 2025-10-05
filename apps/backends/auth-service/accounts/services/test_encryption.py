import os
import pytest
from .send_request_to_create_user import encrypt_passphrase, decrypt_passphrase, generate_authorization_header


class TestEncryption:
    """Тесты для функций шифрования"""
    
    def test_encrypt_decrypt_passphrase(self):
        """Тест шифрования и дешифрования парольной фразы"""
        passphrase = "test_passphrase_123"
        secret_key = "test_secret_key_456"
        
        # Шифруем
        encrypted = encrypt_passphrase(passphrase, secret_key)
        assert encrypted != ""
        assert encrypted != passphrase
        
        # Расшифровываем
        decrypted = decrypt_passphrase(encrypted, secret_key)
        assert decrypted == passphrase
    
    def test_encrypt_decrypt_with_special_chars(self):
        """Тест шифрования с специальными символами"""
        passphrase = "test@#$%^&*()_+-=[]{}|;':\",./<>?"
        secret_key = "secret@#$%^&*()_+-=[]{}|;':\",./<>?"
        
        encrypted = encrypt_passphrase(passphrase, secret_key)
        decrypted = decrypt_passphrase(encrypted, secret_key)
        
        assert decrypted == passphrase
    
    def test_encrypt_decrypt_unicode(self):
        """Тест шифрования с Unicode символами"""
        passphrase = "тестовая_фраза_с_русскими_символами"
        secret_key = "секретный_ключ_с_русскими_символами"
        
        encrypted = encrypt_passphrase(passphrase, secret_key)
        decrypted = decrypt_passphrase(encrypted, secret_key)
        
        assert decrypted == passphrase
    
    def test_generate_authorization_header_with_env_vars(self):
        """Тест генерации заголовка Authorization с переменными окружения"""
        # Устанавливаем переменные окружения для теста
        os.environ['AXA_SERVICES_PASSPHRASE'] = 'test_passphrase'
        os.environ['AXA_SERVICES_SECRET_KEY'] = 'test_secret_key'
        
        auth_header = generate_authorization_header()
        
        assert auth_header.startswith("Bearer ")
        assert len(auth_header) > len("Bearer ")
        
        # Очищаем переменные окружения
        del os.environ['AXA_SERVICES_PASSPHRASE']
        del os.environ['AXA_SERVICES_SECRET_KEY']
    
    def test_generate_authorization_header_without_env_vars(self):
        """Тест генерации заголовка Authorization без переменных окружения"""
        # Убеждаемся что переменные не установлены
        if 'AXA_SERVICES_PASSPHRASE' in os.environ:
            del os.environ['AXA_SERVICES_PASSPHRASE']
        if 'AXA_SERVICES_SECRET_KEY' in os.environ:
            del os.environ['AXA_SERVICES_SECRET_KEY']
        
        auth_header = generate_authorization_header()
        
        assert auth_header == ""
