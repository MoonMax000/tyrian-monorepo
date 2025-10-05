from django.contrib import admin  # type: ignore
from django.contrib import messages
from ..models import User, UserProfile  # Импорт ваших моделей
from ..services import send_request_to_create_user_in_services


class UserProfileInline(admin.StackedInline):
    model = UserProfile
    can_delete = False
    verbose_name_plural = 'Профиль'
    fields = (
        'time_zone',
    )
    extra = 0  # Не показывать дополнительные пустые формы


@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    '''
    Административная панель для модели User.
    '''

    list_display = (
        'email',
        'is_active',
        'time_zone_display',
        'created_at_display',
        'is_2fa_enabled',
        'verification_method',
        'username',
        'name',
        'location',
        'role',
        'sectors_display',
    )
    search_fields = (
        'email',
        'backup_email',
        'user_profiles__time_zone',
    )  # Поиск по email и часовому поясу
    list_filter = (
        'is_active',
        'is_2fa_enabled',
        'role',
        'verification_method',
        'user_profiles__time_zone',
    )  # Фильтр по часовому поясу
    list_select_related = (
        'user_profiles',
    )  # Оптимизация запросов к БД
    readonly_fields = (
        'last_login',
        'date_joined',
        'time_zone_field',
    )
    actions = ['send_create_user_requests']

    fieldsets = (
        (None, 
            {'fields': (
                'email',
                'password',
                'name',
                'username',
                'verification_method',
                'location',
                'role',
                'sectors',
                'bio',
                'backup_email',
                'phone',
                'backup_phone',
                )
                }),
        ('Статусы',
            {'fields': (
                'is_active',
                'is_staff',
                'is_superuser',
                'is_2fa_enabled',
                'is_deleted',
                'deletion_requested_at',
                )
                }),
        ('Даты', {
            'fields': (
                'last_login',
                'date_joined'
                )
                }),
    )

    inlines = (UserProfileInline,)

    def time_zone_display(self, obj):
        '''
        Отображает часовой пояс пользователя в списке.
        Возвращает 'Не указан' если профиль отсутствует.
        '''
        return obj.user_profiles.time_zone if hasattr(obj, 'user_profiles') else 'Не указан'

    time_zone_display.short_description = 'Часовой пояс'  # type:ignore
    # Сортировка по полю
    time_zone_display.admin_order_field = 'user_profiles__time_zone'  # type:ignore

    def created_at_display(self, obj):
        '''Форматированное отображение даты регистрации'''
        return obj.date_joined.strftime('%d.%m.%Y %H:%M')

    created_at_display.short_description = 'Дата регистрации'  # type:ignore
    created_at_display.admin_order_field = 'date_joined'  # type:ignore

    def time_zone_field(self, obj):
        '''
        Отображение часового пояса в форме редактирования пользователя.
        Поле доступно только для чтения.
        '''
        if hasattr(obj, 'user_profiles'):
            return obj.user_profiles.time_zone
        return 'Профиль не создан'

    time_zone_field.short_description = 'Часовой пояс'  # type:ignore

    def sectors_display(self, obj):
        '''
        Отображает список секторов пользователя в списке.
        Возвращает строку с названиями секторов через запятую.
        '''
        sectors = obj.sectors.all()
        if sectors:
            return ', '.join([sector.name for sector in sectors])
        return 'Не указаны'

    sectors_display.short_description = 'Секторы'  # type:ignore

    def send_create_user_requests(self, request, queryset):
        '''Отправляет запросы на создание пользователей в сервисах'''
        user_ids = queryset.values_list('id', flat=True)
        send_request_to_create_user_in_services.delay(list(user_ids))

        self.message_user(
            request,
            f'Запросы синхронизации отправлены для {queryset.count()} пользователей',
            messages.SUCCESS
        )

    send_create_user_requests.short_description = 'Синхронизировать с сервисами'  # type:ignore

    def get_queryset(self, request):
        '''Оптимизация запросов с помощью select_related'''
        return super().get_queryset(request).select_related('user_profiles')
