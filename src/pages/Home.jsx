import { useEffect, useState } from "react";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

const fallbackProducts = [
  {
    _id: "fallback-1",
    name: "Rose Hydration Serum",
    description: "Deeply nourishes skin with rosewater and hyaluronic glow care.",
    price: 38,
    image:
      "https://images.unsplash.com/photo-1617897903246-719242758050?auto=format&fit=crop&w=900&q=80",
  },
  {
    _id: "fallback-2",
    name: "Rose Quartz Face Roller",
    description: "Cooling roller to massage skin and help reduce morning puffiness.",
    price: 22,
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?auto=format&fit=crop&w=900&q=80",
  },
  {
    _id: "fallback-3",
    name: "Mini Eyeshadow Quad",
    description: "Four blendable shades for soft daytime looks or smoky evening eyes.",
    price: 27,
    image:
      "https://images.unsplash.com/photo-1570172619644-d06303a4de37?auto=format&fit=crop&w=900&q=80",
  },
  {
    _id: "fallback-4",
    name: "Blush Bloom Palette",
    description: "Blendable blush palette designed for warm and cool undertones.",
    price: 32,
    image:
      "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
  },
  {
    _id: "fallback-5",
    name: "Luminous Highlighter Duo",
    description: "Pearl and champagne highlighters for a smooth luminous glow.",
    price: 29,
    image:
      "https://images.unsplash.com/photo-1596462502278-27bfdc403348?auto=format&fit=crop&w=900&q=80",
  },
  {
    _id: "fallback-6",
    name: "Botanical Cleansing Foam",
    description: "Gentle cleanser with botanical extracts for fresh and balanced skin.",
    price: 24,
    image:
      "https://images.unsplash.com/photo-1625772452859-1c03d5bf1137?auto=format&fit=crop&w=900&q=80",
  },
];

const heroSlides = [
  {
    id: "hero-1",
    tag: "New Seasonal Collection",
    title: "Premium skincare and beauty for your daily glow ritual.",
    description:
      "Discover curated cosmetics designed to keep your look fresh, elegant, and effortless all day.",
    gradient: "from-pink-300 via-pink-200 to-rose-200",
  },
  {
    id: "hero-2",
    tag: "Limited Offer",
    title: "Buy 2 lip essentials and get 1 blush mini free.",
    description:
      "Create complete soft-glam looks with matching shades designed for everyday wear.",
    gradient: "from-rose-300 via-pink-200 to-pink-100",
  },
  {
    id: "hero-3",
    tag: "Beauty Club",
    title: "Join our glow community and unlock member-only deals.",
    description:
      "Get early access to fresh drops, skincare routines, and curated weekly bundles.",
    gradient: "from-pink-200 via-rose-100 to-orange-100",
  },
];

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeSlide, setActiveSlide] = useState(0);
  const [isSliding, setIsSliding] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        setProducts(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load products.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const slideInterval = setInterval(() => {
      setIsSliding(true);
      setActiveSlide((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(slideInterval);
  }, []);

  const displayProducts = products.length > 0 ? products : fallbackProducts;

  return (
    <div className="space-y-10">
      <section className="relative overflow-hidden rounded-3xl shadow-[0_10px_35px_rgba(244,114,182,0.20)]">
        <div
          className={`flex ${isSliding ? "transition-transform duration-700 ease-in-out" : ""}`}
          style={{ transform: `translateX(-${activeSlide * 100}%)` }}
          onTransitionEnd={() => {
            if (activeSlide === heroSlides.length) {
              setIsSliding(false);
              setActiveSlide(0);
            }
          }}
        >
          {[...heroSlides, heroSlides[0]].map((slide, index) => (
            <article
              key={`${slide.id}-${index}`}
              className={`relative w-full shrink-0 bg-gradient-to-r ${slide.gradient} px-6 py-20 sm:px-10`}
            >
              <div className="absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/30 blur-xl" />
              <div className="absolute -bottom-20 -left-10 h-72 w-72 rounded-full bg-pink-300/30 blur-xl" />
              <div className="relative max-w-3xl">
                <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-rose-500">
                  {slide.tag}
                </p>
                <h1 className="text-4xl font-extrabold leading-tight text-rose-900 sm:text-5xl">
                  {slide.title}
                </h1>
                <p className="mt-4 max-w-2xl text-base text-rose-600 sm:text-lg">
                  {slide.description}
                </p>
              </div>
            </article>
          ))}
        </div>
        <div className="absolute bottom-5 left-1/2 flex -translate-x-1/2 gap-2">
          {heroSlides.map((slide, index) => (
            <div
              key={slide.id}
              className={`h-2.5 rounded-full transition ${
                activeSlide % heroSlides.length === index ? "w-7 bg-pink-500" : "w-2.5 bg-pink-200"
              }`}
            />
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-pink-100 bg-white/75 p-5 shadow-[0_8px_28px_rgba(244,114,182,0.08)] sm:p-7">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-3xl font-bold text-rose-900 sm:text-4xl">Featured Products</h2>
          <p className="rounded-full bg-pink-100 px-4 py-2 text-sm font-semibold text-rose-500">
            {displayProducts.length} products available
          </p>
        </div>

        {loading && <p className="rounded-xl bg-pink-50 p-6 text-rose-500">Loading products...</p>}
        {error && <p className="rounded-xl bg-rose-50 p-6 text-rose-600">{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {displayProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}