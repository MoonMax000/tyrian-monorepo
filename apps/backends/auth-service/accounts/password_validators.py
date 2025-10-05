import string

from django.core.exceptions import ValidationError # type: ignore
from django.utils.translation import gettext as _ # type: ignore


def is_password_hard(password: str) -> bool:
    """
    Проверяет, является ли пароль достаточно сложным
    https://gist.github.com/breduin/021c79f7db5d8006a28f77058b9641a1
    """
    special_chars = string.punctuation
    has_special = any(char in special_chars for char in password)
    
    return all([
      not password.isalpha(),
      not password.isupper(),
      not password.islower(),
      not password.isdigit(),
      has_special,
      ])


class SymbolsValidator:
    def __init__(self):
        pass

    def validate(self, password, user=None):

        if not is_password_hard(password):
            raise ValidationError(
                _("This password must contain at least 1 number, 1 uppercase letter, 1 lowercase letter and 1 special character."),
                code="password_is_not_hard",
            )

    def get_help_text(self):
        return _(
            "Your password must contain at least 1 number, 1 uppercase letter, 1 lowercase letter and 1 special character."
        )
