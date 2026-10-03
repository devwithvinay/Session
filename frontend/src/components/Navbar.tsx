export default function Navbar(){
    return (
      <div>
        <nav className="mx-4 mt-6 flex items-center justify-between rounded-full border bg-white px-6 py-3 shadow-sm md:mx-auto md:max-w-6xl">
          <div className="text-xl font-semibold tracking-tight">Session</div>
          <div className="flex items-center gap-8 text-sm text-gray-600">
            <a href="#home" className="transition-colors hover:text-black">
              Home
            </a>
            <a href="#stats" className="transition-colors hover:text-black">
              Stats
            </a>
            <a href="#features" className="transition-colors hover:text-black">
              Features
            </a>
            <a href="#preview" className="transition-colors hover:text-black">
              Preview
            </a>
            <a href="#about" className="transition-colors hover:text-black">
              About
            </a>
          </div>
          <button className="rounded-full bg-black px-5 py-2 text-sm font-medium text-white">
            Login
          </button>
        </nav>
      </div>
    );
}