from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404

from ..models import Article
from ..serializers import ArticleSerializer
from rest_framework import permissions


class ArticleUploadView(APIView):
    """
    Эндпойнт для загрузки новой статьи.
    """
    permission_classes = []

    @swagger_auto_schema(
        operation_description="Загрузка новой статьи.",
        request_body=ArticleSerializer, # Будет отображать все поля из сериализатора
        responses={
            201: openapi.Response(
                description="Статья успешно создана.",
                schema=ArticleSerializer,
            ),
            400: "Ошибка в данных запроса.",
        },
        tags=["Статьи"],
    )
    def post(self, request, *args, **kwargs):
        serializer = ArticleSerializer(data=request.data)
        if serializer.is_valid():
            article = serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ArticleDetailView(APIView):
    """
    Эндпойнт для получения статьи по ID.
    """
    permission_classes = []

    @swagger_auto_schema(
        operation_description="Получение статьи по её ID.",
        responses={
            200: openapi.Response(
                description="Успешный ответ с данными статьи.",
                schema=ArticleSerializer, # Будет отображать все поля
            ),
            404: "Статья с указанным ID не найдена.",
        },
        tags=["Статьи"],
    )
    def get(self, request, article_id, *args, **kwargs):
        article = get_object_or_404(Article, id=article_id)
        serializer = ArticleSerializer(article)
        return Response(serializer.data)