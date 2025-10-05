from typing import Optional
from pydantic import BaseModel


class UserNotificationTypeSettingsBase(BaseModel):
    '''Базовая схема настроек типов уведомлений пользователя.'''
    user_id: int
    notification_type_id: int
    enabled: bool = True

    class Config:
        orm_mode = True


class UserNotificationTypeSettingsCreate(UserNotificationTypeSettingsBase):
    '''Схема для создания настроек типа уведомлений пользователя.'''
    pass


class UserNotificationTypeSettingsUpdate(UserNotificationTypeSettingsBase):
    '''Схема для обновления настроек типа уведомлений пользователя.'''
    user_id: Optional[int] = None
    notification_type_id: Optional[int] = None
    enabled: Optional[bool] = None


class UserNotificationTypeSettingsResponse(BaseModel):
    '''Схема ответа для настроек типа уведомлений пользователя.'''
    user_id: int
    notification_type_id: int
    notification_type_code: str
    enabled: bool

    class Config:
        orm_mode = True
