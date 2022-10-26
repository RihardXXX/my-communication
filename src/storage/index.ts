import { Storage } from '@ionic/storage';
// имитация работы локалсториджа на уровне мобильного устройства
const storage = new Storage();
const localStorage = (async () => await storage.create())();

export default localStorage;
