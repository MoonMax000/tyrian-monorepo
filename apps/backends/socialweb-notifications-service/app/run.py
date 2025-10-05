'''
Модуль для запуска FastAPI-приложения.
'''
import uvicorn
from sqladmin import Admin

from app.admin import register_library_admin
from app.database import engine_sync
from app.main import create_app


app = create_app()

admin = Admin(app, engine_sync)
register_library_admin(admin)

if __name__ == '__main__':
    uvicorn.run('app.run:app', host='127.0.0.1', port=8000, reload=True)
