import { Setting } from '@/entities';
import { Category } from '@/entities/category.entity';
import { Injectable } from '@nestjs/common';
import { AppDataSource } from 'src/data-source';
import { Address } from 'src/entities/address.entity';
import { Contact } from 'src/entities/contact.entity';
import { Inventory } from 'src/entities/inventory.entity';
import { Order } from 'src/entities/order.entity';
import { OrderItem } from 'src/entities/orderItem.entity';
import { PaymentMethod } from 'src/entities/payment-method.entity';
import { Payment } from 'src/entities/payment.entity';
import { Product } from 'src/entities/product.entity';
import { ShippingAddress } from 'src/entities/shipping-address.entity';
import { User } from 'src/entities/user.entity';

const categories = [
  { id: 1, name: 'Electronics', image: '/categories/electronics.jpg' },
  { id: 2, name: 'Fashion', image: '/categories/fashion.jpg' },
  { id: 3, name: 'Home & Living', image: '/categories/home.jpg' },
  { id: 4, name: 'Sports', image: '/categories/sports.jpg' },
];
const products = [
  {
    name: 'Gaming Laptop',
    desc: 'High performance laptop for gaming',
    image: 'https://images.unsplash.com/photo-1593642532973-d31b6557fa68',
    price: 1200,
    quantity: 50,
  },
  {
    name: 'Wireless Mouse',
    desc: 'Ergonomic wireless mouse',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3',
    price: 30,
    quantity: 100,
  },
  {
    name: 'Mechanical Keyboard',
    desc: 'RGB mechanical keyboard',
    image:
      'https://images.unsplash.com/photo-1619683322755-4545503f1afa?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1074',
    price: 80,
    quantity: 40,
  },
  {
    name: 'Gaming Headset',
    desc: 'Surround sound gaming headset',
    image:
      'https://plus.unsplash.com/premium_photo-1679177184017-7777cdbb2ba5?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1170',
    price: 100,
    quantity: 30,
  },
  {
    name: 'External SSD 1TB',
    desc: 'Portable high-speed SSD',
    image:
      'https://media.istockphoto.com/id/1167762639/photo/external-compact-ssd-drive-with-usb-cable-for-writing-reading-and-storing-data-on-a-white.webp?a=1&b=1&s=612x612&w=0&k=20&c=ZU4V_sMJuEh2vUglN-evORoi90oLPJ-a7BXx4nS89SM=',
    price: 150,
    quantity: 25,
  },
  {
    name: 'Webcam HD',
    desc: '1080p HD webcam for streaming',
    image: '',
    price: 70,
    quantity: 35,
  },
  {
    name: 'Smartphone 128GB',
    desc: 'Latest smartphone with high-res camera',
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9',
    price: 800,
    quantity: 60,
  },
  {
    name: 'Tablet 10 inch',
    desc: 'High resolution display tablet',
    image: '',
    price: 300,
    quantity: 40,
  },
  {
    name: 'Bluetooth Speaker',
    desc: 'Portable wireless speaker',
    image: 'https://images.unsplash.com/photo-1517433456452-f9633a875f6f',
    price: 50,
    quantity: 80,
  },
  {
    name: 'Fitness Watch',
    desc: 'Track your workouts and health',
    image: 'products/fitness-tracker.jpg',
    price: 120,
    quantity: 45,
  },
  {
    name: 'Wireless Headphones',
    desc: 'Premium noise-cancelling wireless headphones with 30-hour battery life.',
    image: '/products/wireless-headphones.jpg',
    price: 200,
    quantity: 30,
  },
  {
    name: 'Smart Watch',
    desc: 'Track your fitness, receive notifications, and more with this sleek smart watch.',
    image: '/products/smart-watch.jpg',
    price: 250,
    quantity: 40,
  },
  {
    name: 'Portable Bluetooth Speaker',
    desc: 'Waterproof portable speaker with 360° sound and 24-hour battery life.',
    image: '/products/bluetooth-speaker.jpg',
    price: 80,
    quantity: 50,
  },
  {
    name: 'Laptop Backpack',
    desc: 'Durable, water-resistant backpack with padded laptop compartment and USB charging port.',
    image: '/products/laptop-backpack.jpg',
    price: 60,
    quantity: 70,
  },
  {
    name: 'Wireless Charging Pad',
    desc: 'Fast wireless charging for all Qi-enabled devices.',
    image: '/products/wireless-charging-pad.jpg',
    price: 40,
    quantity: 100,
  },
  {
    name: 'Mechanical Keyboard',
    desc: 'RGB backlit mechanical keyboard with customizable keys and tactile feedback.',
    image: '/products/mechanical-keyboard.jpg',
    price: 90,
    quantity: 35,
  },
  {
    name: 'Ultra HD Monitor',
    desc: '27-inch 4K monitor with HDR support and adjustable stand.',
    image: '/products/uhd-monitor.jpg',
    price: 350,
    quantity: 25,
  },
  {
    name: 'Wireless Mouse',
    desc: 'Ergonomic wireless mouse with adjustable DPI and long battery life.',
    image: '/products/wireless-mouse.jpg',
    price: 35,
    quantity: 100,
  },
  {
    name: 'Gaming Chair',
    desc: 'Ergonomic gaming chair with lumbar support and adjustable armrests.',
    image: '/products/gaming-chair.jpg',
    price: 180,
    quantity: 20,
  },
  {
    name: 'Webcam HD',
    desc: '1080p HD webcam with auto-focus and built-in microphone for video calls.',
    image: '/products/webcam-hd.jpg',
    price: 75,
    quantity: 40,
  },
  {
    name: 'Tablet Stand',
    desc: 'Adjustable aluminum tablet stand compatible with all tablet sizes.',
    image: '/products/tablet-stand.jpg',
    price: 25,
    quantity: 60,
  },
  {
    name: 'USB-C Hub',
    desc: '7-in-1 USB-C hub with HDMI, USB 3.0, and SD card reader.',
    image: '/products/usb-c-hub.jpg',
    price: 35,
    quantity: 50,
  },
  {
    name: 'Desk Lamp LED',
    desc: 'Adjustable LED desk lamp with touch control and wireless charging base.',
    image: '/products/desk-lamp-led.jpg',
    price: 45,
    quantity: 40,
  },
  {
    name: 'Phone Case',
    desc: 'Protective phone case with military-grade drop protection and wireless charging support.',
    image: '/products/phone-case.jpg',
    price: 20,
    quantity: 100,
  },
  {
    name: 'Portable SSD',
    desc: '1TB portable SSD with USB-C connectivity and 540MB/s transfer speeds.',
    image: '/products/portable-ssd.jpg',
    price: 160,
    quantity: 30,
  },
  {
    name: 'Fitness Tracker',
    desc: 'Water-resistant fitness tracker with heart rate monitor and 7-day battery life.',
    image: '/products/fitness-tracker.jpg',
    price: 100,
    quantity: 50,
  },
  {
    name: 'Noise Cancelling Earbuds',
    desc: 'Compact earbuds with active noise cancellation.',
    image: '/products/earbuds.jpg',
    price: 120,
    quantity: 60,
  },
  {
    name: '4K Action Camera',
    desc: 'Waterproof action camera with 4K recording.',
    image: '/products/action-camera.jpg',
    price: 180,
    quantity: 25,
  },
  {
    name: 'Smart Light Bulb',
    desc: 'WiFi-enabled smart light bulb with RGB colors.',
    image: '/products/smart-light-bulb.jpg',
    price: 25,
    quantity: 80,
  },
  {
    name: 'Electric Toothbrush',
    desc: 'Rechargeable toothbrush with multiple modes.',
    image: '/products/electric-toothbrush.jpg',
    price: 60,
    quantity: 40,
  },
  {
    name: 'Portable Projector',
    desc: 'Mini projector for movies and presentations.',
    image: '/products/portable-projector.jpg',
    price: 220,
    quantity: 15,
  },
  {
    name: 'Smart Thermostat',
    desc: 'Control your home temperature remotely.',
    image: '/products/smart-thermostat.jpg',
    price: 200,
    quantity: 20,
  },
  {
    name: 'VR Headset',
    desc: 'Immersive virtual reality headset for gaming.',
    image: '/products/vr-headset.jpg',
    price: 400,
    quantity: 10,
  },
  {
    name: 'Laptop Cooling Pad',
    desc: 'Keeps your laptop cool during heavy use.',
    image: '/products/laptop-cooling-pad.jpg',
    price: 35,
    quantity: 50,
  },
  {
    name: 'Portable Charger 20000mAh',
    desc: 'High-capacity power bank for smartphones and tablets.',
    image: '/products/portable-charger.jpg',
    price: 50,
    quantity: 70,
  },
  {
    name: 'Smart Door Lock',
    desc: 'Keyless entry smart door lock with app control.',
    image: '/products/smart-door-lock.jpg',
    price: 180,
    quantity: 15,
  },
  {
    name: 'Noise Cancelling Headphones',
    desc: 'Over-ear headphones with deep bass and ANC.',
    image: '/products/noise-cancelling-headphones.jpg',
    price: 250,
    quantity: 30,
  },
  {
    name: 'Wireless Game Controller',
    desc: 'Ergonomic controller compatible with PC and consoles.',
    image: '/products/wireless-controller.jpg',
    price: 60,
    quantity: 45,
  },
  {
    name: 'Smart Coffee Maker',
    desc: 'Brew coffee remotely with your smartphone.',
    image: '/products/smart-coffee-maker.jpg',
    price: 150,
    quantity: 25,
  },
  {
    name: 'Electric Scooter',
    desc: 'Foldable electric scooter with 20km range.',
    image: '/products/electric-scooter.jpg',
    price: 500,
    quantity: 12,
  },
  {
    name: 'Smart Water Bottle',
    desc: 'Tracks your hydration and syncs with an app.',
    image: '/products/smart-water-bottle.jpg',
    price: 35,
    quantity: 40,
  },
  {
    name: 'Digital Photo Frame',
    desc: 'Display your favorite photos with a digital frame.',
    image: '/products/digital-photo-frame.jpg',
    price: 80,
    quantity: 20,
  },
  {
    name: 'Bluetooth Car Adapter',
    desc: 'Stream music and make calls via your car stereo.',
    image: '/products/bluetooth-car-adapter.jpg',
    price: 25,
    quantity: 60,
  },
  {
    name: 'Smart Scale',
    desc: 'Track weight, BMI, and body composition.',
    image: '/products/smart-scale.jpg',
    price: 60,
    quantity: 35,
  },
  {
    name: 'Gaming Desk Mat',
    desc: 'Extra-large mouse pad for gaming and work.',
    image: '/products/gaming-desk-mat.jpg',
    price: 40,
    quantity: 50,
  },
  {
    name: 'LED Strip Lights',
    desc: 'Color-changing LED strips with remote control.',
    image: '/products/led-strip-lights.jpg',
    price: 30,
    quantity: 70,
  },
];
@Injectable()
export class SeederService {
  async seed() {
    await AppDataSource.initialize();
    // DEV only: wipe everything
    await AppDataSource.dropDatabase();
    await AppDataSource.synchronize();

    const userRepo = AppDataSource.getRepository(User);
    const addressRepo = AppDataSource.getRepository(Address);
    const paymentMethodRepo = AppDataSource.getRepository(PaymentMethod);
    const productRepo = AppDataSource.getRepository(Product);
    const inventoryRepo = AppDataSource.getRepository(Inventory);
    const orderRepo = AppDataSource.getRepository(Order);
    const orderItemRepo = AppDataSource.getRepository(OrderItem);
    const contactRepo = AppDataSource.getRepository(Contact);
    const paymentRepo = AppDataSource.getRepository(Payment);
    const shippingRepo = AppDataSource.getRepository(ShippingAddress);
    const categoryRepo = AppDataSource.getRepository(Category);
    const settingRepo = AppDataSource.getRepository(Setting);

    // ------------settingRepo------------

    const setting = settingRepo.create({
      underMaintenance: false,
    });

    await settingRepo.save(setting);

    // ---------- USERS ----------

    const admin = userRepo.create({
      firstName: 'John',
      lastName: 'Doe',
      email: 'admin@passiongeek.com',
      password: 'admin123',
      role: 'admin',
    });
    await userRepo.save(admin);

    const users: User[] = [];
    for (let i = 1; i <= 3; i++) {
      const u = userRepo.create({
        firstName: `User${i}`,
        lastName: `Test${i}`,
        email: `user${i}@example.com`,
        password: `password`,
        role: 'user',
      });
      await userRepo.save(u);

      // Each user has an address
      const addr = addressRepo.create({
        addressName: 'Home',
        address: `${i} Main St`,
        city: 'CityX',
        state: 'StateY',
        country: 'CountryZ',
        postalCode: `1000${i}`,
        isDefault: true,
        user: u,
      });
      await addressRepo.save(addr);

      // Each user has a payment method
      const pm = paymentMethodRepo.create({
        cardName: 'Visa',
        type: 'card',
        number: `411111111111111${i}`, // string
        numberLast4: `111${i}`, // string
        expiryMonth: 12,
        expiryYear: 2030,
        holderName: `${u.firstName} ${u.lastName}`,
        isDefault: true,
        user: u,
      });

      await paymentMethodRepo.save(pm);

      users.push(u);
    }

    // ----------category-----------
    for (const c of categories) {
      const category = categoryRepo.create({
        name: c.name,
        image: c.image,
      });
      await categoryRepo.save(category);
    }
    // Fetch all categories after saving so we can assign randomly
    const allCategories = await categoryRepo.find();

    // ---------- PRODUCTS ----------
    for (const p of products) {
      const inventory = inventoryRepo.create({
        price: p.price, // correct place for price
        stock: p.quantity || 0,
      });
      await inventoryRepo.save(inventory);

      // Pick a random category
      const randomCategory =
        allCategories[Math.floor(Math.random() * allCategories.length)];

      const product = productRepo.create({
        category: randomCategory,
        name: p.name,
        desc: p.desc, // make sure your entity has this column
        image: p.image,
        inventory, // link inventory
      });

      await productRepo.save(product);
    }

    // ---------- ORDERS ----------
    let guestCounter = 1;
    async function createOrder(user?: User) {
      const customerId = user ? user.id : `guest_${guestCounter}`;

      // Contact
      const contact = contactRepo.create({
        firstName: user ? user.firstName : `Guest_${guestCounter}`,
        lastName: user ? user.lastName : `Account`,
        email: user ? user.email : `guest${guestCounter}@example.com`,
        phone: (1000000000 + guestCounter).toString(),
      });
      await contactRepo.save(contact);

      if (!user) guestCounter++;

      // Payment (initially zero, will update after calculating total)
      const payment = paymentRepo.create({
        number: `411111111111111`,
        cardName: 'Visa',
        holderName: user ? user.firstName : `Guest_${guestCounter}`,
        amount: 0,
        paymentType: 'card',
      });
      await paymentRepo.save(payment);

      // Shipping
      const shipping = shippingRepo.create({
        address: user ? `${user.firstName} Street` : `Guest_${guestCounter} St`,
        city: 'CityX',
        state: 'StateY',
        country: 'CountryZ',
        postalCode: '10001',
      });
      await shippingRepo.save(shipping);

      // Fetch all products with inventory
      const allProducts = await productRepo.find({ relations: ['inventory'] });

      // Pick random 1-3 products for this order
      const numberOfItems = 1 + Math.floor(Math.random() * 3); // 1,2,3 items
      const chosenProducts: Product[] = [];

      while (chosenProducts.length < numberOfItems) {
        const randomIndex = Math.floor(Math.random() * allProducts.length);
        const randomProduct = allProducts[randomIndex];

        // avoid duplicates
        if (!chosenProducts.includes(randomProduct)) {
          chosenProducts.push(randomProduct);
        }
      }

      // Calculate totals
      let subtotal = 0;
      const orderItems: OrderItem[] = [];

      for (const product of chosenProducts) {
        const quantity = 1 + Math.floor(Math.random() * 2); // 1 or 2
        subtotal += product.inventory.price * quantity;

        const orderItem = orderItemRepo.create({
          productName: product.name,
          productImage: product.image,
          quantity,
          price: product.inventory.price,
          order: null, // will assign after creating order
          productId: product.id,
          product,
        });
        orderItems.push(orderItem);
      }

      const shippingFee = 10;
      const total = subtotal + shippingFee;

      payment.amount = total;
      await paymentRepo.save(payment);

      // Create order
      const order = new Order();
      order.customerId = customerId;
      order.subtotal = subtotal;
      order.shipping = shippingFee;
      order.total = total;
      order.status = 'pending';
      order.contact = contact;
      order.payment = payment;
      order.shippingAddress = shipping;
      await orderRepo.save(order);

      // Save order items with the correct order reference
      for (const item of orderItems) {
        item.order = order;
        await orderItemRepo.save(item);
      }

      if (!user) guestCounter++;
    }

    // Create 2 orders for users (user1, user2)
    await createOrder(users[0]);
    await createOrder(users[1]);

    // Create 2 guest orders
    await createOrder();
    await createOrder();

    console.log(
      '✅ Seeding with 3 users ,1 admin , 2 user orders, 2 guest orders completed!',
    );

    await AppDataSource.destroy();
    process.exit(0);
  }
}
