import json
import os
import redis
import logging
from django.contrib.auth import get_user_model
from django.contrib.auth.backends import BaseBackend, ModelBackend
from django.contrib.sessions.backends.base import SessionBase
from rest_framework.authentication import SessionAuthentication

logger = logging.getLogger(__name__)
UserModel = get_user_model()


class NoAuthentication(SessionAuthentication):
    """
    Класс аутентификации, который всегда возвращает None.
    Используется для исключения аутентификации в определенных представлениях.
    """
    def authenticate(self, request):
        return None


class EmailSessionAuthentication(SessionAuthentication):
    def authenticate(self, request):
        """
        Returns a `User` if the request session currently has a logged in user.
        Otherwise returns `None`.
        """
        user = None
        session_key = request.session.session_key
        if session_key:
            email = request.session.get("user_email")
            user = UserModel.objects.filter(email=email).first()
        # Unauthenticated, CSRF validation not required
        if not user or not user.is_active:
            return None

        self.enforce_csrf(request)

        # CSRF passed with authenticated user
        return (user, None)


class JsonSessionStore(SessionBase):
    """Кастомный SessionStore, который сохраняет данные в JSON формате"""
    
    def __init__(self, session_key=None):
        super().__init__(session_key)
        self.redis_client = redis.Redis(
            host=os.getenv('GLOBAL_REDIS_HOST'),
            port=os.getenv('GLOBAL_REDIS_PORT'),
            db=os.getenv('GLOBAL_REDIS_DB'),
            decode_responses=True
        )
    
    def load(self):
        """Загружаем сессию из Redis"""
        if self.session_key is None:
            return {}
        
        cache_key = f":1:django.contrib.sessions.cache{self.session_key}"
        data = self.redis_client.get(cache_key)
        
        logger.debug(f"Loading session from Redis: {cache_key}, data: {data}")
        
        if data is None:
            return {}
        
        try:
            # Пробуем декодировать как JSON
            result = json.loads(data)
            logger.debug(f"Successfully loaded JSON session: {result}")
            return result
        except (ValueError, json.JSONDecodeError) as e:
            logger.error(f"Error decoding JSON session: {e}")
            # Если не получается, возвращаем пустой словарь
            return {}
    
    def exists(self, session_key):
        """Проверяем существование сессии"""
        cache_key = f":1:django.contrib.sessions.cache{session_key}"
        return self.redis_client.exists(cache_key) > 0
    
    def create(self):
        """Создаём новую сессию"""
        logger.info("Creating new session")
        while True:
            new_key = self._get_new_session_key()
            if not self.exists(new_key):
                break
        self._set_session_key(new_key)
        self.save(must_create=True)
        self.modified = True
    
    def save(self, must_create=False):
        """Сохраняем сессию в Redis"""
        if self.session_key is None:
            return self.create()
        
        cache_key = f":1:django.contrib.sessions.cache{self.session_key}"
        session_data = self._get_session(no_load=must_create)
        
        logger.debug(f"Saving session to Redis: {cache_key}, data: {session_data}")
        
        # Сохраняем как JSON
        json_data = json.dumps(session_data, ensure_ascii=False)
        logger.debug(f"JSON data to save: {json_data}")
        
        result = self.redis_client.setex(cache_key, self.get_expiry_age(), json_data)
        logger.debug(f"Save result: {result}")
    
    def delete(self, session_key=None):
        """Удаляем сессию"""
        if session_key is None:
            if self.session_key is None:
                return
            session_key = self.session_key
        
        cache_key = f":1:django.contrib.sessions.cache{session_key}"
        self.redis_client.delete(cache_key)
    
    def cycle_key(self):
        """Обновляем ключ сессии"""
        logger.debug("Cycling session key")
        data = self._get_session()
        old_session_key = self.session_key
        
        # Создаём новый ключ
        while True:
            new_key = self._get_new_session_key()
            if not self.exists(new_key):
                break
        
        # Устанавливаем новый ключ
        self._set_session_key(new_key)
        
        # Сохраняем данные под новым ключом
        cache_key = f":1:django.contrib.sessions.cache{self.session_key}"
        json_data = json.dumps(data, ensure_ascii=False)
        logger.debug(f"Cycling session: saving data under new key {cache_key}: {json_data}")
        
        result = self.redis_client.setex(cache_key, self.get_expiry_age(), json_data)
        logger.debug(f"Cycle save result: {result}")
        
        # Удаляем старую сессию
        if old_session_key:
            old_cache_key = f":1:django.contrib.sessions.cache{old_session_key}"
            self.redis_client.delete(old_cache_key)
            logger.debug(f"Deleted old session: {old_cache_key}")
        
        self.modified = True


# Экспортируем SessionStore для совместимости с Django
SessionStore = JsonSessionStore 