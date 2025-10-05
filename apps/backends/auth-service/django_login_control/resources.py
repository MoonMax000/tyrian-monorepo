from import_export import resources # type: ignore
from .models import LoginEvent, UserLockout, IpLockout


class LoginEventResource(resources.ModelResource):
    class Meta:
        model = LoginEvent

class UserLockoutResource(resources.ModelResource):
    class Meta:
        model = UserLockout

class IpLockoutResource(resources.ModelResource):
    class Meta:
        model = IpLockout
