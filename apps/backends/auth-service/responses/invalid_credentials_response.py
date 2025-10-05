from typing import Any, Dict
from rest_framework.response import Response #type: ignore
from rest_framework import status #type: ignore


class InvalidCredentialsResponse(Response):

    def __init__(self, remaining_attempts: int | None = None):
        response_data: Dict[str, Any] = {
            "detail": "Invalid credentials",
        }
        if remaining_attempts is not None:
            response_data["remaining_attempts"] = remaining_attempts

        super().__init__(response_data, status=status.HTTP_403_FORBIDDEN)
