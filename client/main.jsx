import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  Search,
  ShoppingBag,
  User,
  Plus,
  Minus,
  X,
  ChevronRight,
  Clock3,
  MapPin,
  ShieldCheck,
  Flame,
  Star,
  ArrowRight,
  CheckCircle2,
  LogOut,
  Phone,
  Mail,
  Home,
} from "lucide-react";
import "./styles.css";

const MENU = [
  {
    id: "jollof",
    name: "Party Jollof Rice",
    cat: "Rice & Swallow",
    price: 3500,
    desc: "Smoky party-style jollof with rich tomato pepper sauce.",
    tag: "Bestseller",
    available: true,
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "fried",
    name: "Native Fried Rice",
    cat: "Rice & Swallow",
    price: 3500,
    desc: "Fragrant fried rice with vegetables, liver and house seasoning.",
    available: true,
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "yam",
    name: "Pounded Yam",
    cat: "Rice & Swallow",
    price: 2000,
    desc: "Smooth, warm pounded yam — perfect with your favourite soup.",
    available: true,
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "egusi",
    name: "Egusi Soup",
    cat: "Soups",
    price: 3000,
    desc: "Melon-seed soup with leafy greens and assorted meat.",
    tag: "Chef's pick",
    available: true,
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "efo",
    name: "Efo Riro",
    cat: "Soups",
    price: 3200,
    desc: "Rich leafy stew finished with palm oil and smoked fish.",
    available: true,
    image:
      "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "pepper",
    name: "Goat Meat Pepper Soup",
    cat: "Soups",
    price: 3800,
    desc: "Aromatic, warming pepper soup with tender goat meat.",
    tag: "Popular",
    available: true,
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "chicken",
    name: "Grilled Chicken",
    cat: "Proteins",
    price: 2500,
    desc: "Juicy char-grilled chicken with a house pepper glaze.",
    available: true,
    image:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "beef",
    name: "Peppered Beef",
    cat: "Proteins",
    price: 2200,
    desc: "Tender beef tossed in a bold onion-pepper sauce.",
    available: true,
    image:
      "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "fish",
    name: "Fried Croaker Fish",
    cat: "Proteins",
    price: 3000,
    desc: "Crispy fried croaker served with our signature pepper sauce.",
    available: true,
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "zobo",
    name: "Chilled Zobo",
    cat: "Drinks",
    price: 800,
    desc: "Hibiscus, ginger and pineapple-cucumber infusion.",
    available: true,
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "chapman",
    name: "House Chapman",
    cat: "Drinks",
    price: 1200,
    desc: "Cold, refreshing house-mixed Chapman.",
    available: true,
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=85",
  },
  {
    id: "water",
    name: "Bottled Water",
    cat: "Drinks",
    price: 300,
    desc: "50cl chilled bottled water.",
    available: true,
    image:
      "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=900&q=85",
  },
];

const CATEGORIES = [
  "All",
  "Rice & Swallow",
  "Soups",
  "Proteins",
  "Drinks",
];
const money = (amount) => `₦${Number(amount).toLocaleString("en-NG")}`;

