"""
Google OAuth Authentication Views
"""
import os
import requests
from django.shortcuts import redirect
from django.contrib.auth import login
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from accounts.models import User
from django.contrib.sessions.models import Session


class GoogleOAuthInitView(APIView):
    """
    Инициирует Google OAuth процесс
    GET /api/accounts/google/
    """
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        client_id = os.getenv('GOOGLE_CLIENT_ID')
        redirect_uri = os.getenv('GOOGLE_REDIRECT_URI', 'http://localhost:8001/api/accounts/google/callback/')
        
        # URL для авторизации Google
        google_auth_url = (
            f"https://accounts.google.com/o/oauth2/v2/auth?"
            f"client_id={client_id}&"
            f"redirect_uri={redirect_uri}&"
            f"response_type=code&"
            f"scope=openid%20email%20profile&"
            f"access_type=offline"
        )
        
        return Response({
            'auth_url': google_auth_url,
            'message': 'Redirect user to this URL'
        })


class GoogleOAuthCallbackView(APIView):
    """
    Обрабатывает callback от Google
    GET /api/accounts/google/callback/?code=...
    """
    permission_classes = []
    authentication_classes = []

    def get(self, request):
        code = request.GET.get('code')
        
        if not code:
            return Response({
                'error': 'No authorization code provided'
            }, status=status.HTTP_400_BAD_REQUEST)

        # Получаем настройки из .env
        client_id = os.getenv('GOOGLE_CLIENT_ID')
        client_secret = os.getenv('GOOGLE_CLIENT_SECRET')
        redirect_uri = os.getenv('GOOGLE_REDIRECT_URI', 'http://localhost:8001/api/accounts/google/callback/')

        # Обмениваем code на access token
        token_url = 'https://oauth2.googleapis.com/token'
        token_data = {
            'code': code,
            'client_id': client_id,
            'client_secret': client_secret,
            'redirect_uri': redirect_uri,
            'grant_type': 'authorization_code',
        }

        try:
            token_response = requests.post(token_url, data=token_data)
            token_response.raise_for_status()
            tokens = token_response.json()
            access_token = tokens.get('access_token')

            # Получаем информацию о пользователе
            userinfo_url = 'https://www.googleapis.com/oauth2/v2/userinfo'
            headers = {'Authorization': f'Bearer {access_token}'}
            userinfo_response = requests.get(userinfo_url, headers=headers)
            userinfo_response.raise_for_status()
            user_data = userinfo_response.json()

            # Создаём или получаем пользователя
            email = user_data.get('email')
            first_name = user_data.get('given_name', '')
            last_name = user_data.get('family_name', '')
            google_id = user_data.get('id')

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],
                    'first_name': first_name,
                    'last_name': last_name,
                    'is_active': True,
                }
            )

            # Логиним пользователя
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')

            # Определяем куда редиректить
            frontend_url = os.getenv('MARKETPLACE_URL', 'http://localhost:4205')
            
            # Редиректим с токеном сессии
            return redirect(f"{frontend_url}/?login=success")

        except requests.exceptions.RequestException as e:
            return Response({
                'error': 'Failed to authenticate with Google',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)


class GoogleOAuthLoginDirectView(APIView):
    """
    Прямой вход через Google (для фронтенда)
    POST /api/accounts/google/login/
    Body: { "access_token": "..." }
    """
    permission_classes = []
    authentication_classes = []

    def post(self, request):
        access_token = request.data.get('access_token')
        
        if not access_token:
            return Response({
                'error': 'access_token is required'
            }, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Получаем информацию о пользователе от Google
            userinfo_url = 'https://www.googleapis.com/oauth2/v2/userinfo'
            headers = {'Authorization': f'Bearer {access_token}'}
            userinfo_response = requests.get(userinfo_url, headers=headers)
            userinfo_response.raise_for_status()
            user_data = userinfo_response.json()

            # Создаём или получаем пользователя
            email = user_data.get('email')
            first_name = user_data.get('given_name', '')
            last_name = user_data.get('family_name', '')

            user, created = User.objects.get_or_create(
                email=email,
                defaults={
                    'username': email.split('@')[0],
                    'first_name': first_name,
                    'last_name': last_name,
                    'is_active': True,
                }
            )

            # Логиним пользователя
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')

            return Response({
                'message': 'Successfully authenticated with Google',
                'user': {
                    'id': user.id,
                    'email': user.email,
                    'username': user.username,
                    'first_name': user.first_name,
                    'last_name': user.last_name,
                },
                'created': created
            }, status=status.HTTP_200_OK)

        except requests.exceptions.RequestException as e:
            return Response({
                'error': 'Failed to authenticate with Google',
                'details': str(e)
            }, status=status.HTTP_400_BAD_REQUEST)

