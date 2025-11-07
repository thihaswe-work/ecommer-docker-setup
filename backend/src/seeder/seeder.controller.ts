import { Controller, Get } from "@nestjs/common";
import { SeederService } from "./seeder.service";

@Controller("seed")
export class SeederController {
  constructor(private readonly seederService: SeederService) {}

  @Get()
  async seed() {
    try {
      await this.seederService.seed();
      return { message: "✅ Database seeded successfully" };
    } catch (err) {
      console.error(err);
      return { message: "❌ Seeding failed", error: err.message };
    }
  }
}
