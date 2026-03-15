import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 h-[60px] flex items-center px-4 sm:px-8">
        <div className="max-w-5xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
              </svg>
            </div>
            <span className="font-bold text-gray-900 tracking-tight">StoreHubBD</span>
          </div>
          <nav className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-600 hover:text-gray-900 transition">
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-indigo-700 active:scale-[0.98] transition-all"
            >
              Start Free →
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Radial glow */}
        <div className="absolute inset-0 flex items-start justify-center pointer-events-none">
          <div className="w-[600px] h-[400px] bg-indigo-100 rounded-full blur-3xl opacity-40 -translate-y-1/4" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-8 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-700 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
            Free for small stores · No credit card needed
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-[56px] font-extrabold text-gray-900 leading-tight tracking-tight">
            Your Facebook Store,
            <br />
            <span className="text-amber-500">Finally</span> Organized.
          </h1>

          <p className="mt-5 text-base sm:text-lg text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Turn DMs and comments into real orders. Give every customer a checkout link.
            Get SMS alerts automatically. Track everything in one place.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-indigo-600 text-white px-8 py-3.5 rounded-2xl font-bold text-base hover:bg-indigo-700 active:scale-[0.98] transition-all shadow-lg shadow-indigo-200"
            >
              Create Your Free Store →
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto bg-white border border-gray-200 text-gray-700 px-8 py-3.5 rounded-2xl font-semibold text-base hover:bg-gray-50 transition-all"
            >
              Sign In
            </Link>
          </div>

          <p className="mt-4 text-xs text-gray-400">
            No credit card. Free forever for small stores.
          </p>
        </div>
      </section>

      {/* Social Proof Strip */}
      <section className="bg-gray-50 border-y border-gray-100 py-4">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 text-center">
          {/* Avatars */}
          <div className="flex -space-x-2">
            {["#4F46E5", "#7C3AED", "#DB2777", "#D97706", "#059669"].map((color, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full ring-2 ring-white flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: color }}
              >
                {["R", "F", "N", "S", "A"][i]}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            <span className="font-bold text-gray-900">500+</span> Facebook sellers in Bangladesh trust StoreHubBD
          </p>
          <div className="flex items-center gap-1 text-amber-400">
            {"★★★★★".split("").map((s, i) => <span key={i} className="text-sm">{s}</span>)}
            <span className="text-xs text-gray-500 ml-1">5.0</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Get started in minutes</h2>
          <p className="text-gray-500 mt-2">Three simple steps to your professional store</p>
        </div>

        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 sm:gap-4 relative">
          {[
            {
              step: "01",
              title: "Register",
              desc: "Sign up with your store name. You get a shareable link instantly.",
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              ),
            },
            {
              step: "02",
              title: "Add Products",
              desc: "Upload products with photos, prices, and descriptions. Done in seconds.",
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <line x1="5" y1="12" x2="19" y2="12" />
                </svg>
              ),
            },
            {
              step: "03",
              title: "Share & Get Orders",
              desc: "Share your store link on Facebook. Customers order, you track everything.",
              icon: (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F59E0B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="18" cy="5" r="3" />
                  <circle cx="6" cy="12" r="3" />
                  <circle cx="18" cy="19" r="3" />
                  <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                  <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
                </svg>
              ),
            },
          ].map((item, i) => (
            <div key={i} className="relative">
              {i < 2 && (
                <div className="hidden sm:block absolute top-12 right-0 translate-x-1/2 z-10 text-gray-300 text-xl">
                  →
                </div>
              )}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center">
                <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  {item.icon}
                </div>
                <p className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-1">{item.step}</p>
                <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="bg-gray-50 py-20 px-4 sm:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Everything you need</h2>
            <p className="text-gray-500 mt-2">Built specifically for Bangladeshi Facebook sellers</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-5">
            {[
              {
                title: "Your own store link",
                desc: "Every store gets a clean link like arjha.storehubbd.com — share it anywhere.",
                icon: "🔗",
              },
              {
                title: "SMS order alerts",
                desc: "You and your customer both get SMS when an order is placed. No more missed orders.",
                icon: "📱",
              },
              {
                title: "Order tracking pipeline",
                desc: "Move orders from Pending → Confirmed → Shipped → Delivered with one click.",
                icon: "📦",
              },
            ].map((f) => (
              <div key={f.title} className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 sm:px-8 py-16">
        <div className="max-w-4xl mx-auto bg-indigo-600 rounded-3xl py-14 px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Start your free store today
          </h2>
          <p className="text-indigo-200 mt-2 text-sm">
            Join hundreds of sellers already growing their business.
          </p>
          <Link
            href="/register"
            className="mt-6 inline-block bg-white text-indigo-700 px-8 py-3.5 rounded-2xl font-bold text-base hover:bg-indigo-50 active:scale-[0.98] transition-all"
          >
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-gray-100">
        <p className="text-xs text-gray-400">
          © {new Date().getFullYear()} StoreHubBD · Made for Bangladeshi sellers
        </p>
      </footer>
    </div>
  )
}
