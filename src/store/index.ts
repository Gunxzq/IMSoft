// 发请求，存数据都在store中
import { createPinia } from 'pinia';
export * from './modules/userInfo';
export * from './modules/connection';
export * from './modules/contacts';
export * from './modules/globalMenu';
export * from './modules/message';
export * from './modules/groups';
export * from './modules/upload';
export * from './modules/users';

let Pinia = createPinia();

export default Pinia;
