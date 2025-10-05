from django.urls import path
from .auth_server import ASUserControlView


urlpatterns = [
    path('as-user-control/', ASUserControlView.as_view(), name='as-user-control'),
]
