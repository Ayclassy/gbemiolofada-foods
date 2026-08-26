import React, { useMemo, useState } from "react";
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
  Phone,
  Mail,
  CheckCircle2
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
    image:
      "https://images.unsplash.com/photo-1603133872878-684f208fb84b?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "fried",
    name: "Native Fried Rice",
    cat: "Rice & Swallow",
    price: 3500,
    desc: "Fragrant fried rice with vegetables, liver and house seasoning.",
    image:
      "https://images.unsplash.com/photo-1512058564366-18510be2db19?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "yam",
    name: "Pounded Yam",
    cat: "Rice & Swallow",
    price: 2000,
    desc: "Smooth, warm pounded yam — perfect with your favourite soup.",
    image:
      "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "egusi",
    name: "Egusi Soup",
    cat: "Soups",
    price: 3000,
    desc: "Melon-seed soup with leafy greens and assorted meat.",
    tag: "Chef's pick",
    image:
      "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "efo",
    name: "Efo Riro",
    cat: "Soups",
    price: 3200,
    desc: "Rich leafy stew finished with palm oil and smoked fish.",
    image:
      "https://images.unsplash.com/photo-1601050690117-94f5f6fa8bd7?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "pepper",
    name: "Goat Meat Pepper Soup",
    cat: "Soups",
    price: 3800,
    desc: "Aromatic, warming pepper soup with tender goat meat.",
    tag: "Popular",
    image:
      "https://images.unsplash.com/photo-1547592166-23ac45744acd?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "chicken",
    name: "Grilled Chicken",
    cat: "Proteins",
    price: 2500,
    desc: "Juicy char-grilled chicken with a house pepper glaze.",
    image:
      "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "beef",
    name: "Peppered Beef",
    cat: "Proteins",
    price: 2200,
    desc: "Tender beef tossed in a bold onion-pepper sauce.",
    image:
      "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "fish",
    name: "Fried Croaker Fish",
    cat: "Proteins",
    price: 3000,
    desc: "Crispy fried croaker served with our signature pepper sauce.",
    image:
      "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "zobo",
    name: "Chilled Zobo",
    cat: "Drinks",
    price: 800,
    desc: "Hibiscus, ginger and pineapple-cucumber infusion.",
    image:
      "https://images.unsplash.com/photo-1544145945-f90425340c7e?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "chapman",
    name: "House Chapman",
    cat: "Drinks",
    price: 1200,
    desc: "Cold, refreshing house-mixed Chapman.",
    image:
      "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=900&q=85"
  },
  {
    id: "water",
    name: "Bottled Water",
    cat: "Drinks",
    price: 300,
    desc: "50cl chilled bottled water.",
    image:
      "https://images.unsplash.com/photo-1564419320461-6870880221ad?auto=format&fit=crop&w=900&q=85"
  }
];

const cats = [
  "All",
  "Rice & Swallow",
  "Soups",
  "Proteins",
  "Drinks"
];

const money = (n) => "₦" + Number(n || 0).toLocaleString("en-NG");

