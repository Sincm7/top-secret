import { useState } from "react";
import { Shield, Check, Star } from "lucide-react";

const PLANS = [
  {
    key: "starter",
    name: "Starter",
    monthly: 12,
    features: [
      "Temel Chat ve Tasks",
      "Sınırlı proje sayısı",
      "Topluluk desteği",
      "Light/Dark tema",
      "Temel raporlar",
    ],
  },
  {
    key: "pro",
    name: "Pro",
    monthly: 20,
    popular: true, // En Çok Tercih Edilen
    features: [
      "Tüm Chat/Tasks/Apps",
      "Sınırsız proje",
      "Öncelikli destek",
      "Gelişmiş raporlar",
      "Takım roller & izinler",
      "Özel görünüm (glass/aurora)",
    ],
  },
  {
    key: "enterprise",
    name: "Enterprise",
    monthly: 200,
    features: [
      "Kurumsal SSO",
      "Denetim kayıtları",
      "Özel SLA",
      "Gelişmiş güvenlik",
      "Özel entegrasyonlar",
      "Ayrılmış kaynaklar",
    ],
  },
];

export default function PricingPage() {
  const [billing, setBilling] = useState("monthly"); // 'monthly' | 'yearly'
  const isYearly = billing === "yearly";

  const priceLabel = (m) => {
    const value = isYearly ? m * 10 : m;
    const suffix = isYearly ? "/year" : "/month";
    return `$${value}${suffix}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
      {/* Aurora Background */}
      <div className="aurora-bg" />
      <div className="noise-overlay" />
      
      {/* Top Secret Header */}
      <div className="absolute top-6 left-6 z-10">
        <div className="glass rounded-2xl px-4 py-2 flex items-center gap-2">
          <Shield className="h-5 w-5 text-blue-500" />
          <span className="font-semibold text-lg">Top Secret</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl">
        {/* Header */}
        <section className="text-center mb-12">
          <h1 className="text-3xl font-bold mb-4">Fiyatlandırma</h1>
          <p className="text-lg opacity-80 mb-8 max-w-2xl mx-auto">
            Aylık veya yıllık ödeme arasında seçim yapın. Yıllık ücretler, aylık ücretin 10 katıdır.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center rounded-2xl border border-gray-200 dark:border-gray-700 p-1 glass">
            <button
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                !isYearly 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-glow" 
                  : "opacity-70 hover:opacity-100 hover:scale-105"
              }`}
              onClick={() => setBilling("monthly")}
            >
              Aylık
            </button>
            <button
              className={`px-6 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                isYearly 
                  ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-glow" 
                  : "opacity-70 hover:opacity-100 hover:scale-105"
              }`}
              onClick={() => setBilling("yearly")}
            >
              Yıllık (×10)
            </button>
          </div>
        </section>

        {/* Plans Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PLANS.map((p) => (
            <article
              key={p.key}
              className={`glass relative rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-glow ${
                p.popular ? "ring-2 ring-blue-500/30" : ""
              }`}
            >
              {p.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-1.5 text-xs font-medium text-white shadow-lg backdrop-blur">
                  <div className="flex items-center gap-1">
                    <Star className="h-3 w-3" />
                    En Çok Tercih Edilen
                  </div>
                </div>
              )}
              
              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2">{p.name}</h3>
                <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {priceLabel(p.monthly)}
                </div>
              </div>

              <ul className="space-y-3 mb-8">
                {p.features.map((f) => (
                  <li key={f} className="flex items-start gap-3">
                    <Check className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm opacity-90 leading-relaxed">{f}</span>
                  </li>
                ))}
              </ul>

              <button
                onClick={() => alert("Bir sorun oluştu")}
                className={`w-full rounded-xl px-6 py-3 font-medium transition-all duration-200 hover:scale-[1.02] hover:shadow-glow active:scale-[0.98] focus-visible:ring-2 focus-visible:ring-white/30 ${
                  p.popular
                    ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white"
                    : "glass border border-gray-200 dark:border-gray-700 hover:bg-white/5"
                }`}
              >
                Satın Al
              </button>
            </article>
          ))}
        </div>

        {/* FAQ Section */}
        <section className="mt-16 text-center">
          <h2 className="text-xl font-semibold mb-4">Sık Sorulan Sorular</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-4xl mx-auto">
            <div className="glass rounded-xl p-4 text-left">
              <h3 className="font-medium mb-2">Ödeme yöntemleri nelerdir?</h3>
              <p className="text-sm opacity-80">Kredi kartı, banka kartı ve PayPal ile ödeme yapabilirsiniz.</p>
            </div>
            <div className="glass rounded-xl p-4 text-left">
              <h3 className="font-medium mb-2">İptal edebilir miyim?</h3>
              <p className="text-sm opacity-80">Evet, istediğiniz zaman aboneliğinizi iptal edebilirsiniz.</p>
            </div>
            <div className="glass rounded-xl p-4 text-left">
              <h3 className="font-medium mb-2">Teknik destek var mı?</h3>
              <p className="text-sm opacity-80">Pro ve Enterprise planlarında öncelikli teknik destek sunuyoruz.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
