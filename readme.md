# Приложение на framework ionic

## Основная информация

Это приложение чат общение и знакомства

## Используемые технологии

проект создан с ипользованием:

-   Javascript
-   Typescript
-   Vue 3 Compotirion API with script setup
-   Manager State Pinia
-   HTTPS and Socket Protocol
-   Capasitor
-   Ionic
-   Vue-router
-   Ionic storage
-   Axios

## Документация по технологиям

-   [Ionic](https://ionicframework.com/)
-   [Vue3](https://vuejs.org/)
-   [Pinia](https://pinia.vuejs.org/)
-   [SocketIO](https://socket.io/docs/v4/client-api/)
-   [Capasitor](https://capacitorjs.com/)

## Установка и запуск приложения

Подробная инструкция по запуску приложения:

1. Устаналиваете на ваше устройство сервер Node JS
   (желательно используйте менеджер ноды nvm)

-   [NodeJS](https://nodejs.org/en/)

2. Устаналиваете на ваше устройство БД MongoDB

-   [MongoDB](https://www.mongodb.com/try/download/community)
-   [Compass](https://www.mongodb.com/products/compass) (клиент приложение дл просмотра БД)

3. Заходим и клонируем репозиторий для запуска бэка

-   [Репо бэка](https://github.com/RihardXXX/instagram-chat-backend)
    ` git clone git@github.com:RihardXXX/instagram-chat-backend.git`

4. Устанавливаем зависимости и запускаем бэк

```
npm install
npm run dev
```

5. Клонируем текущий репозиторий устанавливаем зависимости и запускаем веб сервер фронт

```
git clone git@github.com:RihardXXX/my-communication.git
npm install
npm run serve
```

6. Запуска эмулятора андроид и ios в режиме автообновления кода
7. Удаляем папки ios и aндроид если они созданны ранее

```
rm -R android
rm -R ios
```

8. Запускаем эмуляторы

```
ionic cap run ios -l --external
ionic cap run androiod -l --external
```

9. Если захотим запустить в эмуляторах с кодом
   при условии что билд сделан
   проверяем имеется ли старая папка потому что команда удаляет старые папки

```
npm run android
npm run ios
```
