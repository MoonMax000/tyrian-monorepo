import json
import redis
import os
import logging
from django.contrib.sessions.backends.base import SessionBase, UpdateError # type: ignore
from django.db import connection # type: ignore

logger = logging.getLogger(__name__)


class JsonSessionStore(SessionBase):
    """Кастомный SessionStore, который сохраняет данные в JSON формате"""
    
    def __init__(self, session_key=None):
        super().__init__(session_key)
        self.redis_client = redis.Redis(
            host=os.getenv('REDIS_HOST', 'global-redis'),
            port=int(os.getenv('REDIS_PORT', 6379)),
            db=0,
            decode_responses=True
        )
    
    def load(self):
        """Загружаем сессию из Redis"""
        if self.session_key is None:
            return {}
        
        cache_key = f":1:django.contrib.sessions.cache{self.session_key}"
        logger.debug(f"Loading session from Redis: {cache_key}")
        
        try:
            data = self.redis_client.get(cache_key)
            
            if data is None:
                logger.debug(f"Session not found in Redis: {cache_key}")
                return {}
            
            # Пробуем декодировать как JSON
            result = json.loads(data)
            logger.debug(f"Successfully loaded session: {cache_key}")
            return result
        except (ValueError, json.JSONDecodeError) as e:
            logger.error(f"Error decoding JSON session: {e}")
            return {}
        except Exception as e:
            logger.error(f"Unexpected error loading session: {e}")
            return {}
    
    def exists(self, session_key):
        """Проверяем существование сессии"""
        cache_key = f":1:django.contrib.sessions.cache{session_key}"
        exists = self.redis_client.exists(cache_key) > 0
        logger.debug(f"Session exists check: {cache_key} -> {exists}")
        return exists
    
    def create(self):
        """Создаём новую сессию"""
        logger.debug("Creating new session")
        
        try:
            while True:
                new_key = self._get_new_session_key()
                if not self.exists(new_key):
                    break
            
            self._set_session_key(new_key)
            logger.debug(f"Generated new session key: {new_key}")
            self.save(must_create=True)
            self.modified = True
        except Exception as e:
            logger.error(f"Error creating session: {e}")
            raise
    
    def save(self, must_create=False):
        """Сохраняем сессию в Redis"""
        if self.session_key is None and self.modified:
            logger.debug("Session modified, creating new key")
            return self.create()

        # Session not modified and deleted in case by direct redis request
        if self.session_key is None:
            raise UpdateError("Empty session key, perhaps session is deleted?")
        
        cache_key = f":1:django.contrib.sessions.cache{self.session_key}"
        session_data = self._get_session(no_load=must_create)
        
        logger.debug(f"Saving session to Redis: {cache_key}")
        
        try:
            # Сохраняем как JSON
            json_data = json.dumps(session_data, ensure_ascii=False)
            
            expiry_age = self.get_expiry_age()
            result = self.redis_client.setex(cache_key, expiry_age, json_data)
            
            if result:
                logger.debug(f"Session successfully saved: {cache_key}")
            else:
                logger.error(f"Failed to save session: {cache_key}")
        except Exception as e:
            logger.error(f"Error saving session: {e}")
            raise
    
    def delete(self, session_key=None):
        """Удаляем сессию"""
        logger.debug(f"Deleting session: {session_key}, self.session_key: {self.session_key}")

        if session_key is None and self.session_key is None:
            return
        
        if session_key is None:
            cache_key = f":1:django.contrib.sessions.cache{self.session_key}"
        else:
            cache_key = f":1:django.contrib.sessions.cache{session_key}"

        logger.debug(f"Deleting session from Redis: {cache_key}")
        try:
            # Проверяем существование перед удалением
            exists_before = self.redis_client.exists(cache_key)
            logger.debug(f"Session exists before deletion: {exists_before}")
            
            result = self.redis_client.delete(cache_key)
            logger.debug(f"Delete result: {result} (1 = deleted, 0 = not found)")
            
            # Проверяем существование после удаления
            exists_after = self.redis_client.exists(cache_key)
            logger.debug(f"Session exists after deletion: {exists_after}")
            
            if result > 0:
                logger.debug(f"Session successfully deleted: {cache_key}")
                if session_key is None:
                    self._delete_login_session_without_signal(self.session_key)
                else:
                    self._delete_login_session_without_signal(session_key)
            else:
                logger.debug(f"Session not found for deletion: {cache_key}")
        except Exception as e:
            logger.error(f"Error deleting session: {e}")
            raise
    
    def cycle_key(self):
        """Обновляем ключ сессии"""
        logger.debug(f"Cycling session key, session is modified? {self.modified}")
        
        try:
            data = self._get_session()
            old_session_key = self.session_key
            
            # Создаём новый ключ
            while True:
                new_key = self._get_new_session_key()
                if not self.exists(new_key):
                    break
            
            # Устанавливаем новый ключ
            self._set_session_key(new_key)
            logger.debug(f"Session key cycled: {old_session_key} -> {new_key}")
            
            # Сохраняем данные под новым ключом
            cache_key = f":1:django.contrib.sessions.cache{self.session_key}"
            json_data = json.dumps(data, ensure_ascii=False)
            
            expiry_age = self.get_expiry_age()
            result = self.redis_client.setex(cache_key, expiry_age, json_data)
            logger.debug(f"Cycle save result: {result}")
            
            # Удаляем старую сессию
            if old_session_key:
                old_cache_key = f":1:django.contrib.sessions.cache{old_session_key}"
                delete_result = self.redis_client.delete(old_cache_key)
                logger.debug(f"Deleted old session: {old_cache_key} (result: {delete_result})")
                self._delete_login_session_without_signal(old_session_key)

            self.modified = True
        except Exception as e:
            logger.error(f"Error cycling session key: {e}")
            raise
    
    def _delete_login_session_without_signal(self, session_id: str):
        with connection.cursor() as cursor:
            deleted_count = cursor.execute(f"DELETE FROM accounts_loginsession WHERE session_id='{session_id}'")
            logger.debug(f"Delete Login Session by session_id: {session_id}, deleted_count is {deleted_count}")

