// src/data-source.ts
import 'dotenv/config'; // <-- automatically loads .env
import { DataSource } from 'typeorm';
import {
  Product,
  Address,
  Contact,
  User,
  PaymentMethod,
  Inventory,
  Payment,
  ShippingAddress,
  Category,
  Setting,
  Order,
  OrderItem,
} from './entities';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: +(process.env.DB_PORT || 3306), //+ is a numary operator to change value from string to number like Number()
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'ecommerce',
  entities: [
    Category,
    User,
    Address,
    PaymentMethod,
    Product,
    Inventory,
    Order,
    OrderItem,
    Contact,
    Payment,
    ShippingAddress,
    Setting,
  ],
  synchronize: true, // DEV only: auto-create tables. Disable in production.
  logging: false,
});
