from django.apps import AppConfig

class DjangoLoginControlConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'django_login_control'
    verbose_name = 'Контроль попыток входа'

    def ready(self):
        # Импортируем сигналы для их регистрации
        import django_login_control.signals
