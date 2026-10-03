
export default function Footer() {
  return (
    <footer className="border-t bg-white">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-12 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="text-xl font-semibold tracking-tight">
              Session
            </div>

            <p className="mt-4 max-w-sm text-sm leading-6 text-gray-500">
              A simple productivity workspace to help you focus,
              manage your time, and make meaningful progress every day.
            </p>

            <div className="mt-6 flex gap-3">
              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-black"
              >
                X
              </a>

              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-black"
              >
                in
              </a>

              <a
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-full border text-sm text-gray-600 transition-colors hover:bg-gray-100 hover:text-black"
              >
                GH
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-sm font-semibold">
              Product
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-500">
              <a href="#features" className="hover:text-black">
                Features
              </a>

              <a href="#stats" className="hover:text-black">
                Stats
              </a>

              <a href="#preview" className="hover:text-black">
                Preview
              </a>

              <a href="#" className="hover:text-black">
                Pricing
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-sm font-semibold">
              Company
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-500">
              <a href="#about" className="hover:text-black">
                About
              </a>

              <a href="#" className="hover:text-black">
                Blog
              </a>

              <a href="#" className="hover:text-black">
                Contact
              </a>

              <a href="#" className="hover:text-black">
                Careers
              </a>
            </div>
          </div>

          {/* Resources */}
          <div>
            <h3 className="text-sm font-semibold">
              Resources
            </h3>

            <div className="mt-4 flex flex-col gap-3 text-sm text-gray-500">
              <a href="#" className="hover:text-black">
                Documentation
              </a>

              <a href="#" className="hover:text-black">
                Help Center
              </a>

              <a href="#" className="hover:text-black">
                Privacy
              </a>

              <a href="#" className="hover:text-black">
                Terms
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-16 flex flex-col gap-4 border-t pt-6 text-sm text-gray-500 md:flex-row md:items-center md:justify-between">
          <p>
            © 2026 Session. All rights reserved.
          </p>

          <p>
            Built for better focus.
          </p>
        </div>
      </div>
    </footer>
  );
}

