from typing import Optional
from pydantic import BaseModel


class NotificationTypeBase(BaseModel):
    '''Базовая схема типа уведомлений.'''
    code: str
    name: str
    default_text: str
    is_active: bool = True

    class Config:
        orm_mode = True


class NotificationTypeCreate(NotificationTypeBase):
    '''Схема для создания типа уведомлений.'''
    pass


class NotificationTypeUpdate(NotificationTypeBase):
    '''Схема для обновления типа уведомлений.'''
    code: Optional[str] = None
    name: Optional[str] = None
    default_text: Optional[str] = None
    is_active: Optional[bool] = None


class NotificationTypeResponse(BaseModel):
    '''Схема ответа для типа уведомлений.'''
    id: int
    code: str
    name: str
    default_text: str
    is_active: bool

    class Config:
        orm_mode = True
