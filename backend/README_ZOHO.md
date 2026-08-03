Zoho Mail & MongoDB setup

Required environment variables (backend/.env):

- MONGO_URI=mongodb+srv://<user>:<pass>@cluster0.mongodb.net/dbname
- EMAIL_USER=your-smtp-or-zoho-from-address@example.com
- EMAIL_PASS=your-smtp-password (only needed for SMTP fallback)
- ZOHO_API_TOKEN=your_zoho_oauth_access_token
- ZOHO_ACCOUNT_ID=your_zoho_mail_account_id
- ZOHO_CLIENT_ID=your_zoho_oauth_client_id
- ZOHO_CLIENT_SECRET=your_zoho_oauth_client_secret
- ZOHO_REFRESH_TOKEN=your_zoho_oauth_refresh_token
- ZOHO_REDIRECT_URI=http://localhost:5000/api/auth/zoho/callback
- COMPANY_NAME=General Hardware
- COMPANY_DOMAIN=generalhardware.co.ke

Notes:
- If `ZOHO_API_TOKEN` and `ZOHO_ACCOUNT_ID` are provided, the backend will use Zoho Mail API to send messages via:
  `POST https://mail.zoho.com/api/accounts/{ZOHO_ACCOUNT_ID}/messages` with header `Authorization: Zoho-oauthtoken {ZOHO_API_TOKEN}`.
- If Zoho is not configured, the backend falls back to SMTP using `EMAIL_USER`/`EMAIL_PASS` (currently configured for Gmail SMTP).
- To get a Zoho API token you typically need to create an OAuth client in Zoho and generate an access token (or use a server-to-server OAuth flow). Store the access token in `ZOHO_API_TOKEN`.

Testing:
- Start backend with `npm run dev` and POST an order to `/api/orders`.
- Verify an `Order` document is created in MongoDB and emails are sent (check Zoho logs or SMTP provider).

Security:
- Never commit `.env` or secrets to version control. Use environment variables in your deployment environment.