function App() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("gbemi_cart")) || [];
    } catch {
      return [];
    }
  });

  const [customer, setCustomer] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("gbemi_customer")) || null;
    } catch {
      return null;
    }
  });

  const [drawer, setDrawer] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [successOpen, setSuccessOpen] = useState(false);

  const [form, setForm] = useState({
    name: customer?.name || "",
    phone: customer?.phone || "",
    email: customer?.email || "",
    address: customer?.address || "",
  });

  const [orderNumber, setOrderNumber] = useState("");

  useEffect(() => {
    localStorage.setItem("gbemi_cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (customer) {
      localStorage.setItem("gbemi_customer", JSON.stringify(customer));
    } else {
      localStorage.removeItem("gbemi_customer");
    }
  }, [customer]);

  const items = useMemo(() => {
    return MENU.filter((item) => {
      const categoryMatch =
        category === "All" || item.cat === category;

      const searchMatch =
        !search ||
        `${item.name} ${item.desc}`
          .toLowerCase()
          .includes(search.toLowerCase());

      return categoryMatch && searchMatch && item.available;
    });
  }, [category, search]);

  const itemCount = cart.reduce((total, item) => total + item.qty, 0);

  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.qty,
    0
  );

  const delivery = cart.length > 0 ? 500 : 0;

  const total = subtotal + delivery;

  function addToCart(item) {
    setCart((current) => {
      const existing = current.find((x) => x.id === item.id);

      if (existing) {
        return current.map((x) =>
          x.id === item.id
            ? { ...x, qty: x.qty + 1 }
            : x
        );
      }

      return [...current, { ...item, qty: 1 }];
    });

    setDrawer(true);
  }

  function changeQuantity(id, amount) {
    setCart((current) =>
      current
        .map((item) =>
          item.id === id
            ? { ...item, qty: item.qty + amount }
            : item
        )
        .filter((item) => item.qty > 0)
    );
  }

  function openCheckout() {
    if (cart.length === 0) {
      setDrawer(false);
      return;
    }

    setDrawer(false);
    setCheckoutOpen(true);
  }

  function saveAccount(e) {
    e.preventDefault();

    if (!form.name || !form.phone) {
      alert("Please enter your name and phone number.");
      return;
    }

    setCustomer(form);
    setAccountOpen(false);
  }

  function placeOrder(e) {
    e.preventDefault();

    if (!form.name || !form.phone || !form.address) {
      alert("Please complete your name, phone number and delivery address.");
      return;
    }

    const number =
      "GBF-" +
      Math.floor(100000 + Math.random() * 900000);

    setCustomer(form);
    setOrderNumber(number);
    setCheckoutOpen(false);
    setSuccessOpen(true);

    setCart([]);
  }

  function logout() {
    setCustomer(null);

    setForm({
      name: "",
      phone: "",
      email: "",
      address: "",
    });

    setAccountOpen(false);
  }

  return (
    <div className="app">
      <header className="nav">
        <div className="nav-inner">
          <button
            className="brand"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
          >
            <div className="logo">Go</div>

            <div>
              <div className="brand-name">
                Gbemiolofada
              </div>

              <div className="brand-sub">
                FOODS
              </div>
            </div>
          </button>

          <nav className="desktop-links">
            <a href="#menu">Menu</a>
            <a href="#why">Why us</a>
            <a href="#how">How it works</a>
          </nav>

          <div className="nav-actions">
            <button
              className="icon-btn"
              onClick={() => setAccountOpen(true)}
            >
              <User size={19} />
              <span className="hide-sm">
                {customer ? customer.name.split(" ")[0] : "Account"}
              </span>
            </button>

            <button
              className="cart-btn"
              onClick={() => setDrawer(true)}
            >
              <ShoppingBag size={18} />
              <span>Cart</span>

              {itemCount > 0 && (
                <b>{itemCount}</b>
              )}
            </button>
          </div>
        </div>
      </header>

      <main>
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">
              <span></span>
              AUTHENTIC NIGERIAN FLAVOUR
            </div>

            <h1>
              Good food.
              <br />
              <em>Made with heart.</em>
            </h1>

            <p>
              Comforting Nigerian meals, prepared
              fresh and delivered to your door
              while
              they're still hot.
            </p>

            <div className="hero-actions">
              <a className="primary" href="#menu">
                Order your meal
                <ArrowRight size={17} />
              </a>

              <a className="text-link" href="#how">
                How it works
              </a>
            </div>

            <div className="trust">
              <span>
                <ShieldCheck size={17} />
                Freshly prepared
              </span>

              <span>
                <Clock3 size={17} />
                Fast delivery
              </span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-card">
              <img
                src={MENU[0].image}
                alt="Party Jollof Rice"
              />

              <div className="floating-card">
                <div className="stars">
                  ★★★★★
                </div>

                <strong>
                  Loved by food lovers
                </strong>

                <small>
                  Freshness you can taste.
                </small>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="menu">
          <div className="section-head">
            <div>
              <div className="kicker">
                OUR MENU
              </div>

              <h2>
                Something delicious
                <br />
                <em>for everyone.</em>
              </h2>
            </div>

            <div className="search">
              <Search size={18} />

              <input
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search meals..."
              />
            </div>
          </div>

          <div className="chips">
            {CATEGORIES.map((item) => (
              <button
                key={item}
                className={
                  category === item
                    ? "chip active"
                    : "chip"
                }
                onClick={() =>
                  setCategory(item)
                }
              >
                {item}
              </button>
            ))}
          </div>

          {items.length === 0 ? (
            <div className="empty-menu">
              <Search size={38} />
              <h3>No meals found</h3>
              <p>
                Try another search or category.
              </p>
            </div>
          ) : (
            <div className="grid">
              {items.map((item) => (
                <article
                  className="food-card"
                  key={item.id}
                >
                  <div className="food-img">
                    <img
                      src={item.image}
                      alt={item.name}
                    />

                    {item.tag && (
                      <span className="tag">
                        {item.tag}
                      </span>
                    )}

                    <button
                      className="add-round"
                      onClick={() =>
                        addToCart(item)
                      }
                      aria-label={`Add ${item.name}`}
                    >
                      <Plus size={20} />
                    </button>
                  </div>

                  <div className="food-body">
                    <div className="food-meta">
                      <span>{item.cat}</span>

                      <strong>
                        {money(item.price)}
                      </strong>
                    </div>

                    <h3>{item.name}</h3>

                    <p>{item.desc}</p>

                    <button
                      className="add-line"
                      onClick={() =>
                        addToCart(item)
                      }
                    >
                      Add to order
                      <Plus size={16} />
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="why" id="why">
          <div className="section narrow">
            <div className="kicker">
              WHY GBEMIOLOFADA
            </div>

            <h2>
              We don't just serve food.
              <br />
              <em>We serve comfort.</em>
            </h2>

            <div className="feature-grid">
              <Feature
                icon={<Flame />}
                title="Made fresh"
                text="Your meal is prepared for your order, not pulled from a shelf."
              />

              <Feature
                icon={<Star />}
                title="Real flavour"
                text="Bold Nigerian recipes, carefully balanced and cooked with intention."
              />

              <Feature
                icon={<MapPin />}
                title="Delivered with care"
                text="From our kitchen to your doorstep, every order is handled with care."
              />
            </div>
          </div>
        </section>

        <section className="how section" id="how">
          <div className="kicker">
            SIMPLE FROM START TO FINISH
          </div>

          <h2>Order in three easy steps.</h2>

          <div className="steps">
            <Step
              n="01"
              title="Choose your meal"
              text="Browse our menu and add your favourites to your order."
            />

            <Step
              n="02"
              title="Checkout securely"
              text="Enter your delivery details and complete your order."
            />

            <Step
              n="03"
              title="Enjoy your food"
              text="We prepare it fresh and get it moving to you."
            />
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-brand">
          <div className="logo">Go</div>

          <div>
            <div className="brand-name">
              Gbemiolofada
            </div>

            <div className="brand-sub">
              FOODS
            </div>
          </div>
        </div>

        <p>Good food, made with heart.</p>

        <small>
          © 2026 Gbemiolofada Foods. All rights reserved.
        </small>
      </footer>

      {itemCount > 0 && (
        <button
          className="mobile-cart"
          onClick={() => setDrawer(true)}
        >
          <span>
            <ShoppingBag size={18} />
            {itemCount} item
            {itemCount > 1 ? "s" : ""}
          </span>

          <strong>
            {money(subtotal)}
            <ChevronRight size={18} />
          </strong>
        </button>
      )}

      {/* CART */}
      {drawer && (
        <div
          className="overlay"
          onClick={() => setDrawer(false)}
        >
          <aside
            className="drawer"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <div className="drawer-head">
              <div>
                <div className="kicker">
                  YOUR ORDER
                </div>

                <h2>Ready to eat?</h2>
              </div>

                <button
                onClick={() => setDrawer(false)}
              >
                <X />
              </button>
            </div>

            {cart.length === 0 ? (
              <div className="empty">
                <ShoppingBag size={40} />

                <p>
                  Your basket is waiting.
                </p>

                <button
                  className="primary"
                  onClick={() =>
                    setDrawer(false)
                  }
                >
                  Browse menu
                </button>
              </div>
            ) : (
              <>
                <div className="cart-items">
                  {cart.map((item) => (
                    <div
                      className="cart-item"
                      key={item.id}
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                      />

                      <div className="ci-main">
                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          {money(item.price)}
                        </span>

                        <div className="qty">
                          <button
                            onClick={() =>
                              changeQuantity(
                                item.id,
                                -1
                              )
                            }
                          >
                            <Minus size={14} />
                          </button>

                          <b>{item.qty}</b>

                          <button
                            onClick={() =>
                              changeQuantity(
                                item.id,
                                1
                              )
                            }
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="checkout">
                  <div>
                    <span>Subtotal</span>
                    <strong>
                      {money(subtotal)}
                    </strong>
                  </div>

                  <div>
                    <span>Delivery</span>
                    <strong>
                      {money(delivery)}
                    </strong>
                  </div>

                  <div className="total">
                    <span>Total</span>
                    <strong>
                      {money(total)}
                    </strong>
                  </div>

                  <button
                    className="primary full"
                    onClick={openCheckout}
                  >
                    Continue to checkout
                    <ArrowRight size={17} />
                  </button>

                  <small>
                    Your order details are saved
                    securely on this device.
                  </small>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {/* ACCOUNT */}
      {accountOpen && (
        <div
          className="modal-backdrop"
          onClick={() =>
            setAccountOpen(false)
          }
        >
          <div
            className="modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="modal-close"
              onClick={() =>
                setAccountOpen(false)
              }
            >
              <X />
            </button>

            <div className="kicker">
              CUSTOMER ACCOUNT
            </div>

            <h2>
              {customer
                ? "Your account"
                : "Welcome to Gbemiolofada"}
            </h2>

            {customer ? (
              <div className="account-info">
                <div className="profile-row">
                  <User />
                  <div>
                    <strong>
                      {customer.name}
                    </strong>
                    <span>
                      {customer.phone}
                    </span>
                  </div>
                </div>

                {customer.email && (
                  <div className="profile-row">
                    <Mail />
                    <span>
                      {customer.email}
                    </span>
                  </div>
                )}

                {customer.address && (
                  <div className="profile-row">
                    <Home />
                    <span>
                      {customer.address}
                    </span>
                  </div>
                )}

                <button
                  className="secondary full"
                  onClick={logout}
                >
                  <LogOut size={17} />
                  Sign out
                </button>
              </div>
            ) : (
              <form
                className="form"
                onSubmit={saveAccount}
              >
                <label>
                  Full name
                  <input
                    value={form.name}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        name: e.target.value,
                      })
                    }
                    placeholder="Your full name"
                  />
                </label>

                <label>
                  Phone number
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        phone: e.target.value,
                      })
                    }
                    placeholder="080..."
                    type="tel"
                  />
                </label>

                <label>
                  Email address
                  <input
                    value={form.email}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        email: e.target.value,
                      })
                    }
                    placeholder="you@example.com"
                    type="email"
                  />
                </label>

                <button
                  className="primary full"
                  type="submit"
                >
                  Save account
                  <ArrowRight size={17} />
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* CHECKOUT */}
      {checkoutOpen && (
        <div
          className="modal-backdrop"
          onClick={() =>
            setCheckoutOpen(false)
          }
        >
          <div
            className="modal checkout-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >
            <button
              className="modal-close"
              onClick={() =>
                setCheckoutOpen(false)
              }
            >
              <X />
            </button>

            <div className="kicker">
              CHECKOUT
            </div>

            <h2>Where should we deliver?</h2>

            <form
              className="form"
              onSubmit={placeOrder}
            >
              <label>
                Full name
                <input
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  required
                />
              </label>

              <label>
                Phone number
                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                  type="tel"
                  required
                />
              </label>

              <label>
                Email address
                <input
                  value={form.email}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                  }
                  type="email"
                  placeholder="Optional"
                />
              </label>

              <label>
                Delivery address
                <textarea
                  value={form.address}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      address: e.target.value,
                    })
                  }
                  placeholder="Enter your complete delivery address"
                  required
                />
              </label>

              <div className="checkout-summary">
                <span>Order total</span>
                <strong>
                  {money(total)}
                </strong>
              </div>

              <button
                className="primary full"
                type="submit"
              >
                Place order
                <CheckCircle2 size={18} />
              </button>

              <small className="security-note">
                <ShieldCheck size={15} />
                Secure ordering experience
              </small>
            </form>
          </div>
        </div>
      )}

      {/* ORDER SUCCESS */}
      {successOpen && (
        <div className="modal-backdrop">
          <div className="modal success-modal">
            <div className="success-icon">
              <CheckCircle2 size={48} />
            </div>

            <div className="kicker">
              ORDER RECEIVED
            </div>

            <h2>
              Thank you, {form.name.split(" ")[0]}!
            </h2>

            <p>
              Your order has been received and is
              ready to be processed.
            </p>

            <div className="order-number">
              <span>Order number</span>
              <strong>{orderNumber}</strong>
            </div>

            <p className="notice">
              This is currently the frontend
              ordering flow. We'll connect the
              real database, payment gateway and
              order management system next.
            </p>

            <button
              className="primary full"
              onClick={() =>
                setSuccessOpen(false)
              }
            >
              Continue shopping
              <ArrowRight size={17} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function Feature({ icon, title, text }) {
  return (
    <div className="feature">
      <div className="feature-icon">
        {icon}
      </div>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

function Step({ n, title, text }) {
  return (
    <div className="step">
      <b>{n}</b>

      <h3>{title}</h3>

      <p>{text}</p>
    </div>
  );
}

createRoot(
  document.getElementById("root")
).render(<App />);
