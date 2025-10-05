from rest_framework import serializers


class BulkSessionDeleteSerializer(serializers.Serializer):
    """Сериализатор для пакетного удаления сессий"""
    session_ids = serializers.ListField(
        child=serializers.IntegerField(
            help_text="ID сессии для удаления"
        ),
        required=False,
        allow_empty=True,
        help_text="Список ID сессий для удаления. Если пустой список [] или поле отсутствует - удаляются все активные сессии пользователя"
    )
