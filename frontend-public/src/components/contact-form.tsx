import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function ContactForm({ user }: { user: any }) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Contact Information</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 " id="contact-form">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input
            id="firstName"
            name="firstName"
            defaultValue={user?.firstName}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input
            id="lastName"
            name="lastName"
            defaultValue={user?.lastName}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            defaultValue={user?.email}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={user?.phone}
            required
          />
        </div>
      </div>
    </div>
  );
}
