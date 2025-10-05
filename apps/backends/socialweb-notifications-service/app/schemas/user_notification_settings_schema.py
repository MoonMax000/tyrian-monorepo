from typing import Optional
from pydantic import BaseModel


class UserNotificationSettingsBase(BaseModel):
    '''Базовая схема настроек уведомлений пользователя.'''
    user_id: int
    email_enabled: bool = True
    telegram_enabled: bool = True
    console_enabled: bool = True

    class Config:
        orm_mode = True


class UserNotificationSettingsCreate(UserNotificationSettingsBase):
    '''Схема для создания настроек уведомлений пользователя.'''
    pass


class UserNotificationSettingsUpdate(UserNotificationSettingsBase):
    '''Схема для обновления настроек уведомлений пользователя.'''
    user_id: Optional[int] = None
    email_enabled: Optional[bool] = None
    telegram_enabled: Optional[bool] = None
    console_enabled: Optional[bool] = None


class UserNotificationSettingsResponse(BaseModel):
    '''Схема ответа для настроек уведомлений пользователя.'''
    user_id: int
    email_enabled: bool
    telegram_enabled: bool
    console_enabled: bool

    class Config:
        orm_mode = True
