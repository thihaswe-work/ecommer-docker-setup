import { SeederService } from './seeder/seeder.service';

async function main() {
  const seeder = new SeederService();
  try {
    await seeder.seed();
    console.log('✅ Seeding completed via CLI');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed via CLI:', err);
    process.exit(1);
  }
}

main();
