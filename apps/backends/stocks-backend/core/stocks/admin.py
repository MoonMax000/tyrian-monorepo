from django.contrib import admin

# Register your models here.
from stocks.models import Stock


@admin.register(Stock)
class StockAdmin(admin.ModelAdmin):
    list_display = ("ticker", "name", "last_price")
    search_fields = ("name", "ticker")
    list_filter = ("name", "ticker")
    ordering = ("ticker",)
