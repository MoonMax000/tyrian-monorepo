from .json_session_store import JsonSessionStore

# Экспортируем SessionStore для совместимости с Django
SessionStore=JsonSessionStore

__all__ = ['JsonSessionStore', 'SessionStore']