import { sendEmail } from "./emailController.js";

export const contactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const html = `
      <h2>New Contact Message from Baraka Homes Website</h2>
      <p><b>Name:</b> ${name}</p>
      <p><b>Email:</b> ${email}</p>
      <p><b>Message:</b> ${message}</p>
    `;

    await sendEmail("sales@barakahomes.com", "New Contact Form Message", html);

    res.json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    console.error("Contact form error:", err);
    res.status(500).json({ error: "Failed to send message" });
  }
};
