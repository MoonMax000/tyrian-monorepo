import logging
from django.contrib.auth import get_user_model

from drf_yasg.utils import swagger_auto_schema
from rest_framework import serializers, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from djoser import signals

from .models import User
from .backends import NoAuthentication


class ASUserSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'}, required=True)

    class Meta:
        model = User
        fields = ['email', 'password']


class ASUserControlView(APIView):
    """
    Endpoint для создания/обновления пользователя без подтверждения email.
    """
    permission_classes = [AllowAny]
    authentication_classes = [NoAuthentication]  # Исключаем аутентификацию
    serializer_class = ASUserSerializer

    @swagger_auto_schema(
        operation_description="Создать пользователя без подтвержения email",
        request_body=ASUserSerializer,
        tags=["auth"],
    )
    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            email = serializer.validated_data['email']
            if User.objects.filter(email=email).exists():
                return Response(
                    {"error": "User already exists"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            # Создаем пользователя
            user = User.objects.create_user(
                email=email,
                password=serializer.validated_data['password']
            )

            # Отправляем сигнал
            signals.user_registered.send(
                sender=self.__class__, user=user, request=self.request
            )

            return Response(
                status=status.HTTP_201_CREATED
            )
        except Exception as e:
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @swagger_auto_schema(
        operation_description="Тестовый GET метод",
        tags=["auth"],
    )
    def get(self, request):
        return Response(
            {"message": "ASUserControlView работает без аутентификации"},
            status=status.HTTP_200_OK
        )

    @swagger_auto_schema(
        operation_description="Редактировать пользователя без подтвержения email",
        request_body=ASUserSerializer,
        tags=["auth"],
    )
    def patch(self, request):
        serializer = self.serializer_class(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            email = serializer.validated_data['email']
            user = User.objects.get(email=email)

            # Обновляем пароль
            user.set_password(serializer.validated_data['password'])
            user.save(update_fields=['password'])

            # Отправляем сигнал
            signals.user_updated.send(
                sender=self.__class__, user=user, request=self.request
            )

            return Response(
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND
            )
