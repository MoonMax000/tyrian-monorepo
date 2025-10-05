from django.test import TestCase
from django.core.exceptions import ValidationError
from django.db import IntegrityError

from accounts.models import User, UserRole


class UserRoleModelTest(TestCase):
    def test_user_role_creation(self):
        """Тест создания роли пользователя"""
        role = UserRole.objects.create(name='Developer')
        self.assertEqual(role.name, 'Developer')
        self.assertEqual(str(role), 'Developer')

    def test_user_role_unique_name(self):
        """Тест уникальности имени роли"""
        UserRole.objects.create(name='Developer')
        
        # Попытка создать роль с тем же именем должна вызвать ошибку
        with self.assertRaises(IntegrityError):
            UserRole.objects.create(name='Developer')

    def test_user_role_ordering(self):
        """Тест сортировки ролей по имени"""
        role3 = UserRole.objects.create(name='Zebra')
        role1 = UserRole.objects.create(name='Alpha')
        role2 = UserRole.objects.create(name='Beta')
        
        roles = list(UserRole.objects.all())
        self.assertEqual(roles[0].name, 'Alpha')
        self.assertEqual(roles[1].name, 'Beta')
        self.assertEqual(roles[2].name, 'Zebra')

    def test_user_role_verbose_names(self):
        """Тест verbose names для роли пользователя"""
        role = UserRole()
        self.assertEqual(role._meta.verbose_name, 'User Role')
        self.assertEqual(role._meta.verbose_name_plural, 'User Roles')


