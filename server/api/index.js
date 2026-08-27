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

app.post("/api/orders", async (req, res) => {
  try {
    console.log("ORDER REQUEST RECEIVED");
    console.log("Customer:", req.body);

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

    console.log("ORDER SAVED:", data);

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

export default app;
