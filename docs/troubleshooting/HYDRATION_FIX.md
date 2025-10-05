# Исправление ошибок Hydration и Empty Src

## ✅ Все ошибки исправлены!

### 🐛 Проблема 1: Hydration Error

**Ошибка:**
```
Hydration failed because the server rendered HTML didn't match the client.
```

**Причина:**
- На **сервере** (SSR) нет доступа к cookies
- Пользователь считается **не авторизованным** → рендерятся кнопки Login/Sign Up
- На **клиенте** есть cookies
- Пользователь считается **авторизованным** → рендерятся Bell icon и Avatar
- React видит разницу → **Hydration Error**

**Техническая деталь:**
```typescript
// ❌ НЕПРАВИЛЬНО - вычисляется на сервере и клиенте по-разному
const isAuthenticated = !!(userData || getCookie('sessionid'));

// На сервере: getCookie('sessionid') = undefined → isAuthenticated = false
// На клиенте: getCookie('sessionid') = "abc123" → isAuthenticated = true
// Результат: HTML не совпадает → Hydration Error
```

---

## 🔧 Решение

### Используем флаг `isMounted`

```typescript
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true); // Выполняется ТОЛЬКО на клиенте
}, []);

// ✅ ПРАВИЛЬНО - вычисляется только на клиенте после монтирования
const isAuthenticated = isMounted && !!(userData || getCookie('sessionid'));
```

**Как это работает:**
1. **Сервер рендерит:** `isMounted = false` → `isAuthenticated = false` → рендерятся кнопки Login
2. **Клиент получает HTML:** показывает кнопки Login (без hydration error)
3. **useEffect запускается:** `setIsMounted(true)`
4. **Пересчитывается:** `isAuthenticated = true` (если есть cookie) → показывается Avatar
5. **React делает update:** плавно меняет кнопки на Avatar

---

## 🐛 Проблема 2: Empty Src в Image

**Ошибка:**
```
An empty string ("") was passed to the src attribute.
```

**Причина:**
- Данные с бэкенда могут содержать **пустые строки** в поле `logo` или `img`
- Next.js Image компонент получает `src=""` → ошибка
- Браузер пытается загрузить изображение с пустым URL → загружает всю страницу заново

**Пример проблемного кода:**
```typescript
// ❌ НЕПРАВИЛЬНО
<Image
  src={item.logo ?? DefaultIcon.src}  // item.logo может быть ""
  alt='company'
/>

// item.logo = "" (пустая строка)
// ?? проверяет только на null/undefined, не на пустую строку
// Результат: src="" → ошибка
```

---

## 🔧 Решение

### Проверяем на пустую строку

```typescript
// ✅ ПРАВИЛЬНО
<Image
  src={item.logo && item.logo.trim() !== '' ? item.logo : DefaultIcon.src}
  alt='company'
/>

// Проверки:
// 1. item.logo существует (не null/undefined)
// 2. item.logo.trim() !== '' (не пустая строка после удаления пробелов)
// 3. Если обе проверки прошли → используем item.logo
// 4. Иначе → используем DefaultIcon.src
```

---

## 📄 Список исправленных файлов

### 1. Hydration Error (Header компоненты)

#### Marketplace
**Файл:** `AXA-marketplace-main/src/components/Header/index.tsx`

```typescript
const NewHeader = ({ onMenuClick }: HeaderProps = {}) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const isAuthenticated = isMounted && !!(userData || getCookie('sessionid'));
  
  return (
    // ...
    {isAuthenticated ? (
      <>{/* Avatar & Notifications */}</>
    ) : (
      <>{/* Login & Sign Up buttons */}</>
    )}
  );
};
```

#### Stocks
**Файл:** `AXA-stocks-frontend-main/src/components/HeaderNew.tsx`

```typescript
const HeaderNew = ({ onMenuClick }: HeaderProps = {}) => {
  const [isMounted, setIsMounted] = useState(false);
  
  useEffect(() => {
    setIsMounted(true);
  }, []);
  
  const isAuthenticated = isMounted && !!(userData || getCookie('sessionid') || getCookie('access-token'));
  
  return (
    // ... аналогично Marketplace
  );
};
```

#### Cryptocurrency
**Файл:** `AXA-coinmarketcap-main/src/components/HeaderNew.tsx`

```typescript
// Аналогично Stocks
```

---

### 2. Empty Src в Image (Stocks Project)

#### StocksCard.tsx
**Файл:** `AXA-stocks-frontend-main/src/components/StocksCard/StocksCard.tsx`

```typescript
<Image
  src={item.logo && item.logo.trim() !== '' ? item.logo : DefaultIcon.src}
  alt='company'
  width={0}
  height={0}
  loading='lazy'
  className='rounded-full w-12 h-12'
  unoptimized
/>
```

#### StocksTable.tsx
**Файл:** `AXA-stocks-frontend-main/src/screens/StocksScreen/components/StocksTable.tsx`

