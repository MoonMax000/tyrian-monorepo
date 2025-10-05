from sqlalchemy import (
    Boolean,
    Column,
    DateTime,
    Integer,
    ForeignKey,
    JSON,
    func,
)
from sqlalchemy.orm import relationship
from app.base import Base


class Notification(Base):
    '''Модель хранения отправленных уведомлений.'''
    __tablename__ = "notification"

    id = Column(
        Integer,
        primary_key=True,
        comment='Идентификатор уведомления',
    )
    user_id = Column(
        Integer,
        nullable=False,
        index=True,
        comment='Пользователь',
    )
    notification_type_id = Column(
        Integer,
        ForeignKey('notification_type.id'),
        nullable=False,
        comment='Тип уведомления',
    )
    data = Column(
        JSON,
        nullable=True,
        comment='Дополнительные данные для рендеринга сообщения',
    )
    is_read = Column(
        Boolean,
        default=False,
        comment='Флаг прочтения уведомления',
    )
    read_at = Column(
        DateTime(timezone=True),
        nullable=True,
        comment="Дата и время прочтения уведомления"
    )
    created_at = Column(
        DateTime(timezone=True),
        default=func.now(),
        nullable=False,
        comment="Дата и время создания уведомления"
    )

    notification_type = relationship("NotificationType", back_populates="notifications")

    def __str__(self):
        return (
            f"<Notification id={self.id} user_id={self.user_id} "
            f"type={self.notification_type_id} read={self.is_read}>"
        )
