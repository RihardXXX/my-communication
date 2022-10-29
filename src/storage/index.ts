import { Drivers, Storage } from '@ionic/storage';
import * as CordovaSQLiteDriver from 'localforage-cordovasqlitedriver';

// const storage = new Storage();

// имитация работы локалсториджа на уровне мобильного устройства
// тут принудительно меняем место хранения токена на sql lite
const storage = new Storage({
    driverOrder: [
        CordovaSQLiteDriver._driver,
        Drivers.IndexedDB,
        Drivers.LocalStorage,
    ],
});

//   await this.storage.defineDriver(CordovaSQLiteDriver);

(async () => {
    // регистрация плагина
    await storage.defineDriver(CordovaSQLiteDriver);
})();

const localStorage = (async () => {
    await storage.create();
    return storage;
})();

console.log('localStorage: ', localStorage);

export default localStorage;
