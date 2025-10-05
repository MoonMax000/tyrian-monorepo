from django.apps import AppConfig # type: ignore


class AccountsConfig(AppConfig):
    default_auto_field = "django.db.models.BigAutoField"
    name = "accounts"
    verbose_name = "Личные кабинеты"

    def ready(self):
        # Импортируем сигналы для их регистрации
        import accounts.signals
