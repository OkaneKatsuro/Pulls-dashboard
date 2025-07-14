

## Структура проекта

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API маршруты
│   │   └── pools/        # API эндпоинты майнинг пулов
│   ├── globals.css       # Глобальные стили
│   ├── layout.tsx        # Корневой layout с провайдером темы
│   └── page.tsx          # Главная страница дашборда
├── components/            # React компоненты
│   ├── pools/            # Специфичные для майнинг пулов компоненты
│   ├── providers/        # Провайдеры контекста
│   └── ui/               # shadcn/ui компоненты
├── data/                 # Мок данные и константы
├── hooks/                # Кастомные React хуки
├── store/                # Zustand управление состоянием
├── types/                # TypeScript типы
└── lib/                  # Утилитарные функции
```

## Доступные скрипты

- `npm run dev` - Запуск сервера разработки
- `npm run build` - Сборка для продакшена
- `npm run start` - Запуск продакшен сервера
- `npm run lint` - Запуск ESLint
- `npm test` - Запуск тестов
- `npm run test:watch` - Запуск тестов в режиме наблюдения
- `npm run test:api` - Запуск только API тестов


## Тестирование

Проект включает smoke-тесты для API эндпоинтов:

```bash
# Запуск всех тестов
npm test

# Запуск только API тестов
npm run test:api

# Запуск тестов в режиме наблюдения
npm run test:watch
```

## Docker

Сборка и запуск приложения с помощью Docker:

```bash
# Сборка образа
docker build -t mining-pools-dashboard .

# Запуск контейнера
docker run -p 3000:3000 mining-pools-dashboard
```

## CI/CD

Проект включает GitHub Actions workflow, который запускается при push в ветки main/develop и pull requests:

- **Test**: Запускает линтинг, тесты и сборку 
- **Docker**: Собирает и тестирует Docker образ

