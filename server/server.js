import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { supabase } from "./supabase.js";

dotenv.config();

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
          subtotal,
          delivery_fee,
          total,
          status: "pending"
        }
      ])
      .select()
      .single();

if (error) {
  console.error("Database error:", error);

  return res.status(500).json({
    success: false,
    message: `Database error: ${error.message}`,
    details: error.details || null,
    hint: error.hint || null,
    code: error.code || null
  });
}

    res.status(201).json({
      success: true,
      message: "Order received successfully.",
      order: data
    });
  } catch (error) {
    console.error("Server error:", error);

    res.status(500).json({
      success: false,
      message: "Something went wrong."
    });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Gbemiolofada Foods API running on port ${PORT}`);
});
