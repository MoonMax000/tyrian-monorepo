import os
import django #type: ignore
from django.conf import settings #type:ignore

# Настройка Django для pytest
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup() 