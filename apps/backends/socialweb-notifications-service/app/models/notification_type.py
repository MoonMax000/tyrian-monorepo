from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    String,
)
from sqlalchemy.orm import relationship

from app.base import Base


class NotificationType(Base):
    '''Типы уведомлений.'''
    __tablename__ = 'notification_type'

    id = Column(
        Integer,
        primary_key=True,
        comment='Идентификатор типа уведомления',
    )
    code = Column(
        String,
        unique=True,
        nullable=False,
        comment='Код типа уведомления',
    )
    name = Column(
        String,
        nullable=False,
        comment='Название типа уведомления',
    )
    default_text = Column(
        String,
        nullable=False,
        comment='Шаблон текста уведомления по умолчанию',
    )
    is_active = Column(
        Boolean,
        default=True,
        comment='Флаг активности уведомления',
    )

    user_settings = relationship("UserNotificationTypeSettings", back_populates="notification_type")
    notifications = relationship("Notification", back_populates="notification_type")

    def __str__(self):
        return f"<NotificationType {self.name} ({'Active' if self.is_active else 'Inactive'})>"
