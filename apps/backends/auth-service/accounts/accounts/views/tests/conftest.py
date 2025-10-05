import pytest
import os
from unittest.mock import patch
from django.test import Client
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient

User = get_user_model()
