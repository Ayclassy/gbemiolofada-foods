import express from "express";
import cors from "cors";
import { supabase } from "../supabase.js";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Gbemiolofada Foods API is running."
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "healthy"
  });
});

/*
|--------------------------------------------------------------------------
| ADMIN AUTHENTICATION
|--------------------------------------------------------------------------
| The admin page must send:
|
| Authorization: Bearer YOUR_ADMIN_KEY
|
| The key is stored in Vercel Environment Variables as ADMIN_KEY.
|--------------------------------------------------------------------------
*/

function checkAdmin(req, res, next) {
  const adminKey = process.env.ADMIN_KEY;

  if (!adminKey) {
    console.error("ADMIN_KEY is not configured.");

    return res.status(500).json({
      success: false,
      message: "Admin access is not configured on the server."
    });
  }

  const authorization = req.headers.authorization || "";

  const expected = `Bearer ${adminKey}`;

  if (authorization !== expected) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized."
    });
  }

  next();
}

/*
|--------------------------------------------------------------------------
| CREATE ORDER
|--------------------------------------------------------------------------
*/

app.post("/api/orders", async (req, res) => {
  try {
    console.log("ORDER REQUEST RECEIVED");

    const {
      customer_name,
      customer_phone,
      customer_email,
      delivery_address,
      items,
      subtotal,
      delivery_fee,
      total
    } = req.body;

    if (
      !customer_name ||
      !customer_phone ||
      !delivery_address ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required order details."
      });
    }

    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          customer_name,
          customer_phone,
          customer_email: customer_email || null,
          delivery_address,
          items,
          subtotal: Number(subtotal) || 0,
          delivery_fee: Number(delivery_fee) || 0,
          total: Number(total) || 0,
          status: "pending"
        }
      ])
      .select()
      .single();

    if (error) {
      console.error("SUPABASE ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to save the order.",
        error: error.message
      });
    }

    console.log("ORDER SAVED:", data.id);

    return res.status(201).json({
      success: true,
      message: "Order received successfully.",
      order: data
    });

  } catch (error) {
    console.error("SERVER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong.",
      error: error.message
    });
  }
});

/*
|--------------------------------------------------------------------------
| GET ALL ORDERS — ADMIN ONLY
|--------------------------------------------------------------------------
*/

app.get("/api/orders", checkAdmin, async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .order("created_at", {
        ascending: false
      });

    if (error) {
      console.error("SUPABASE ADMIN ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to retrieve orders."
      });
    }

    return res.json({
      success: true,
      orders: data || []
    });

  } catch (error) {
    console.error("ADMIN ORDERS ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong."
    });
  }
});

/*
|--------------------------------------------------------------------------
| UPDATE ORDER STATUS — ADMIN ONLY
|--------------------------------------------------------------------------
*/

app.patch("/api/orders/:id/status", checkAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "pending",
      "confirmed",
      "preparing",
      "out_for_delivery",
      "delivered",
      "cancelled"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status."
      });
    }

    const { data, error } = await supabase
      .from("orders")
      .update({
        status
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("STATUS UPDATE ERROR:", error);

      return res.status(500).json({
        success: false,
        message: "Unable to update order status."
      });
    }

    return res.json({
      success: true,
      message: "Order status updated successfully.",
      order: data
    });

  } catch (error) {
    console.error("STATUS SERVER ERROR:", error);

    return res.status(500).json({
      success: false,
      message: "Something went wrong."
    });
  }
});

export default app;
