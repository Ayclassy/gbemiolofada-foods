import React, { useEffect, useMemo, useRef, useState } from "react";
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
  Phone,
  Mail,
  Home
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

const money = (n) =>
  "₦" + Number(n || 0).toLocaleString("en-NG");

/*
  YOUR BACKEND URL

  Vercel environment variable:
  VITE_API_URL

  Value:
  https://gbemiolofada-foods1.vercel.app/
*/

const API_URL = (
  import.meta.env.VITE_API_URL ||
  "https://gbemiolofada-foods1.vercel.app"
).replace(/\/$/, "");

function App() {
  const [cat, setCat] = useState("All");
  const [q, setQ] = useState("");
  const [cart, setCart] = useState([]);

  const [drawer, setDrawer] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [savingOrder, setSavingOrder] = useState(false);
  const [orderError, setOrderError] = useState("");

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
    address: ""
  });

  const items = useMemo(() => {
    return MENU.filter((m) => {
      const matchesCategory =
        cat === "All" || m.cat === cat;

      const searchText =
        `${m.name} ${m.desc}`.toLowerCase();

      const matchesSearch =
        !q || searchText.includes(q.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [cat, q]);

  const count = cart.reduce(
    (sum, item) => sum + item.qty,
    0
  );

  const subtotal = cart.reduce(
    (sum, item) =>
      sum + item.price * item.qty,
    0
  );

  const delivery = cart.length ? 500 : 0;
  const total = subtotal + delivery;

  function add(item) {
    setCart((current) => {
      const exists = current.some(
        (x) => x.id === item.id
      );

      if (exists) {
        return current.map((x) =>
          x.id === item.id
            ? { ...x, qty: x.qty + 1 }
            : x
        );
      }

      return [
        ...current,
        {
          ...item,
          qty: 1
        }
      ];
    });

    setDrawer(true);
  }

  function change(id, amount) {
    setCart((current) =>
      current
        .map((x) =>
          x.id === id
            ? {
                ...x,
                qty: x.qty + amount
              }
            : x
        )
        .filter((x) => x.qty > 0)
    );
  }

  function openCheckout() {
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

    setOrderError("");

    if (!customer.name.trim()) {
      setOrderError(
        "Please enter your full name."
      );
      return;
    }

    if (!customer.phone.trim()) {
      setOrderError(
        "Please enter your phone number."
      );
      return;
    }

    if (!customer.address.trim()) {
      setOrderError(
        "Please enter your delivery address."
      );
      return;
    }

    if (!cart.length) {
      setOrderError(
        "Your cart is empty."
      );
      return;
    }

    setSavingOrder(true);

    const orderPayload = {
      customer_name:
        customer.name.trim(),

      customer_phone:
        customer.phone.trim(),

      customer_email:
        customer.email.trim() || null,

      delivery_address:
        customer.address.trim(),

      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        category: item.cat,
        price: item.price,
        quantity: item.qty
      })),

      subtotal,
      delivery_fee: delivery,
      total
    };

    console.log(
      "===================================="
    );

    console.log(
      "SENDING ORDER TO BACKEND"
    );

    console.log(
      "URL:",
      `${API_URL}/api/orders`
    );

    console.log(
      "ORDER DATA:",
      orderPayload
    );

    console.log(
      "===================================="
    );

    try {
      const response = await fetch(
        `${API_URL}/api/orders`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json"
          },

          body: JSON.stringify(
            orderPayload
          )
        }
      );

      console.log(
        "BACKEND RESPONSE STATUS:",
        response.status
      );

      const responseText =
        await response.text();

      console.log(
        "BACKEND RESPONSE:",
        responseText
      );

      let data;

      try {
        data =
          JSON.parse(responseText);
      } catch {
        throw new Error(
          "The backend returned an invalid response."
        );
      }

      if (
        !response.ok ||
        !data.success
      ) {
        throw new Error(
          data.message ||
            "Unable to save the order."
        );
      }

      console.log(
        "ORDER SUCCESSFULLY SAVED:",
        data.order
      );

      setCheckoutOpen(false);
      setOrderComplete(true);
    } catch (error) {
      console.error(
        "===================================="
      );

      console.error(
        "ORDER SUBMISSION ERROR:",
        error
      );

      console.error(
        "===================================="
      );

      setOrderError(
        error.message ||
          "We could not send your order. Please try again."
      );
    } finally {
      setSavingOrder(false);
    }
  }

  function finishOrder() {
    setCart([]);
    setOrderComplete(false);

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
            <div className="logo">
              Go
            </div>

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
            <a href="#menu">
              Menu
            </a>

            <a href="#why">
              Why us
            </a>

            <a href="#how">
              How it works
            </a>
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
              onClick={() =>
                setDrawer(true)
              }
            >
              <ShoppingBag size={18} />

              <span>
                Cart
              </span>

              {count > 0 && (
                <b>{count}</b>
              )}
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
              <em>
                Made with heart.
              </em>
            </h1>

            <p>
              Comforting Nigerian meals,
              prepared fresh and delivered
              to your door while they're
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
                <em>
                  for everyone.
                </em>
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
                onClick={() =>
                  setCat(c)
                }
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
                    onClick={() =>
                      add(item)
                    }
                  >
                    <Plus size={20} />
                  </button>

                </div>

                <div className="food-body">

                  <div className="food-meta">

                    <span>
                      {item.cat}
                    </span>

                    <strong>
                      {money(item.price)}
                    </strong>

                  </div>

                  <h3>
                    {item.name}
                  </h3>

                  <p>
                    {item.desc}
                  </p>

                  <button
                    className="add-line"
                    onClick={() =>
                      add(item)
                    }
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
              <em>
                We serve comfort.
              </em>
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

          <div className="logo">
            Go
          </div>

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
          © 2026 Gbemiolofada Foods.
          All rights reserved.
        </small>

      </footer>

      {/* MOBILE CART */}

      {count > 0 && (

        <button
          className="mobile-cart"
          onClick={() =>
            setDrawer(true)
          }
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
          onClick={() =>
            setDrawer(false)
          }
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
                            <Minus
                              size={14}
                            />
                          </button>

                          <b>
                            {i.qty}
                          </b>

                          <button
                            onClick={() =>
                              change(
                                i.id,
                                1
                              )
                            }
                          >
                            <Plus
                              size={14}
                            />
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
                      openCheckout
                    }
                  >
                    Continue to checkout
                    <ArrowRight
                      size={17}
                    />
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
          onClick={() => {
            if (!savingOrder) {
              setCheckoutOpen(false);
            }
          }}
        >

          <div
            className="modal checkout-modal"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {!savingOrder && (

              <button
                className="modal-close"
                onClick={() =>
                  setCheckoutOpen(false)
                }
              >
                <X />
              </button>

            )}

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
                    "1px solid #efcaca",
                  padding: "12px",
                  borderRadius: "10px",
                  marginBottom: "15px",
                  fontSize: "13px"
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
                        name: e.target.value
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
                        phone: e.target.value
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
                        email: e.target.value
                      })
                    }
                    placeholder="you@example.com"
                  />

                </div>

              </label>

              <label>

                Delivery address

                <div className="input-wrap textarea-wrap">

                  <Home size={17} />

                  <textarea
                    required
                    value={
                      customer.address
                    }
                    onChange={(e) =>
                      setCustomer({
                        ...customer,
                        address: e.target.value
                      })
                    }
                    placeholder="Enter your full delivery address"
                    rows="4"
                  />

                </div>

              </label>

              <button
                type="submit"
                className="primary full"
                disabled={savingOrder}
                style={{
                  opacity:
                    savingOrder
                      ? 0.7
                      : 1
                }}
              >

                {savingOrder
                  ? "Saving your order..."
                  : "Place order"}

                {!savingOrder && (
                  <CheckCircle2
                    size={17}
                  />
                )}

              </button>

            </form>

          </div>

        </div>

      )}

      {/* ORDER SUCCESS */}

      {orderComplete && (

        <div className="overlay">

          <div className="modal">

            <div
              className="modal-icon"
              style={{
                background:
                  "#e9f7ed",
                color: "#18864b"
              }}
            >
              <CheckCircle2
                size={28}
              />
            </div>

            <div className="kicker">
              ORDER RECEIVED
            </div>

            <h2>
              Thank you,{" "}
              {customer.name}!
            </h2>

            <p>
              Your order has been
              received successfully.
              We'll contact you on{" "}
              <strong>
                {customer.phone}
              </strong>{" "}
              to confirm delivery.
            </p>

            <div
              style={{
                background:
                  "#fff7f2",
                border:
                  "1px solid #ead9d4",
                borderRadius: "12px",
                padding: "14px",
                margin: "15px 0",
                textAlign: "left"
              }}
            >

              <strong>
                Delivery address
              </strong>

              <p
                style={{
                  marginTop: "5px",
                  marginBottom: 0,
                  fontSize: "13px"
                }}
              >
                {customer.address}
              </p>

            </div>

            <div
              className="checkout-total"
              style={{
                marginBottom: "15px"
              }}
            >
              Order total{" "}
              <strong>
                {money(total)}
              </strong>
            </div>

            <button
              className="primary full"
              onClick={finishOrder}
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

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

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

      <b>
        {n}
      </b>

      <h3>
        {title}
      </h3>

      <p>
        {text}
      </p>

    </div>
  );
}

