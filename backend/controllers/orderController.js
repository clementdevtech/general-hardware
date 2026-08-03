import { sendEmail } from "./emailController.js";
import Order from "../models/Order.js";

const appendEmailLog = async (orderId, entry) => {
  try {
    await Order.findByIdAndUpdate(orderId, { $push: { emails: entry } });
  } catch (err) {
    console.error("Failed to append email log:", err?.message || err);
  }
};

// POST /api/orders
export const placeOrder = async (req, res) => {
  try {
    const { name, email, phone, location, items, total } = req.body;

    if (!name || !phone || !items || items.length === 0) {
      return res.status(400).json({ error: "Name, phone and items are required" });
    }

    const orderRecord = new Order({
      name,
      phone,
      email,
      location,
      items: items.map((it) => ({ name: it.name, qty: it.qty, price: Number(it.price) || 0 })),
      total: Number(total) || 0,
      status: "pending",
    });

    await orderRecord.save();

    const itemsHtml = orderRecord.items
      .map((it) => `<li>${it.name} x${it.qty} - KES ${it.price}</li>`)
      .join("");

    const salesHtml = `
      <h2>New Order from General Hardware Website</h2>
      <p><b>Order ID:</b> ${orderRecord._id}</p>
      <p><b>Name:</b> ${name}</p>
      <p><b>Phone:</b> ${phone}</p>
      <p><b>Email:</b> ${email || '—'}</p>
      <p><b>Location:</b> ${location || 'Not provided'}</p>
      <h3>Items</h3>
      <ul>${itemsHtml}</ul>
      <p><b>Total:</b> KES ${orderRecord.total}</p>
    `;

    const salesResult = await sendEmail(process.env.EMAIL_USER, "New Order Received", salesHtml);
    await appendEmailLog(orderRecord._id, {
      to: process.env.EMAIL_USER,
      subject: "New Order Received",
      provider: salesResult.provider || "smtp",
      status: salesResult.success ? "sent" : "failed",
      error: salesResult.error || null,
      sentAt: new Date(),
    });

    if (email) {
      const customerHtml = `
        <h2>Order Confirmation — General Hardware</h2>
        <p>Hi ${name},</p>
        <p>Thanks for your order. We've received the following items:</p>
        <ul>${itemsHtml}</ul>
        <p><b>Total:</b> KES ${orderRecord.total}</p>
        <p>Order ID: <b>${orderRecord._id}</b></p>
        <p>We will contact you on ${phone} to confirm delivery.</p>
      `;
      const customerResult = await sendEmail(email, "Order Received — General Hardware", customerHtml);
      await appendEmailLog(orderRecord._id, {
        to: email,
        subject: "Order Received — General Hardware",
        provider: customerResult.provider || "smtp",
        status: customerResult.success ? "sent" : "failed",
        error: customerResult.error || null,
        sentAt: new Date(),
      });
    }

    return res.json({ success: true, orderId: orderRecord._id });
  } catch (err) {
    console.error("Order error:", err);
    return res.status(500).json({ error: "Failed to place order" });
  }
};

export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    return res.json(orders);
  } catch (err) {
    console.error("Get orders error:", err);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
};

export const getOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    return res.json(order);
  } catch (err) {
    console.error("Get order error:", err);
    return res.status(500).json({ error: "Failed to fetch order" });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }

    const allowedStatuses = ["pending", "processing", "dispatched", "completed", "cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status" });
    }

    const order = await Order.findByIdAndUpdate(id, { status }, { new: true });
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.email) {
      const statusHtml = `
        <h2>Order Status Updated</h2>
        <p>Hi ${order.name},</p>
        <p>Your order <b>${order._id}</b> status is now <strong>${status}</strong>.</p>
        <p>We will contact you if there are any updates.</p>
      `;
      const statusResult = await sendEmail(order.email, `Order ${status} — General Hardware`, statusHtml);
      await appendEmailLog(order._id, {
        to: order.email,
        subject: `Order ${status} — General Hardware`,
        provider: statusResult.provider || "smtp",
        status: statusResult.success ? "sent" : "failed",
        error: statusResult.error || null,
        sentAt: new Date(),
      });
    }

    return res.json(order);
  } catch (err) {
    console.error("Update order status error:", err);
    return res.status(500).json({ error: "Failed to update order status" });
  }
};
