from rest_framework.views import APIView # type: ignore
from rest_framework.response import Response # type: ignore
from rest_framework import serializers # type: ignore
from rest_framework.permissions import IsAuthenticated # type: ignore
from drf_spectacular.utils import extend_schema, OpenApiResponse # type: ignore

 
class RevenueSerializer(serializers.Serializer):
    revenue = serializers.FloatField()


class WithdrawsPurchasesSerializer(serializers.Serializer):
    withdraws = serializers.FloatField()
    purchases = serializers.FloatField()


class AIAssistantSerializer(serializers.Serializer):
    got = serializers.FloatField()
    out = serializers.FloatField()


@extend_schema(
    tags=['Profile'],
    summary='Получить информацию о доходах текущего пользователя',
    description='Возвращает информацию о доходах текущего пользователя.',
    responses={
        200: RevenueSerializer,
        401: OpenApiResponse(description='Пользователь не аутентифицирован')
    }
)
class MyRevenueView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        revenue = {
            'revenue': 12345.67,
        }
        serializer = RevenueSerializer(revenue)
        return Response(serializer.data)


@extend_schema(
    tags=['Profile'],
    summary='Получить информацию о списаниях и покупках текущего пользователя',
    description='Возвращает информацию о списаниях и покупках текущего пользователя.',
    responses={
        200: WithdrawsPurchasesSerializer,
        401: OpenApiResponse(description='Пользователь не аутентифицирован')
    }
)
class MyWithdrawsPurchasesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        withdraws_purchases = {
            'withdraws': 12345.67,
            'purchases': 54321.67,
        }
        serializer = WithdrawsPurchasesSerializer(withdraws_purchases)
        return Response(serializer.data)


@extend_schema(
    tags=['Profile'],
    summary='Получить информацию о работе ИИ помошника',
    description='Возвращает информацию о работе ИИ помошника.',
    responses={
        200: AIAssistantSerializer,
        401: OpenApiResponse(description='Пользователь не аутентифицирован')
    }
)
class AIAssistantPurchasesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        got_out = {
            'got': 12345.67,
            'out': 54321.67,
        }
        serializer = AIAssistantSerializer(got_out)
        return Response(serializer.data)
