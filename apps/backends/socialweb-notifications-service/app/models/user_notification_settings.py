from sqlalchemy import (
    Boolean,
    Column,
    Integer,
)
from sqlalchemy.orm import relationship

from app.base import Base
from app.config import settings


class UserNotificationSettings(Base):
    '''Настройки способов получения уведомлений для пользователя.'''
    __tablename__ = 'user_notification_settings'

    user_id = Column(
        Integer,
        primary_key=True,
        comment='Пользователь',
    )
    email_enabled = Column(
        Boolean,
        default=True,
        comment='Флаг отправки уведомлений на email',
    )
    telegram_enabled = Column(
        Boolean,
        default=True,
        comment='Флаг отправки уведомлений в Telegram',
    )
    console_enabled = Column(
        Boolean,
        default=False,
        comment='Флаг логирования уведомлений в консоль',
    )

    notification_type_settings = relationship(
        "UserNotificationTypeSettings",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    def __str__(self):
        enabled_methods = []
        if self.email_enabled:
            enabled_methods.append("Email")
        if self.telegram_enabled:
            enabled_methods.append("Telegram")
        if self.console_enabled:
            enabled_methods.append("Console")

        return (
            f"<UserNotificationSettings user_id={self.user_id} "
            f"methods={', '.join(enabled_methods) or 'None'}>"
        )
