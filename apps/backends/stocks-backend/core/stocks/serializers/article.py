from rest_framework import serializers

from ..models import Article


class ArticleSerializer(serializers.ModelSerializer):
    """
    Сериализатор для модели Article.
    """
    class Meta:
        model = Article
        fields = ['id', 'title', 'description', 'content'] # Обновлен список полей
