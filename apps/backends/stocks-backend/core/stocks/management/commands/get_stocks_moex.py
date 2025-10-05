from django.core.management import BaseCommand
from django.db import IntegrityError

from stocks.models import Stock
from stocks.api.moex import MoexApi


class Command(BaseCommand):
    """Django command to get stocks from Moex"""

    def handle(self, *args, **options):
        api_client = MoexApi()
        stocks = api_client.get_stocks()
        created_number = 0
        existing_number = 0
        for stock in stocks:
            try:
                Stock.objects.create(name=stock["SECNAME"], ticker=stock["SECID"])
                created_number += 1
            except IntegrityError:
                existing_number += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Got {len(stocks)} stocks, {created_number} created, {existing_number} existing"
            )
        )
