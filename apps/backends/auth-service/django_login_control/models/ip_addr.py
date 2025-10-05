from django.db import models # type: ignore

class IpAddr(models.Model):
    addr = models.GenericIPAddressField()
    
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.email} @ {self.blocked_until}" 