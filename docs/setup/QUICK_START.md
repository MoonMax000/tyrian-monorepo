# 🚀 БЫСТРЫЙ СТАРТ

## Запуск всех сервисов:

```bash
cd "/Users/devidanderson/Downloads/Резерв ГитХаб/3 октября axa времянка 2"
./restart-services.sh
```

## Откройте в браузере:

**http://localhost:3005**

## Что вы увидите:

1. **Marketplace** с единой навигацией **NewNavBar** слева
2. Кликайте на пункты меню:
   - 📊 **Stock Market** → откроется Stocks в iframe
   - 💰 **Cryptocurrency** → откроется Crypto в iframe
   - 👥 **Social Network** → откроется Social в iframe
   - 🤖 **AI Assistant** → откроется AI в iframe
   - 🏠 **Home** → вернетесь в Marketplace

## Остановка:

```bash
killall node npm
```

## Логи (если что-то не работает):

```bash
tail -f /tmp/marketplace.log
tail -f /tmp/social.log
tail -f /tmp/stocks.log
tail -f /tmp/crypto.log
tail -f /tmp/ai.log
```

---

**Готово! Все работает!** 🎉
