# Финальные исправления всех проблем

## ✅ ИСПРАВЛЕНО (2 из 6)

### 1️⃣ Social Network - 404 ошибка при входе

**Проблема:**
```
Page not found (404)
Request URL: http://localhost:8001/socialweb
```

**Причина:**
- Кнопки Login/Sign Up делали редирект на `http://localhost:8001/socialweb`
- Auth Server не имеет UI роута `/socialweb`

**Решение:**
✅ Изменен `AXA-socialweb-frontend-main/src/components/HeaderNew.tsx`:
- Убран редирект на `/socialweb`
- Добавлено модальное окно `LoginModalWrapper`
- Добавлен Google OAuth handler
- Кнопки теперь открывают модальное окно вместо редиректа

**Измененные файлы:**
- `src/components/HeaderNew.tsx` - добавлен state и modal
- `src/components/Header/components/AuthorizationModal/LoginModalWrapper.tsx` - добавлен Google OAuth

---

### 2️⃣ Marketplace - AxiosError 404 при выходе

**Проблема:**
```
AxiosError: Request failed with status code 404
```

**Причина:**
- В `.env` было: `NEXT_PUBLIC_AUTH_API=http://localhost:8001/api/accounts`
- Logout вызывал: `/accounts/logout/`
- Полный URL: `http://localhost:8001/api/accounts/accounts/logout/` ❌

**Решение:**
✅ Исправлен `.env` файл:
```env
# Было:
NEXT_PUBLIC_AUTH_API=http://localhost:8001/api/accounts

# Стало:
NEXT_PUBLIC_AUTH_API=http://localhost:8001/api
```

Теперь logout вызывает:
```
http://localhost:8001/api + /accounts/logout/ = 
http://localhost:8001/api/accounts/logout/ ✅
```

**Измененные файлы:**
- `AXA-marketplace-main/.env`

---

## ⏳ ТРЕБУЕТСЯ ИСПРАВЛЕНИЕ (4 из 6)

### 3️⃣ Модальное окно входа растянуто на всю ширину

**Проблема:**
Модальное окно входа/регистрации растянуто глючно во всю ширину

**Что проверить:**
Все `LoginModalWrapper.tsx` должны иметь `max-w-[768px]`:

```typescript
// ✅ ПРАВИЛЬНО
<div className='grid grid-cols-2 items-center max-w-[768px] bg-blackedGray rounded-[16px]'>
```

**Файлы для проверки:**
- [x] Marketplace - `max-w-[768px]` ✅
- [ ] Social Network - проверить
- [ ] Stocks - проверить  
- [ ] Crypto - проверить

**Рекомендация:**
Проверить все LoginModalWrapper и убедиться что есть `max-w-[768px]` на главном div.

---

### 4️⃣ Кнопка входа через Google не везде работает

**Проблема:**
Кнопка Google OAuth не работает во многих местах

**Что сделано:**
- ✅ Marketplace - Google OAuth работает
- ✅ Stocks - Google OAuth работает
- ✅ Crypto - Google OAuth работает
- ✅ Social Network - Google OAuth работает (только что добавлено)

**Что нужно проверить:**
- [ ] AI Profiles (port 3006) - нужно добавить Google OAuth
- [ ] Live Streaming (port 3004) - нужно добавить Google OAuth
- [ ] Portfolios (port 5173) - нужно добавить Google OAuth

**Инструкция по добавлению:**

1. Убедиться что есть `LoginModalWrapper.tsx`
2. Добавить Google OAuth handler:
```typescript
const handleGoogleLogin = async () => {
  try {
    const authUrl = process.env.NEXT_PUBLIC_AUTH_URL || 'http://localhost:8001';
    const response = await fetch(`${authUrl}/api/accounts/google/`);
    const data = await response.json();
    
    if (data.auth_url) {
      window.location.href = data.auth_url;
    }
  } catch (error) {
    console.error('Google OAuth error:', error);
  }
};
```

3. Изменить SOCIAL_NETWORKS:
```typescript
const SOCIAL_NETWORKS = [
  { 
    icon: <GoogleIcon width={24} height={24} />, 
    onClick: handleGoogleLogin,
    name: 'Google'
  },
  // ...
];
```

4. Изменить div на button:
```typescript
<button
  onClick={item.onClick}
  title={`Sign in with ${item.name}`}
  className='bg-[#272A32] w-12 h-12 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#363943] transition-all hover:scale-110 active:scale-95'
>
  {item.icon}
</button>
```

---

