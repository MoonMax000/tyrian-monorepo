from rest_framework.response import Response #type: ignore
from rest_framework import status #type: ignore


class AccountLockedResponse(Response):

    def __init__(self, banned_until):
        super().__init__({
            'detail': 'Account is locked',
            'banned_until': banned_until,
            'lockout_reason': 'Превышен лимит неудачных попыток входа'
        }, status=status.HTTP_403_FORBIDDEN)
