# 🚨 БЫСТРАЯ ДИАГНОСТИКА ПРОБЛЕМ

## Черный экран на фронтенде

### 1. Проверьте консоль браузера (F12)
```
❌ Failed to load resource: 404 (Not Found)
❌ Module not found
❌ TypeError: undefined
```

### 2. Действия:
```bash
# Шаг 1: Проверьте TypeScript
npx tsc --noEmit

# Шаг 2: Если есть ошибки - ИСПРАВЬТЕ ИХ СНАЧАЛА!

# Шаг 3: Очистите кэш
rm -rf .next node_modules/.cache

# Шаг 4: Перезапустите
npm run dev

# Шаг 5: Жесткая перезагрузка браузера
# Mac: Cmd + Shift + R
# Windows: Ctrl + Shift + R
```

---

## Port already in use

```bash
# Найти процесс
lsof -i :3005

# Убить процесс
lsof -ti:3005 | xargs kill -9

# Или убить все Node процессы
killall -9 node npm
```

---

## TypeScript ошибки

```bash
# Проверить
npx tsc --noEmit

# Исправить ВСЕ ошибки перед запуском!
```

---

## 404 для статических файлов

**Причина:** Next.js не скомпилировал файлы (обычно из-за TypeScript ошибок)

**Решение:**
1. Проверьте `npx tsc --noEmit`
2. Исправьте ошибки
3. `rm -rf .next`
4. `npm run dev`

---

## Компиляция зависла

```bash
# Остановить все
killall -9 node npm

# Очистить
rm -rf .next node_modules/.cache

# Запустить заново
npm run dev
```

---

## Проверка всех сервисов

```bash
for port in 3005:Marketplace 3001:Social 3002:Stocks 3003:Crypto 3006:AI; do
  name=${port#*:}
  port=${port%:*}
  code=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:$port)
  echo "$name: $code"
done
```

---

## Быстрый перезапуск всех сервисов

```bash
./restart-services.sh
```

---

**ПОМНИТЕ: 90% проблем решаются:**
1. Проверкой TypeScript (`npx tsc --noEmit`)
2. Очисткой `.next`
3. Жесткой перезагрузкой браузера (Cmd+Shift+R)