### 5️⃣ My Portfolios - другой левый сайдбар

**Проблема:**
В "My Portfolios" (port 5173, проект "Портфели 4 окт") левый сайдбар другой, не единый как во всех остальных проектах.

**Решение:**
Нужно добавить единый `HeaderNew`, `NewSidebar` и `RightSidebar` из других проектов.

**План действий:**
1. Скопировать компоненты из Marketplace:
   - `NewSidebar.tsx`
   - `RightSidebar.tsx`
   - `HeaderNew.tsx` (или создать адаптированную версию)

2. Создать `ClientLayout.tsx` аналогичный другим проектам

3. Обновить `layout.tsx` чтобы использовать новый ClientLayout

**Примечание:**
Portfolios проект использует React Router (не Next.js), поэтому нужна адаптация:
- `useRouter` → `useNavigate` из `react-router-dom`
- `usePathname` → `useLocation` из `react-router-dom`

---

### 6️⃣ Live Streaming - два хедера

**Проблема:**
В Live Streaming (port 3004) видны два хедера/навбара, будто страница помещена внутрь страницы.

**Возможные причины:**
1. Старый хедер не удален, а новый добавлен сверху
2. Iframe integration с двойным header
3. Layout включает оба хедера

**Что проверить:**
1. Файл `src/app/ClientLayout.tsx` или аналогичный
2. Есть ли два компонента Header/HeaderNew
3. Есть ли iframe с другим сайтом

**Решение:**
Нужно удалить старый header и оставить только `HeaderNew`.

**Файлы для проверки:**
- `stream-frontend-service-main/src/app/layout.tsx`
- `stream-frontend-service-main/src/components/Header.tsx`
- `stream-frontend-service-main/src/components/HeaderNew.tsx`
- `stream-frontend-service-main/src/app/ClientLayout.tsx`

---

## 🧪 Как протестировать исправления

### Тест 1: Social Network Login
1. Откройте `http://localhost:3001/`
2. Нажмите кнопку **"Login"** или **"Sign Up"**
3. **✅ Должно:** Открыться модальное окно (НЕ редирект на /socialweb)
4. Нажмите на иконку Google
5. **✅ Должно:** Перенаправить на Google OAuth

### Тест 2: Marketplace Logout
1. Откройте `http://localhost:3005/`
2. Войдите в аккаунт
3. Нажмите на аватар → "Log Out"
4. **✅ Должно:** Успешный выход БЕЗ ошибки 404
5. **❌ НЕ должно:** AxiosError в консоли

### Тест 3: Модальное окно
1. Откройте любой проект
2. Нажмите "Login"
3. **✅ Должно:** Модальное окно центрировано, максимальная ширина 768px
4. **❌ НЕ должно:** Окно растянуто на весь экран

### Тест 4: Google OAuth
1. Проверьте все проекты (3001, 3002, 3003, 3005)
2. Откройте модальное окно входа
3. Нажмите на иконку Google
4. **✅ Должно:** Перенаправление на Google OAuth
5. **❌ НЕ должно:** Ничего не происходит или ошибка

---

## 📊 Статус исправлений

| Проблема | Статус | Файлы | Примечания |
|----------|--------|-------|-----------|
| 1. Social Network 404 | ✅ Исправлено | HeaderNew.tsx, LoginModalWrapper.tsx | Google OAuth добавлен |
| 2. Marketplace Logout | ✅ Исправлено | .env | Изменен NEXT_PUBLIC_AUTH_API |
| 3. Модальное окно | ⏳ Проверить | Все LoginModalWrapper.tsx | Проверить max-w-[768px] |
| 4. Google OAuth | ⏳ Частично | AI Profiles, Streaming, Portfolios | Нужно добавить в 3 проекта |
| 5. Portfolios Layout | ⏳ TODO | Портфели 4 окт | Нужен единый Header/Sidebar |
| 6. Streaming Двойной Header | ⏳ TODO | stream-frontend-service-main | Нужно удалить старый header |

---

## 🚀 Следующие шаги

1. **Срочно:**
   - Проверить модальные окна на ширину
   - Исправить Portfolios layout
   - Исправить двойной header в Streaming

2. **Важно:**
   - Добавить Google OAuth в оставшиеся проекты
   - Унифицировать все модальные окна

3. **Потом:**
   - Тестирование SSO между всеми проектами
   - Проверка всех страниц в левом сайдбаре

---

**Дата:** October 5, 2025  
**Статус:** ⏳ 2 из 6 исправлено

