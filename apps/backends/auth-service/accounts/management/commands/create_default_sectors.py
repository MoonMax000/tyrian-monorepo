from django.core.management.base import BaseCommand
from accounts.models import Sector


class Command(BaseCommand):
    help = 'Создает секторы по умолчанию: Forex, Stock Market и Crypto'

    def handle(self, *args, **options):
        """Создает секторы по умолчанию, если они не существуют"""
        
        default_sectors = [
            'Forex',
            'Stock Market', 
            'Crypto'
        ]
        
        created_count = 0
        existing_count = 0
        
        for sector_name in default_sectors:
            sector, created = Sector.objects.get_or_create(
                name=sector_name,
                defaults={'name': sector_name}
            )
            
            if created:
                created_count += 1
                self.stdout.write(
                    self.style.SUCCESS(f'Создан сектор: {sector_name}')
                )
            else:
                existing_count += 1
                self.stdout.write(
                    self.style.WARNING(f'Сектор уже существует: {sector_name}')
                )
        
        self.stdout.write(
            self.style.SUCCESS(
                f'Обработка завершена. Создано: {created_count}, уже существовало: {existing_count}'
            )
        )
