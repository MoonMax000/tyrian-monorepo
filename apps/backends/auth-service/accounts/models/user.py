from django.contrib.auth.models import AbstractUser #type: ignore
from django.db import models #type: ignore
from django.core.validators import RegexValidator #type: ignore
from django.utils import timezone #type: ignore

from accounts.managers import UserManager
from accounts.models.user_role import UserRole


class User(AbstractUser):
    '''
    Основная модель пользователя проекта.
    '''
    email = models.EmailField(
        verbose_name="email",
        null=False,
        unique=True,
    )
    is_active = models.BooleanField(
        default=False,
        )
    avatar = models.ImageField(
        upload_to='avatars/',
        null=True,
        blank=True,
        verbose_name="Avatar"
    )
    background_image = models.ImageField(
        upload_to='backgrounds/',
        null=True,
        blank=True,
        verbose_name="Background image"
    )
    name = models.CharField(
        max_length=128,
        null=True,
        blank=True,
        verbose_name="First name"
    )
    username = models.CharField(
        max_length=128,
        unique=True,
        null=True,
        blank=True,
        validators=[
            RegexValidator(
                regex=r'^[a-zA-Z0-9_-]+$',
                message='Username can only contain letters, numbers, hyphens and underscores'
            )
        ],
        verbose_name="Username"
    )
    location = models.CharField(
        max_length=128,
        null=True,
        blank=True,
        verbose_name="Location"
    )
    website = models.URLField(
        null=True,
        blank=True,
        verbose_name="Website"
    )
    role = models.ForeignKey(
        UserRole,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        verbose_name="Role"
    )
    
    sectors = models.ManyToManyField(
        'Sector',
        blank=True,
        verbose_name="Секторы"
    )
    bio = models.TextField(
        null=True,
        blank=True,
        verbose_name="Biography"
    )
    backup_email = models.EmailField(
        null=True,
        blank=True,
        verbose_name="Backup email"
    )
    phone = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        verbose_name="Phone"
    )
    backup_phone = models.CharField(
        max_length=20,
        null=True,
        blank=True,
        verbose_name="Backup phone"
    )
    is_2fa_enabled = models.BooleanField(
        default=False,
        verbose_name="2FA enabled",
        help_text="is user subjected to 2FA when is authenticating (set by user)",
    )
    is_deleted = models.BooleanField(
        default=False,
        verbose_name="Is account deleted",
        help_text="is the account to be physically deleted (set by user)",
    )
    deletion_requested_at = models.DateTimeField(
        verbose_name="Time of deletion request",
        null=True,
        blank=True,
        )

    VERIFICATION_METHOD_CHOICES = [
        ('email', 'Email'),
        ('sms', 'SMS'),
    ]
    verification_method = models.CharField(
        max_length=10,
        choices=VERIFICATION_METHOD_CHOICES,
        default='email',
        verbose_name="Verification method"
    )

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS: list[str] = []

    objects = UserManager()

    def __str__(self):
        return self.email

    def request_deletion(self):
        self.is_deleted = True
        self.deletion_requested_at = timezone.now()
        self.save()
        
    def cancel_deletion(self):
        self.is_deleted = False
        self.deletion_requested_at = None
        self.save()

    class Meta:
        verbose_name = "User"
        verbose_name_plural = "Users"
        ordering = ["email"]
