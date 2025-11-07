import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="py-8 md:py-12 ">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 container px-4  md:px-6 mx-auto">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Shop</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="/products"
                className="text-muted-foreground hover:text-foreground"
              >
                All Products
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Featured
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                New Arrivals
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Sale
              </Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Company</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                About Us
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Careers
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Press
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Affiliates
              </Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Support</h3>
            <nav className="flex flex-col space-y-2">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Contact Us
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                FAQs
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Shipping
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                Returns
              </Link>
            </nav>
          </div>
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Connect</h3>
            <div className="flex space-x-4">
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link
                href="#"
                className="text-muted-foreground hover:text-foreground"
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">
                Subscribe to our newsletter
              </h4>
              <form className="flex space-x-2">
                <input
                  type="email"
                  placeholder="Email"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <button className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                  Subscribe
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} ShopNow. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
