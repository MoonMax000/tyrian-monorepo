from sqlalchemy import (
    Boolean,
    Column,
    Integer,
    ForeignKey,
)
from sqlalchemy.orm import relationship

from app.base import Base


class UserNotificationTypeSettings(Base):
    '''Настройки типов уведомлений для пользователя.'''
    __tablename__ = 'user_notification_type_settings'

    user_id = Column(
        Integer,
        ForeignKey('user_notification_settings.user_id', ondelete='CASCADE'),
        primary_key=True,
        comment='Пользователь',
    )
    notification_type_id = Column(
        Integer,
        ForeignKey('notification_type.id', ondelete='CASCADE'),
        primary_key=True,
        comment='Тип уведомления',
    )
    enabled = Column(
        Boolean,
        default=True,
        comment="Флаг включения уведомлений данного типа для пользователя",
    )

    user = relationship("UserNotificationSettings", back_populates="notification_type_settings")
    notification_type = relationship("NotificationType", back_populates="user_settings")

    def __str__(self):
        return (
            f"<UserNotificationTypeSettings user_id={self.user_id} type={self.notification_type_id}"
            f" {'Enabled' if self.enabled else 'Disabled'}>"
        )
