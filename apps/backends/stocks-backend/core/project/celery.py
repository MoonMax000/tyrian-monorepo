import os

from celery import Celery
from celery.schedules import crontab


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "project.settings")


app = Celery("project")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()


# app.conf.beat_schedule = {
#     "update-stock-current-info": {
#         "task": "stocks.tasks.update_stock_current_info_task.update_stock_current_info_task",
#         "schedule": crontab(
#             minute="0",
#             hour="*",
#         ),
#     },
# }
