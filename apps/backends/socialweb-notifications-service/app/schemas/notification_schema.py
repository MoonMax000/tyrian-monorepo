from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class NotificationBase(BaseModel):
    '''Базовая схема уведомления.'''
    user_id: int
    notification_type_id: int
    data: Optional[dict] = None
    is_read: bool = False
    read_at: Optional[datetime] = None

    class Config:
        orm_mode = True


class NotificationCreate(NotificationBase):
    '''Схема для создания уведомления.'''
    pass


class NotificationUpdate(NotificationBase):
    '''Схема для обновления уведомления.'''
    user_id: Optional[int] = None
    notification_type_id: Optional[int] = None
    data: Optional[dict] = None
    is_read: Optional[bool] = None


class NotificationResponse(BaseModel):
    '''Схема ответа для уведомлений, включающая отрендеренное сообщение.'''
    id: int
    user_id: int
    notification_type_code: str
    notification_type_name: str
    notification_text: str
    is_read: bool
    read_at: Optional[datetime]
    created_at: datetime

    class Config:
        orm_mode = True
