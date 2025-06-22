# Кредитный калькулятор

Интерактивное веб-приложение для расчета параметров аннуитетного кредита с визуализацией графика погашения.

## 🚀 Демо

[mortgage-calc-ivory.vercel.app](https://mortgage-calc-ivory.vercel.app/)

## ✨ Возможности

- **Интерактивные ползунки** для настройки суммы кредита, процентной ставки и срока
- **Мгновенный перерасчет** всех параметров при изменении входных данных
- **Визуализация графика амортизации** с разбивкой на основной долг и проценты
- **Экспорт данных** в CSV и PDF форматы
- **Досрочные платежи** с пересчетом графика погашения
- **Адаптивный дизайн** для всех устройств (от 320px)
- **Доступность** (ARIA-атрибуты, контраст ≥ 4.5:1)

## 🛠 Технологии

- **React 19** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборка и dev-сервер
- **Tailwind CSS** - стилизация
- **Recharts** - графики
- **Vitest** - тестирование
- **ESLint & Prettier** - качество кода

## 📋 Требования

- Node.js >= 18
- npm >= 9

## 🚀 Быстрый старт

1. Клонируйте репозиторий:
```bash
git clone https://github.com/your-username/mortgage-calculator.git
cd mortgage-calculator
```

2. Установите зависимости:
```bash
npm install
```

3. Запустите dev-сервер:
```bash
npm run dev
```

4. Откройте http://localhost:5173

## 📦 Скрипты

```bash
npm run dev          # Запуск dev-сервера с HMR
npm run build        # Продакшн сборка
npm run preview      # Просмотр production сборки
npm test             # Запуск тестов
npm run test:watch   # Тесты в режиме наблюдения
npm run test:coverage # Отчет о покрытии
npm run lint         # Проверка ESLint
npm run format       # Форматирование Prettier
npm run typecheck    # Проверка TypeScript
```

## 📁 Структура проекта

```
src/
├── components/          # React компоненты
│   ├── SliderInput.tsx     # Переиспользуемый ползунок
│   ├── LoanSummary.tsx     # Итоговая информация
│   ├── AmortizationChart.tsx # График погашения
│   └── PrepaymentModal.tsx  # Модальное окно досрочных платежей
├── lib/                 # Утилиты и бизнес-логика
│   ├── amortization.ts     # Расчеты амортизации
│   ├── formatters.ts       # Форматирование чисел
│   └── exportUtils.ts      # Экспорт данных
├── hooks/               # Кастомные React хуки
├── types/               # TypeScript типы
└── App.tsx             # Корневой компонент
```

## 🧮 Математическая модель

Приложение использует стандартную формулу аннуитетного платежа:

```
r = APR / (12 × 100)  // месячная процентная ставка
n = years × 12        // общее количество платежей
P = r × A / (1 - (1 + r)^(-n))  // ежемесячный платеж
```

Где:
- `A` - сумма кредита
- `APR` - годовая процентная ставка
- `years` - срок кредита в годах
- `P` - ежемесячный платеж

## 🧪 Тестирование

```bash
# Единовременный запуск
npm test

# Режим наблюдения
npm run test:watch

# С покрытием
npm run test:coverage
```

Цель: покрытие ≥ 90% для `src/lib/`

## 🎨 Стиль кода

- Только функциональные компоненты React
- Строгая типизация TypeScript (`strict: true`)
- Максимум 200 строк на компонент
- Абсолютные импорты от `@/`
- Иммутабельное обновление состояния

## 📊 Производительность

- Обновление UI ≤ 100ms после ввода
- Lighthouse Performance > 90
- Lighthouse Accessibility > 95

## 🚀 Деплой

Проект настроен для автоматического деплоя через GitHub Actions:

1. Push в ветку `main` запускает CI/CD
2. Выполняются проверки: lint → test → build
3. При успехе - автоматический деплой на GitHub Pages

## 🤝 Вклад в проект

1. Форкните репозиторий
2. Создайте feature-ветку (`git checkout -b feature/amazing-feature`)
3. Закоммитьте изменения (`git commit -m 'feat: add amazing feature'`)
4. Запушьте ветку (`git push origin feature/amazing-feature`)
5. Откройте Pull Request

## 📄 Лицензия

MIT License - см. файл [LICENSE](LICENSE)

## 👥 Авторы

- Ваше имя - [GitHub](https://github.com/your-username)

---

Создано с ❤️ используя React и TypeScript