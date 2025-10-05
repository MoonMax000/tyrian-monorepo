from rest_framework.response import Response #type: ignore
from rest_framework import status #type: ignore


class IpBlockedResponse(Response):

    def __init__(self, banned_until, ip_address):
        super().__init__({
            "detail": "Ip is blocked",
            "banned_until": banned_until,
            'lockout_reason': f'Превышен лимит неудачных попыток входа c ip {ip_address}'
        }, status=status.HTTP_403_FORBIDDEN)