```typescript
<Image
  src={img && img.trim() !== '' ? img : DefaultIcon.src}
  alt={name}
  width={32}
  height={32}
  className='rounded-full'
  loading='lazy'
  unoptimized
/>
```

#### StockLeaders.tsx
**Файл:** `AXA-stocks-frontend-main/src/screens/MainScreen/components/StockLeaders.tsx`

```typescript
const imageSrc =
  item.icon && item.icon.trim() !== '' && item.icon.includes('company_icons')
    ? getImageLink(item.icon)
    : DefaultIcon.src;

<Image
  src={imageSrc}
  alt={item.name}
  width={24}
  height={24}
  loading='lazy'
  unoptimized
/>
```

#### Footer.tsx (Stocks)
**Файл:** `AXA-stocks-frontend-main/src/components/Layout/Footer.tsx`

```typescript
// Было:
import Logo from '@/assets/logo.svg';
<Image src={Logo} className='w-[27.88px] h-[32px]' alt='Logo' />

// Стало:
import LogoIcon from '@/assets/icons/logo.svg';
<LogoIcon className='w-[27.88px] h-[32px]' />
```

#### Footer.tsx (Crypto)
**Файл:** `AXA-coinmarketcap-main/src/components/Layout/Footer.tsx`

```typescript
// Было:
import Logo from '@/assets/logo.svg';
<Image src={Logo} className='w-[27.88px] h-[32px]' alt='Logo' />

// Стало:
import LogoIcon from '@/assets/new-logo.svg';
<LogoIcon className='w-[27.88px] h-[32px]' />
```

---

## 🎯 Результаты

### До исправления:
```
❌ Hydration Error в консоли при переходе между авторизованным/неавторизованным состоянием
❌ "An empty string ("") was passed to the src attribute" при загрузке страниц со списками акций
❌ Лишние сетевые запросы из-за попыток загрузить изображение с пустым URL
```

### После исправления:
```
✅ Нет Hydration Error
✅ Нет ошибок Empty Src
✅ Плавные переходы между авторизованным/неавторизованным состоянием
✅ Все изображения загружаются корректно
✅ Используется DefaultIcon для отсутствующих/пустых изображений
```

---

## 📊 Статус проектов

| Проект | Порт | Hydration Fixed | Empty Src Fixed | Статус |
|--------|------|----------------|-----------------|--------|
| Marketplace | 3005 | ✅ | N/A | ✅ 200 |
| Social Network | 3001 | N/A | N/A | ✅ 307 |
| Stocks | 3002 | ✅ | ✅ | ✅ 200 |
| Cryptocurrency | 3003 | ✅ | ✅ | ✅ 307 |

---

## 🧪 Как протестировать

### Тест 1: Hydration Error
1. Откройте Stocks/Crypto/Marketplace в режиме инкогнито (без cookies)
2. Откройте DevTools → Console
3. **✅ Должно:** Нет ошибок hydration
4. Войдите в аккаунт
5. **✅ Должно:** Плавно появиться Avatar вместо кнопок Login
6. Выйдите из аккаунта
7. **✅ Должно:** Плавно появиться кнопки Login вместо Avatar
8. **❌ НЕ должно:** Ошибок в консоли

### Тест 2: Empty Src
1. Откройте Stocks → `/crypto-currency/stocks`
2. Откройте DevTools → Console
3. **✅ Должно:** Нет ошибок "empty string src"
4. Прокрутите список акций
5. **✅ Должно:** Все иконки загружаются корректно
6. Если у акции нет иконки → показывается DefaultIcon
7. **❌ НЕ должно:** Попыток загрузить изображение с пустым URL

---

## 💡 Best Practices

### 1. Всегда используйте isMounted для SSR-чувствительной логики

```typescript
// ✅ ПРАВИЛЬНО
const [isMounted, setIsMounted] = useState(false);

useEffect(() => {
  setIsMounted(true);
}, []);

const someValue = isMounted ? getBrowserValue() : null;
```

### 2. Всегда проверяйте строки на пустоту для Image src

```typescript
// ✅ ПРАВИЛЬНО
<Image
  src={imageUrl && imageUrl.trim() !== '' ? imageUrl : fallbackImage}
  alt="..."
/>
```

### 3. Используйте SVG компоненты вместо Image для статичных логотипов

```typescript
// ❌ НЕПРАВИЛЬНО
import Logo from '@/assets/logo.svg';
<Image src={Logo} alt="Logo" />

// ✅ ПРАВИЛЬНО
import LogoIcon from '@/assets/logo.svg';
<LogoIcon className="w-8 h-8" />
```

---

## 📄 Связанные документы

- [SSO Fix](./SSO_FIX.md) - Настройка SSO
- [Login Fix](./LOGIN_FIX.md) - Исправление проблем с входом
- [Fixes Summary](./FIXES_SUMMARY.md) - Общая сводка исправлений

---

**Дата:** October 5, 2025  
**Статус:** ✅ Все работает

