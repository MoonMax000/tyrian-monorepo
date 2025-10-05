from drf_yasg.utils import swagger_auto_schema # type: ignore
from rest_framework import serializers, status # type: ignore
from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework.permissions import AllowAny # type: ignore
from djoser import signals # type: ignore
from drf_yasg import openapi # type: ignore

from .models import User
from responses import InvalidCredentialsResponse


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
            return InvalidCredentialsResponse(-1)