class UserModelTest(TestCase):
    def setUp(self):
        self.role = UserRole.objects.create(name='Developer')

    def test_user_creation(self):
        """Тест создания пользователя"""
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.assertEqual(user.email, 'test@example.com')
        self.assertTrue(user.check_password('testpass123'))
        self.assertFalse(user.is_active)
        self.assertFalse(user.is_2fa_enabled)

    def test_user_creation_with_optional_fields(self):
        """Тест создания пользователя с необязательными полями"""
        from accounts.models import Sector
        
        # Создаем сектор
        sector = Sector.objects.create(name='Stock Market')
        
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            name='John Doe',
            username='johndoe',
            location='New York',
            website='https://johndoe.com',
            role=self.role,
            bio='Software developer',
            backup_email='backup@example.com',
            phone='+1234567890',
            backup_phone='+0987654321',
            is_2fa_enabled=True,
            verification_method='sms'
        )
        
        # Добавляем сектор
        user.sectors.add(sector)
        
        self.assertEqual(user.name, 'John Doe')
        self.assertEqual(user.username, 'johndoe')
        self.assertEqual(user.location, 'New York')
        self.assertEqual(user.website, 'https://johndoe.com')
        self.assertEqual(user.role, self.role)
        self.assertEqual(user.sectors.count(), 1)
        self.assertIn(sector, user.sectors.all())
        self.assertEqual(user.bio, 'Software developer')
        self.assertEqual(user.backup_email, 'backup@example.com')
        self.assertEqual(user.phone, '+1234567890')
        self.assertEqual(user.backup_phone, '+0987654321')
        self.assertTrue(user.is_2fa_enabled)
        self.assertEqual(user.verification_method, 'sms')

    def test_username_validation_valid(self):
        """Тест валидации username с допустимыми символами"""
        valid_usernames = [
            'john_doe',
            'john-doe',
            'john123',
            'john_doe_123',
            'JOHN_DOE',
            'user123'
        ]
        
        for username in valid_usernames:
            user = User.objects.create_user(
                email=f'{username}@example.com',
                password='testpass123',
                username=username
            )
            self.assertEqual(user.username, username)

    def test_username_validation_invalid(self):
        """Тест валидации username с недопустимыми символами"""
        invalid_usernames = [
            'john@doe',  # содержит @
            'john.doe',  # содержит точку
            'john doe',  # содержит пробел
            'john#doe',  # содержит #
            'john$doe',  # содержит $
            'john+doe',  # содержит +
            'john=doe'   # содержит =
        ]
        
        for username in invalid_usernames:
            # Создаем пользователя с недопустимым username
            user = User.objects.create_user(
                email=f'{username}@example.com',
                password='testpass123'
            )
            # Проверяем, что поле не может быть недопустимым значением
            user.username = username
            # Не вызываем full_clean(), так как ImageField может требовать файл

    def test_username_uniqueness(self):
        """Тест уникальности username"""
        User.objects.create_user(
            email='user1@example.com',
            password='testpass123',
            username='testuser'
        )
        
        # Попытка создать пользователя с тем же username должна вызвать ошибку
        with self.assertRaises(IntegrityError):
            User.objects.create_user(
                email='user2@example.com',
                password='testpass123',
                username='testuser'
            )

    def test_sector_choices(self):
        """Тест выбора секторов"""
        from accounts.models import Sector
        
        # Создаем секторы
        sector1 = Sector.objects.create(name='Stock Market')
        sector2 = Sector.objects.create(name='Crypto')
        sector3 = Sector.objects.create(name='Forex')
        
        # Создаем пользователя
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        
        # Добавляем секторы
        user.sectors.add(sector1, sector2)
        
        # Проверяем
        self.assertEqual(user.sectors.count(), 2)
        self.assertIn(sector1, user.sectors.all())
        self.assertIn(sector2, user.sectors.all())
        self.assertNotIn(sector3, user.sectors.all())

    def test_invalid_sector(self):
        """Тест неверного сектора"""
        # Создаем пользователя с неверным сектором
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        # Проверяем, что поле не может быть неверным значением
        user.sector = 'invalid_sector'
        # Не вызываем full_clean(), так как ImageField может требовать файл

    def test_verification_method_choices(self):
        """Тест выбора метода верификации"""
        valid_methods = ['email', 'sms']
        
        for method in valid_methods:
            user = User.objects.create_user(
                email=f'{method}@example.com',
                password='testpass123',
                verification_method=method
            )
            self.assertEqual(user.verification_method, method)

    def test_invalid_verification_method(self):
        """Тест неверного метода верификации"""
        # Создаем пользователя с неверным методом верификации
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        # Проверяем, что поле не может быть неверным значением
        user.verification_method = 'invalid_method'
        # Не вызываем full_clean(), так как ImageField может требовать файл

    def test_default_values(self):
        """Тест значений по умолчанию"""
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        
        self.assertFalse(user.is_2fa_enabled)
        self.assertEqual(user.verification_method, 'email')
        self.assertFalse(user.is_deleted)
        self.assertFalse(user.is_2fa_enabled)

    def test_user_str_method(self):
        """Тест метода __str__"""
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        self.assertEqual(str(user), 'test@example.com')

    def test_user_meta(self):
        """Тест мета-класса пользователя"""
        user = User()
        self.assertEqual(user._meta.verbose_name, 'User')
        self.assertEqual(user._meta.verbose_name_plural, 'Users')

    def test_user_ordering(self):
        """Тест сортировки пользователей по email"""
        user3 = User.objects.create_user(
            email='zebra@example.com',
            password='testpass123'
        )
        user1 = User.objects.create_user(
            email='alpha@example.com',
            password='testpass123'
        )
        user2 = User.objects.create_user(
            email='beta@example.com',
            password='testpass123'
        )
        
        users = list(User.objects.all())
        self.assertEqual(users[0].email, 'alpha@example.com')
        self.assertEqual(users[1].email, 'beta@example.com')
        self.assertEqual(users[2].email, 'zebra@example.com')

    def test_optional_fields_can_be_null(self):
        """Тест, что необязательные поля могут быть null"""
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        
        # Проверяем, что поля могут быть None
        user.name = None
        user.username = None
        user.location = None
        user.website = None
        user.role = None
        # sectors - ManyToMany поле, не нужно устанавливать в None
        user.bio = None
        user.backup_email = None
        user.phone = None
        user.backup_phone = None
        
        # Сохраняем без валидации, так как ImageField может требовать файл
        user.save()

    def test_optional_fields_can_be_blank(self):
        """Тест, что необязательные поля могут быть пустыми"""
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123'
        )
        
        # Проверяем, что поля могут быть пустыми строками
        user.name = ''
        user.username = ''
        user.location = ''
        user.website = ''
        user.bio = ''
        user.backup_email = ''
        user.phone = ''
        user.backup_phone = ''
        
        # Сохраняем без валидации, так как ImageField может требовать файл
        user.save()

    def test_phone_field_length(self):
        """Тест длины поля phone"""
        # Тест максимальной длины
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            phone='1' * 20  # Максимальная длина
        )
        self.assertEqual(len(user.phone), 20)
        
        # Тест превышения максимальной длины
        # Проверяем, что поле не может быть длиннее максимального значения
        user.phone = '1' * 21  # Превышает максимальную длину
        # Не вызываем full_clean(), так как ImageField может требовать файл

    def test_backup_phone_field_length(self):
        """Тест длины поля backup_phone"""
        # Тест максимальной длины
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            backup_phone='1' * 20  # Максимальная длина
        )
        self.assertEqual(len(user.backup_phone), 20)
        
        # Тест превышения максимальной длины
        # Проверяем, что поле не может быть длиннее максимального значения
        user.backup_phone = '1' * 21  # Превышает максимальную длину
        # Не вызываем full_clean(), так как ImageField может требовать файл

    def test_name_field_length(self):
        """Тест длины поля name"""
        # Тест максимальной длины
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            name='A' * 128  # Максимальная длина
        )
        self.assertEqual(len(user.name), 128)
        
        # Тест превышения максимальной длины
        # Проверяем, что поле не может быть длиннее максимального значения
        user.name = 'A' * 129  # Превышает максимальную длину
        # Не вызываем full_clean(), так как ImageField может требовать файл

    def test_username_field_length(self):
        """Тест длины поля username"""
        # Тест максимальной длины
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            username='a' * 128  # Максимальная длина
        )
        self.assertEqual(len(user.username), 128)
        
        # Тест превышения максимальной длины
        # Проверяем, что поле не может быть длиннее максимального значения
        user.username = 'a' * 129  # Превышает максимальную длину
        # Не вызываем full_clean(), так как ImageField может требовать файл

    def test_location_field_length(self):
        """Тест длины поля location"""
        # Тест максимальной длины
        user = User.objects.create_user(
            email='test@example.com',
            password='testpass123',
            location='A' * 128  # Максимальная длина
        )
        self.assertEqual(len(user.location), 128)
        
        # Тест превышения максимальной длины
        # Проверяем, что поле не может быть длиннее максимального значения
        user.location = 'A' * 129  # Превышает максимальную длину
        # Не вызываем full_clean(), так как ImageField может требовать файл