function AdminOrders() {
  const [password, setPassword] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [newOrderIds, setNewOrderIds] = useState(new Set());
  
    const knownOrderIds = useRef(new Set());
  const firstOrdersLoad = useRef(true);

  useEffect(() => {
    if (!loggedIn) return;

    const timer = setInterval(() => {
      loadOrders(password);
    }, 15000);

    return () => clearInterval(timer);
  }, [loggedIn, password]);
  
  async function loadOrders(adminPassword = password) {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/orders`,
        {
          headers: {
            "x-admin-password": adminPassword
          }
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load orders.");
      }

      const incomingOrders = data.orders || [];

      const newOrders = incomingOrders.filter(
        (order) => !knownOrderIds.current.has(order.id)
      );

      setNewOrderIds(
  new Set(newOrders.map((order) => order.id))
);

      if (!firstOrdersLoad.current && newOrders.length > 0) {
        alert(
          `New order received from ${
            newOrders[0].customer_name || "a customer"
          }.`
        );
      }

      incomingOrders.forEach((order) => {
        knownOrderIds.current.add(order.id);
      });

      firstOrdersLoad.current = false;
      setOrders(incomingOrders);
      setLoggedIn(true);

    } catch (err) {
      setLoggedIn(false);
      setError(err.message || "Unable to load orders.");
    } finally {
      setLoading(false);
    }
  }

  async function updateStatus(orderId, status) {
    setError("");

    try {
      const response = await fetch(
        `${API_URL}/api/admin/orders/${orderId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            "x-admin-password": password
          },
          body: JSON.stringify({ status })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to update order status."
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === orderId
            ? { ...order, status: data.order.status }
            : order
        )
      );
    } catch (err) {
      setError(
        err.message || "Unable to update order status."
      );
    }
  }
  
  function submitLogin(e) {
    e.preventDefault();
    if (password.trim()) {
      loadOrders(password);
    }
  }

  if (!loggedIn) {
    return (
      <div style={adminStyles.page}>
        <div style={adminStyles.card}>
          <h1 style={adminStyles.title}>Gbemiolofada Foods</h1>
          <p style={adminStyles.subtitle}>Admin orders</p>

          <form onSubmit={submitLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              style={adminStyles.input}
            />

            <button type="submit" style={adminStyles.button}>
              {loading ? "Checking..." : "Open orders"}
            </button>
          </form>

          {error && <p style={adminStyles.error}>{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div style={adminStyles.page}>
      <div style={adminStyles.container}>
        <div style={adminStyles.header}>
          <div>
            <h1 style={adminStyles.title}>Orders</h1>
            <p style={adminStyles.subtitle}>
              {orders.length} order{orders.length === 1 ? "" : "s"} received
            </p>
          </div>

          <button
            style={adminStyles.button}
            onClick={() => loadOrders()}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>

        {error && <p style={adminStyles.error}>{error}</p>}

        {orders.length === 0 ? (
          <div style={adminStyles.card}>
            <p>No orders found yet.</p>
          </div>
        ) : (
          <div style={adminStyles.grid}>
            {orders.map((order) => (
              <article key={order.id} style={adminStyles.orderCard}>
                <div style={adminStyles.orderTop}>
                  <strong>{order.customer_name || "Customer"}</strong>
                  <span style={adminStyles.status}>
                    {order.status || "pending"}
                  </span>
                </div>

                <p><b>Phone:</b> {order.customer_phone || "—"}</p>
                <p><b>Email:</b> {order.customer_email || "—"}</p>
                <p><b>Address:</b> {order.delivery_address || "—"}</p>
                <p><b>Total:</b> {money(order.total)}</p>
                
                                <label style={adminStyles.statusControl}>
                  <b>Status:</b>
                  <select
                    value={order.status || "pending"}
                    onChange={(e) =>
                      updateStatus(order.id, e.target.value)
                    }
                    style={adminStyles.select}
                  >
                    <option value="pending">Pending</option>
                    <option value="preparing">Preparing</option>
                    <option value="ready">Ready</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </label>

                <p><b>Created:</b> {order.created_at ? new Date(order.created_at).toLocaleString() : "—"}</p>

                <details>
                  <summary>View items</summary>
                  <pre style={adminStyles.items}>
                    {JSON.stringify(order.items || [], null, 2)}
                  </pre>
                </details>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

const adminStyles = {
  page: {
    minHeight: "100vh",
    background: "#fff8f3",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
    color: "#351316"
  },
  container: {
    maxWidth: "1100px",
    margin: "0 auto"
  },
  card: {
    maxWidth: "420px",
    margin: "80px auto",
    background: "white",
    padding: "28px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.08)"
  },
  title: {
    margin: "0 0 6px",
    color: "#8f1017"
  },
  subtitle: {
    color: "#765f5f",
    marginTop: 0
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "14px",
    margin: "16px 0 12px",
    border: "1px solid #dcc8c3",
    borderRadius: "10px",
    fontSize: "16px"
  },
  button: {
    border: 0,
    borderRadius: "10px",
    padding: "12px 18px",
    background: "#8f1017",
    color: "white",
    fontWeight: "bold",
    cursor: "pointer"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    marginBottom: "24px"
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(290px, 1fr))",
    gap: "18px"
  },
  orderCard: {
    background: "white",
    padding: "20px",
    borderRadius: "16px",
    boxShadow: "0 8px 24px rgba(0,0,0,0.07)"
  },
    newOrderCard: {
    background: "#fff4c2",
    border: "3px solid #e0a400",
    boxShadow: "0 0 0 4px rgba(224, 164, 0, 0.18)"
  },
  orderTop: {
    display: "flex",
    justifyContent: "space-between",
    gap: "12px",
    marginBottom: "12px",
    fontSize: "18px"
  },
  status: {
    background: "#fff0c7",
    color: "#765100",
    padding: "5px 8px",
    borderRadius: "999px",
    fontSize: "12px"
  },
  items: {
    whiteSpace: "pre-wrap",
    overflowX: "auto",
    background: "#faf4f0",
    padding: "10px",
    borderRadius: "8px",
    fontSize: "12px"
  },
    error: {
    color: "#a01818",
    background: "#fff0f0",
    padding: "12px",
    borderRadius: "10px"
  },
  statusControl: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    margin: "14px 0"
  },
  select: {
    padding: "10px",
    border: "1px solid #dcc8c3",
    borderRadius: "8px",
    fontSize: "15px",
    background: "white"
  }
};

const isAdminPage = window.location.pathname === "/admin/orders";

createRoot(document.getElementById("root")).render(
  isAdminPage ? <AdminOrders /> : <App />
);