function App() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [cart, setCart] = useState([]);

  const [drawer, setDrawer] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });

  const [completedOrder, setCompletedOrder] = useState(null);

  const items = useMemo(
    () =>
      MENU.filter(
        (m) =>
          (cat === "All" || m.cat === cat) &&
          (!q ||
            `${m.name} ${m.desc}`
              .toLowerCase()
              .includes(q.toLowerCase()))
      ),
    [cat, q]
  );

  const count = cart.reduce((s, i) => s + i.qty, 0);

  const subtotal = cart.reduce(
    (s, i) => s + i.price * i.qty,
    0
  );

  const delivery = cart.length ? 500 : 0;
  const total = subtotal + delivery;

  function add(item) {
    setCart((current) =>
      current.some((x) => x.id === item.id)
        ? current.map((x) =>
            x.id === item.id
              ? { ...x, qty: x.qty + 1 }
              : x
          )
        : [...current, { ...item, qty: 1 }]
    );

    setDrawer(true);
  }

  function change(id, amount) {
    setCart((current) =>
      current
        .map((x) =>
          x.id === id
            ? { ...x, qty: x.qty + amount }
            : x
        )
        .filter((x) => x.qty > 0)
    );
  }

  function startCheckout() {
    if (!cart.length) {
      setDrawer(true);
      return;
    }

    setOrderError("");
    setDrawer(false);
    setCheckoutOpen(true);
  }

  async function placeOrder(e) {
    e.preventDefault();

    if (!cart.length) {
      setOrderError("Your cart is empty.");
      return;
    }

    if (
      !customer.name.trim() ||
      !customer.phone.trim() ||
      !customer.address.trim()
    ) {
      setOrderError(
        "Please fill in your name, phone number and delivery address."
      );
      return;
    }

    setSubmitting(true);
    setOrderError("");

    const orderItems = cart.map((item) => ({
      id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.qty,
      category: item.cat
    }));

    const orderData = {
      customer_name: customer.name.trim(),
      customer_phone: customer.phone.trim(),
      customer_email: customer.email.trim() || null,
      delivery_address: customer.address.trim(),
      items: orderItems,
      subtotal,
      delivery_fee: delivery,
      total
    };

    try {
      /*
       * If your backend is deployed separately,
       * replace this with your backend URL.
       *
       * Example:
       * const API_URL = "https://your-server.vercel.app";
       */
      const API_URL =
        import.meta.env.VITE_API_URL || "";

      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(orderData)
        }
      );

      let result = null;

      try {
        result = await response.json();
      } catch {
        result = null;
      }

      if (!response.ok || !result?.success) {
        throw new Error(
          result?.message ||
            "Unable to place your order. Please try again."
        );
      }

      setCompletedOrder({
        ...orderData,
        order: result.order
      });

      setCheckoutOpen(false);
      setOrderComplete(true);
    } catch (error) {
      console.error("Order submission error:", error);

      setOrderError(
        error.message ||
          "Something went wrong while placing your order."
      );
    } finally {
      setSubmitting(false);
    }
  }

  function finishOrder() {
    setCart([]);
    setOrderComplete(false);
    setCompletedOrder(null);
    setOrderError("");

    setCustomer({
      name: "",
      phone: "",
      email: "",
      address: ""
    });
  }

  return (
    <div className="app">
      {/* NAVIGATION */}
      <header className="nav">
        <div className="nav-inner">
          <div
            className="brand"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth"
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
          </div>

          <div className="desktop-links">
            <a href="#menu">Menu</a>
            <a href="#why">Why us</a>
            <a href="#how">How it works</a>
          </div>

          <div className="nav-actions">
            <button className="icon-btn">
              <User size={19} />
              <span className="hide-sm">
                Account
              </span>
            </button>

            <button
              className="cart-btn"
              onClick={() => setDrawer(true)}
            >
              <ShoppingBag size={18} />

              <span>Cart</span>

              {count > 0 && <b>{count}</b>}
            </button>
          </div>
        </div>
      </header>

      <main>
        {/* HERO */}
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
              Comforting Nigerian meals, prepared fresh
              and delivered to your door while they're
              still hot.
            </p>

            <div className="hero-actions">
              <a
                className="primary"
                href="#menu"
              >
                Order your meal
                <ArrowRight size={17} />
              </a>

              <a
                className="text-link"
                href="#how"
              >
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
                alt="Jollof rice"
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

        {/* MENU */}
        <section
          className="section"
          id="menu"
        >
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
                value={q}
                onChange={(e) =>
                  setQ(e.target.value)
                }
                placeholder="Search meals..."
              />
            </div>
          </div>

          <div className="chips">
            {cats.map((c) => (
              <button
                className={
                  cat === c
                    ? "chip active"
                    : "chip"
                }
                onClick={() => setCat(c)}
                key={c}
              >
                {c}
              </button>
            ))}
          </div>

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
                    onClick={() => add(item)}
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
                    onClick={() => add(item)}
                  >
                    Add to order
                    <Plus size={16} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {/* WHY */}
        <section
          className="why"
          id="why"
        >
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

        {/* HOW IT WORKS */}
        <section
          className="how section"
          id="how"
        >
          <div className="kicker">
            SIMPLE FROM START TO FINISH
          </div>

          <h2>
            Order in three easy steps.
          </h2>

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

      {/* FOOTER */}
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

        <p>
          Good food, made with heart.
        </p>

        <small>
          © 2026 Gbemiolofada Foods. All rights
          reserved.
        </small>
      </footer>

      {/* MOBILE CART */}
      {count > 0 && (
        <button
          className="mobile-cart"
          onClick={() => setDrawer(true)}
        >
          <span>
            <ShoppingBag size={18} />

            {count} item
            {count > 1 ? "s" : ""}
          </span>

          <strong>
            {money(subtotal)}
            <ChevronRight size={18} />
          </strong>
        </button>
      )}

      {/* CART DRAWER */}
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

                <h2>
                  Ready to eat?
                </h2>
              </div>

              <button
                onClick={() =>
                  setDrawer(false)
                }
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
                  {cart.map((i) => (
                    <div
                      className="cart-item"
                      key={i.id}
                    >
                      <img
                        src={i.image}
                        alt={i.name}
                      />

                      <div className="ci-main">
                        <strong>
                          {i.name}
                        </strong>

                        <span>
                          {money(i.price)}
                        </span>

                        <div className="qty">
                          <button
                            onClick={() =>
                              change(
                                i.id,
                                -1
                              )
                            }
                          >
                            <Minus size={14} />
                          </button>

                          <b>{i.qty}</b>

                          <button
                            onClick={() =>
                              change(
                                i.id,
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
                    <span>
                      Subtotal
                    </span>

                    <strong>
                      {money(subtotal)}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Delivery
                    </span>

                    <strong>
                      {money(delivery)}
                    </strong>
                  </div>

                  <div className="total">
                    <span>
                      Total
                    </span>

                    <strong>
                      {money(total)}
                    </strong>
                  </div>

                  <button
                    className="primary full"
                    onClick={
                      startCheckout
                    }
                  >
                    Continue to checkout
                    <ArrowRight size={17} />
                  </button>

                  <small>
                    Secure checkout · Your
                    order details are kept
                    private.
                  </small>
                </div>
              </>
            )}
          </aside>
        </div>
      )}

      {/* CHECKOUT MODAL */}
      {checkoutOpen && (
        <div
          className="overlay"
          onClick={() =>
            !submitting &&
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
              disabled={submitting}
              onClick={() =>
                setCheckoutOpen(false)
              }
            >
              <X />
            </button>

            <div className="kicker">
              CHECKOUT
            </div>

            <h2>
              Where should we deliver?
            </h2>

            <p className="checkout-total">
              Order total:{" "}
              <strong>
                {money(total)}
              </strong>
            </p>

            {orderError && (
              <div
                style={{
                  background: "#fff0f0",
                  color: "#941219",
                  border:
                    "1px solid #f0caca",
                  padding: "12px",
                  borderRadius: "10px",
                  fontSize: "12px",
                  marginBottom: "15px"
                }}
              >
                {orderError}
              </div>
            )}

            <form
              onSubmit={placeOrder}
            >
              <label>
                Full name

                <div className="input-wrap">
                  <User size={17} />

                  <input
                    required
                    value={
                      customer.name
                    }
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        name: e.target
                          .value
                      })
                    }
                    placeholder="Your full name"
                  />
                </div>
              </label>

              <label>
                Phone number

                <div className="input-wrap">
                  <Phone size={17} />

                  <input
                    required
                    value={
                      customer.phone
                    }
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        phone: e.target
                          .value
                      })
                    }
                    placeholder="080..."
                  />
                </div>
              </label>

              <label>
                Email address

                <div className="input-wrap">
                  <Mail size={17} />

                  <input
                    type="email"
                    value={
                      customer.email
                    }
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        email: e.target
                          .value
                      })
                    }
                    placeholder="you@example.com"
                  />
                </div>
              </label>

              <label>
                Delivery address

                <div className="input-wrap">
                  <MapPin size={17} />

                  <textarea
                    required
                    value={
                      customer.address
                    }
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        address:
                          e.target.value
                      })
                    }
                    placeholder="Enter your full delivery address"
                    rows={4}
                  />
                </div>
              </label>

              <button
                className="primary full"
                type="submit"
                disabled={submitting}
                style={{
                  opacity: submitting
                    ? 0.7
                    : 1
                }}
              >
                {submitting
                  ? "Placing order..."
                  : "Place order"}

                {!submitting && (
                  <ArrowRight size={17} />
                )}
              </button>
            </form>

            <small
              style={{
                display: "block",
                textAlign: "center",
                marginTop: "10px",
                color: "#866c69",
                fontSize: "10px"
              }}
            >
              Your information is securely
              submitted with your order.
            </small>
          </div>
        </div>
      )}

      {/* ORDER SUCCESS */}
      {orderComplete &&
        completedOrder && (
          <div
            className="overlay"
            onClick={() => {}}
          >
            <div
              className="modal"
              onClick={(e) =>
                e.stopPropagation()
              }
              style={{
                textAlign: "center"
              }}
            >
              <div
                style={{
                  width: "58px",
                  height: "58px",
                  borderRadius: "50%",
                  background: "#eef8ef",
                  color: "#23823b",
                  display: "grid",
                  placeItems: "center",
                  margin:
                    "0 auto 18px"
                }}
              >
                <CheckCircle2
                  size={32}
                />
              </div>

              <div className="kicker">
                ORDER RECEIVED
              </div>

              <h2>
                Thank you,{" "}
                {completedOrder
                  .customer_name
                  .split(" ")[0]}
                !
              </h2>

              <p>
                Your order has been
                received successfully.
                We'll contact you on{" "}
                <strong>
                  {
                    completedOrder.customer_phone
                  }
                </strong>{" "}
                to confirm delivery.
              </p>

              <div
                style={{
                  background:
                    "var(--cream)",
                  borderRadius: "12px",
                  padding: "15px",
                  margin:
                    "18px 0",
                  textAlign: "left",
                  fontSize: "12px"
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    marginBottom:
                      "8px"
                  }}
                >
                  <span>
                    Customer
                  </span>

                  <strong>
                    {
                      completedOrder.customer_name
                    }
                  </strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    marginBottom:
                      "8px"
                  }}
                >
                  <span>
                    Phone
                  </span>

                  <strong>
                    {
                      completedOrder.customer_phone
                    }
                  </strong>
                </div>

                {completedOrder.customer_email && (
                  <div
                    style={{
                      display: "flex",
                      justifyContent:
                        "space-between",
                      marginBottom:
                        "8px"
                    }}
                  >
                    <span>
                      Email
                    </span>

                    <strong>
                      {
                        completedOrder.customer_email
                      }
                    </strong>
                  </div>
                )}

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    gap: "15px",
                    marginBottom:
                      "8px"
                  }}
                >
                  <span>
                    Delivery
                  </span>

                  <strong
                    style={{
                      textAlign:
                        "right"
                    }}
                  >
                    {
                      completedOrder.delivery_address
                    }
                  </strong>
                </div>

                <div
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    borderTop:
                      "1px solid var(--line)",
                    paddingTop:
                      "10px",
                    marginTop:
                      "10px"
                  }}
                >
                  <span>
                    Order total
                  </span>

                  <strong
                    style={{
                      color:
                        "var(--red)"
                    }}
                  >
                    {money(
                      completedOrder.total
                    )}
                  </strong>
                </div>
              </div>

              <button
                className="primary full"
                onClick={
                  finishOrder
                }
              >
                Done
              </button>
            </div>
          </div>
        )}
    </div>
  );
}

function Feature({
  icon,
  title,
  text
}) {
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

function Step({
  n,
  title,
  text
}) {
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
