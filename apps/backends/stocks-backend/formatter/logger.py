import logging
import sys

# Настройка форматирования
formatter = logging.Formatter(
    '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Хендлер для вывода в консоль
console_handler = logging.StreamHandler(sys.stdout)
console_handler.setFormatter(formatter)

# Создание логгера
logger = logging.getLogger('formatter')
logger.setLevel(logging.DEBUG)
logger.addHandler(console_handler) 
