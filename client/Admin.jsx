import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  RefreshCw,
  LogOut,
  Phone,
  Mail,
  MapPin,
  Clock,
  ShoppingBag,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import "./styles.css";

const API_URL = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

const STATUS_OPTIONS = [
  { value: "pending", label: "Pending" },
  { value: "confirmed", label: "Confirmed" },
  { value: "preparing", label: "Preparing" },
  { value: "out_for_delivery", label: "Out for delivery" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" }
];

const money = (n) =>
  "₦" + Number(n || 0).toLocaleString("en-NG");

function Admin() {
  const [adminKey, setAdminKey] = useState(
    sessionStorage.getItem("gbemiolofada_admin_key") || ""
  );

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loggedIn, setLoggedIn] = useState(
    Boolean(sessionStorage.getItem("gbemiolofada_admin_key"))
  );

  async function loadOrders(key = adminKey) {
    if (!key) {
      setError("Please enter your admin key.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${API_URL}/api/orders`, {
        headers: {
          Authorization: `Bearer ${key}`
        }
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load orders.");
      }

      setOrders(data.orders || []);
      setLoggedIn(true);

      sessionStorage.setItem(
        "gbemiolofada_admin_key",
        key
      );
    } catch (err) {
      setLoggedIn(false);
      setOrders([]);
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  }

  function login(e) {
    e.preventDefault();
    loadOrders(adminKey);
  }

  function logout() {
    sessionStorage.removeItem("gbemiolofada_admin_key");
    setAdminKey("");
    setOrders([]);
    setLoggedIn(false);
    setError("");
  }

  async function updateStatus(id, status) {
    try {
      const response = await fetch(
        `${API_URL}/api/orders/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${adminKey}`
          },
          body: JSON.stringify({ status })
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Unable to update status."
        );
      }

      setOrders((current) =>
        current.map((order) =>
          order.id === id
            ? { ...order, status }
            : order
        )
      );
    } catch (err) {
      alert(err.message || "Unable to update order.");
    }
  }

  useEffect(() => {
    if (adminKey && loggedIn) {
      loadOrders(adminKey);
    }
  }, []);

  if (!loggedIn) {
    return (
      <div className="admin-page">
        <div className="admin-login">
          <div className="admin-logo">Go</div>

          <div className="kicker">
            GBEMIOLOFADA FOODS
          </div>

          <h1>Admin Orders</h1>

          <p>
            Enter your private admin key to view customer
            orders.
          </p>

          <form onSubmit={login}>
            <label>
              Admin key

              <input
                type="password"
                value={adminKey}
                onChange={(e) =>
                  setAdminKey(e.target.value)
                }
                placeholder="Enter your admin key"
                required
              />
            </label>

            {error && (
              <div className="admin-error">
                <AlertCircle size={18} />
                {error}
              </div>
            )}

            <button
              className="primary full"
              type="submit"
              disabled={loading}
            >
              {loading
                ? "Checking..."
                : "Open orders"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-page">
      <header className="admin-header">
        <div>
          <div className="kicker">
            GBEMIOLOFADA FOODS
          </div>

          <h1>Orders</h1>

          <p>
            {orders.length} order
            {orders.length !== 1 ? "s" : ""} received
          </p>
        </div>

        <div className="admin-actions">
          <button
            onClick={() => loadOrders()}
            disabled={loading}
          >
            <RefreshCw
              size={17}
              className={loading ? "spin" : ""}
            />
            Refresh
          </button>

          <button onClick={logout}>
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </header>

      {error && (
        <div className="admin-error">
          <AlertCircle size={18} />
          {error}
        </div>
      )}

      {orders.length === 0 ? (
        <div className="no-orders">
          <ShoppingBag size={42} />

          <h2>No orders yet</h2>

          <p>
            Customer orders will appear here when they
            place an order.
          </p>
        </div>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <article
              className="order-card"
              key={order.id}
            >
              <div className="order-top">
                <div>
                  <span className="order-number">
                    Order #{order.id.slice(0, 8)}
                  </span>

                  <h2>{order.customer_name}</h2>
                </div>

                <div className="order-status">
                  <select
                    value={order.status || "pending"}
                    onChange={(e) =>
                      updateStatus(
                        order.id,
                        e.target.value
                      )
                    }
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option
                        key={status.value}
                        value={status.value}
                      >
                        {status.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="order-info">
                <div>
                  <Phone size={17} />
                  <a
                    href={`tel:${order.customer_phone}`}
                  >
                    {order.customer_phone}
                  </a>
                </div>

                {order.customer_email && (
                  <div>
                    <Mail size={17} />
                    <a
                      href={`mailto:${order.customer_email}`}
                    >
                      {order.customer_email}
                    </a>
                  </div>
                )}

                <div>
                  <MapPin size={17} />
                  <span>
                    {order.delivery_address}
                  </span>
                </div>

                <div>
                  <Clock size={17} />
                  <span>
                    {new Date(
                      order.created_at
                    ).toLocaleString("en-NG")}
                  </span>
                </div>
              </div>

              <div className="ordered-items">
                <h3>Items ordered</h3>

                {Array.isArray(order.items) &&
                  order.items.map((item, index) => (
                    <div
                      className="ordered-item"
                      key={`${order.id}-${index}`}
                    >
                      <span>
                        {item.quantity} × {item.name}
                      </span>

                      <strong>
                        {money(
                          Number(item.price) *
                            Number(item.quantity)
                        )}
                      </strong>
                    </div>
                  ))}
              </div>

              <div className="order-bottom">
                <div>
                  <span>Subtotal</span>
                  <strong>
                    {money(order.subtotal)}
                  </strong>
                </div>

                <div>
                  <span>Delivery</span>
                  <strong>
                    {money(order.delivery_fee)}
                  </strong>
                </div>

                <div className="grand-total">
                  <span>Total</span>
                  <strong>
                    {money(order.total)}
                  </strong>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}

createRoot(
  document.getElementById("root")
).render(<Admin />);
