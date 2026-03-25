import Link from "next/link"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* Navbar */}
      <header className="sticky top-0 z-50 h-[60px] flex items-center px-4 sm:px-8" style={{ background: "#131921" }}>
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: "#FF9900" }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#131921">
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
              </svg>
            </div>
            <span className="font-bold text-white tracking-tight">StoreHubBD</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <a href="#how-it-works" className="text-sm font-medium text-gray-300 hover:text-white transition">How it works</a>
            <a href="#features" className="text-sm font-medium text-gray-300 hover:text-white transition">Features</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm font-medium text-gray-300 hover:text-white transition">
              Sign In
            </Link>
            <Link
              href="/register"
              className="text-sm font-bold px-4 py-2 rounded text-gray-900 hover:brightness-95 transition-all"
              style={{ background: "#FF9900" }}
            >
              Start Free →
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 pb-20">
          <div className="lg:grid lg:grid-cols-2 lg:gap-16 lg:items-center">
            {/* Left */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 border border-gray-200 rounded-full px-4 py-1.5 text-xs font-semibold text-gray-600 mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                Free for small stores · No credit card needed
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-gray-900 leading-tight tracking-tight">
                Your Facebook Store,
                <br />
                <span style={{ color: "#FF9900" }}>Finally</span> Organized.
              </h1>

              <p className="mt-5 text-base sm:text-lg text-gray-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Turn DMs and comments into real orders. Give every customer a checkout link.
                Get SMS alerts automatically. Track everything in one dashboard.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
                <Link
                  href="/register"
                  className="w-full sm:w-auto text-gray-900 px-8 py-3.5 rounded font-bold text-base hover:brightness-95 active:scale-[0.98] transition-all shadow-md"
                  style={{ background: "#FFD814", border: "1px solid #FCD200" }}
                >
                  Create Your Free Store →
                </Link>
                <Link
                  href="/login"
                  className="w-full sm:w-auto bg-white border border-gray-300 text-gray-700 px-8 py-3.5 rounded font-semibold text-base hover:bg-gray-50 transition-all"
                >
                  Sign In
                </Link>
              </div>

              <p className="mt-4 text-xs text-gray-400">
                No credit card. Free forever for small stores.
              </p>
            </div>

            {/* Right — Browser mockup */}
            <div className="hidden lg:flex items-center justify-center mt-0">
              <div className="w-full max-w-lg rounded-lg shadow-2xl border border-gray-200 overflow-hidden">
                {/* Browser bar */}
                <div className="border-b border-gray-200 px-4 py-2.5 flex items-center gap-3" style={{ background: "#f0f2f2" }}>
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400"/>
                    <div className="w-3 h-3 rounded-full bg-amber-400"/>
                    <div className="w-3 h-3 rounded-full bg-green-400"/>
                  </div>
                  <div className="flex-1 bg-white rounded px-3 py-1 text-xs text-gray-400 text-center border border-gray-200">
                    mystore.storehubbd.com/dashboard
                  </div>
                </div>
                {/* Fake dashboard */}
                <div style={{ background: "#f0f2f2" }} className="p-4">
                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[{n:"24",l:"Total"},{n:"8",l:"Pending"},{n:"12",l:"Shipped"},{n:"৳18k",l:"Revenue"}].map(s => (
                      <div key={s.l} className="bg-white rounded border border-gray-200 p-2">
                        <p className="text-base font-extrabold text-gray-900">{s.n}</p>
                        <p className="text-[10px] text-gray-400">{s.l}</p>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white rounded border border-gray-200 overflow-hidden">
                    <div className="px-3 py-2 border-b border-gray-100 flex justify-between items-center" style={{ background: "#131921" }}>
                      <span className="text-xs font-bold text-white">Recent Orders</span>
                      <span className="text-[10px]" style={{ color: "#FF9900" }}>View all</span>
                    </div>
                    {[
                      {code:"ARJ-0042",name:"Rahim Uddin",amount:"৳850",status:"pending",color:"#FF9900"},
                      {code:"ARJ-0041",name:"Fatema Khatun",amount:"৳1,200",status:"shipped",color:"#007185"},
                      {code:"ARJ-0040",name:"Karim Ahmed",amount:"৳600",status:"delivered",color:"#007600"},
                    ].map(o => (
                      <div key={o.code} className="px-3 py-2 flex items-center justify-between border-b border-gray-50 last:border-0">
                        <div>
                          <span className="text-[11px] font-mono font-bold text-gray-800">{o.code}</span>
                          <p className="text-[10px] text-gray-500">{o.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-bold" style={{ color: "#B12704" }}>{o.amount}</span>
                          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-gray-100" style={{ color: o.color }}>{o.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social proof */}
      <section style={{ background: "#f0f2f2" }} className="border-y border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-8 text-center">
          <div className="flex -space-x-2">
            {["#131921","#FF9900","#B12704","#007185","#007600"].map((color, i) => (
              <div
                key={i}
                className="w-8 h-8 rounded-full ring-2 ring-white flex items-center justify-center text-white text-xs font-bold"
                style={{ backgroundColor: color }}
              >
                {["R","F","N","S","A"][i]}
              </div>
            ))}
          </div>
          <p className="text-sm text-gray-600">
            <span className="font-bold text-gray-900">500+</span> Facebook sellers in Bangladesh trust StoreHubBD
          </p>
          <div className="flex items-center gap-0.5" style={{ color: "#FF9900" }}>
            {"★★★★★".split("").map((s, i) => <span key={i} className="text-sm">{s}</span>)}
            <span className="text-xs text-gray-500 ml-1.5">5.0</span>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 sm:px-8 bg-white">
        <div className="max-w-7xl mx-auto text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Get started in minutes</h2>
          <p className="text-gray-500 mt-2 text-sm">Three simple steps to your professional store</p>
        </div>

        <div className="max-w-4xl mx-auto grid sm:grid-cols-3 gap-6 relative">
          {[
            {
              step: "01",
              title: "Register",
              desc: "Sign up with your store name. You get a shareable link instantly.",
              icon: (
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FF9900" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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
                <div className="hidden sm:block absolute top-10 right-0 translate-x-1/2 z-10 text-gray-300 text-xl font-light">→</div>
              )}
              <div className="bg-white rounded-lg border border-gray-200 p-8 text-center hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded flex items-center justify-center mx-auto mb-4" style={{ background: "#f0f2f2" }}>
                  {item.icon}
                </div>
                <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: "#FF9900" }}>{item.step}</p>
                <h3 className="text-base font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4 sm:px-8 border-t border-gray-100" style={{ background: "#f0f2f2" }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">Everything you need</h2>
            <p className="text-gray-500 mt-2 text-sm">Built specifically for Bangladeshi Facebook sellers</p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
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
              <div key={f.title} className="bg-white rounded-lg border border-gray-200 p-7 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-3">{f.icon}</div>
                <h3 className="font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-4 sm:px-8 py-16 bg-white">
        <div className="max-w-7xl mx-auto rounded-lg py-14 px-8 text-center" style={{ background: "#131921" }}>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white">
            Start your free store today
          </h2>
          <p className="mt-3 text-sm sm:text-base max-w-xl mx-auto" style={{ color: "#ccc" }}>
            Join hundreds of sellers already growing their business with StoreHubBD.
          </p>
          <Link
            href="/register"
            className="mt-8 inline-block text-gray-900 px-8 py-3.5 rounded font-bold text-base hover:brightness-95 active:scale-[0.98] transition-all"
            style={{ background: "#FFD814", border: "1px solid #FCD200" }}
          >
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 border-t border-gray-200" style={{ background: "#131921" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "#FF9900" }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#131921">
                <path d="M3 3h7v7H3zM14 3h7v7h-7zM3 14h7v7H3zM14 14h7v7h-7z" />
              </svg>
            </div>
            <span className="text-sm font-bold text-white">StoreHubBD</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/login" className="text-xs text-gray-500 hover:text-gray-300 transition">Sign In</Link>
            <Link href="/register" className="text-xs text-gray-500 hover:text-gray-300 transition">Register</Link>
          </div>
          <p className="text-xs text-gray-600">
            © {new Date().getFullYear()} StoreHubBD · Made for Bangladeshi sellers
          </p>
        </div>
      </footer>
    </div>
  )
}
