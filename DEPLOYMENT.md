# 🚀 DEPLOYMENT GUIDE - Company for Kenya

Complete guide to deploy Company to production in Kenya.

---

## 1️⃣ QUICK START (5 minutes)

### Option A: Vercel (Easiest)

1. **Push to GitHub:**
```bash
git init
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Connect to Vercel:**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repo
   - Deploy (automatic)

3. **Get your domain:**
   - Vercel gives you free `.vercel.app` domain
   - Or buy custom domain at `.ke` registrar (ICTA-approved)

**Cost:** FREE tier (perfect for MVP)

### Option B: Netlify (Also Easy)

1. **Connect GitHub repo**
2. **Deploy** (automatic)
3. **Custom domain:** company.ke (buy separately)

**Cost:** FREE tier

---

## 2️⃣ DOMAIN SETUP (Kenya)

### Buy a .ke Domain

**Kenyan Registrars:**
1. **Wix Kenya** - https://www.wix.com/en-KE/domains
2. **GoDaddy** - https://godaddy.com (select Kenya)
3. **Nairobi Domains** - Local provider
4. **Host Africa** - https://hostfrica.co.ke

**Steps:**
```
1. Search: company.ke (or companyke.ke, companysupport.ke)
2. Register for 1 year (~2,500 KES)
3. Get DNS credentials
4. Point to Vercel/Netlify via DNS settings
```

### SSL Certificate (Free)

Both Vercel and Netlify provide **automatic free SSL**:
- ✅ HTTPS enabled
- ✅ Auto-renewal
- ✅ No extra cost

---

## 3️⃣ DATABASE SETUP (Optional)

### No Database (Recommended for MVP)

**Current setup uses:**
- LocalStorage (messages on device)
- BroadcastChannel (cross-tab sync)
- No backend needed

**Pros:** Instant deployment, no maintenance, ultra-private
**Cons:** No cloud backup, limited scaling

### Firebase (Simple Backend)

```javascript
// Add to app.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  // ... other config
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Save message to Firebase
async function saveMessageToCloud(message) {
    await addDoc(collection(db, "messages"), {
        text: message.text,
        userId: message.userId,
        timestamp: new Date(),
        // No IP, no location, no PII
    });
}
```

**Setup:**
1. Go to [firebase.google.com](https://firebase.google.com)
2. Create new project
3. Enable Firestore
4. Copy config to `.env`
5. Add Firebase SDK

**Cost:** FREE tier (1GB storage, enough for 100k users)

### Supabase (PostgreSQL Alternative)

```javascript
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
    process.env.VITE_SUPABASE_URL,
    process.env.VITE_SUPABASE_KEY
);

// Save message
const { data, error } = await supabase
    .from('messages')
    .insert({ text, userId, created_at: new Date() });
```

**Setup:**
1. Go to [supabase.com](https://supabase.com)
2. Create project
3. Run SQL migrations
4. Copy credentials to `.env`

**Cost:** FREE tier (500MB database)

---

## 4️⃣ PAYMENT INTEGRATION (M-Pesa + Stripe)

### M-Pesa (Safaricom)

**Option 1: Pesapal**
```javascript
// https://pesapal.com

async function initiateDonation(amount) {
    const response = await fetch('https://api.pesapal.com/api/PostPesapalDirectOrderV4', {
        method: 'POST',
        body: JSON.stringify({
            amount: amount, // KES
            currency: 'KES',
            description: 'Support Company',
            reference: 'COMPANY-' + Date.now(),
            first_name: 'Anonymous',
            email: 'donate@company.ke'
        })
    });
    return response.json();
}
```

**Option 2: Safaricom API**
```javascript
// Requires: Business Account with Safaricom
// Process STK Push to get payment

async function sendMpesaPrompt(phoneNumber, amount) {
    const response = await fetch('/api/mpesa/stkpush', {
        method: 'POST',
        body: JSON.stringify({
            phone: phoneNumber, // 254XXXXXXXXX
            amount: amount // KES
        })
    });
    return response.json();
}
```

**Setup Pesapal (Easier):**
1. Register at [pesapal.com](https://pesapal.com)
2. Verify your business
3. Get API keys
4. Add to `.env`:
```
VITE_PESAPAL_API_KEY=your_key
VITE_PESAPAL_CONSUMER_KEY=your_key
```

### Stripe (International Card Payments)

```javascript
// Load Stripe JS
<script src="https://js.stripe.com/v3/"></script>

async function donateViaCard(amount) {
    const stripe = Stripe(process.env.VITE_STRIPE_KEY);
    
    const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        body: JSON.stringify({ amount })
    });
    
    const { clientSecret } = await response.json();
    
    await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: cardElement }
    });
}
```

**Setup Stripe:**
1. Go to [stripe.com](https://stripe.com)
2. Create account (Kenya available)
3. Get publishable + secret keys
4. Test with Stripe test cards first
5. Go live (instant approval for nonprofits)

**Cost:** 2.9% + 30 KES per transaction

---

## 5️⃣ ANALYTICS (Privacy-First)

### Plausible (Recommended - Privacy-First)

```html
<!-- Add to index.html -->
<script defer data-domain="company.ke" src="https://plausible.io/js/script.js"></script>
```

**Tracks:**
- ✅ Page views
- ✅ Error rates
- ✅ Performance

**Does NOT track:**
- ❌ User behavior
- ❌ Message content
- ❌ Personal data

**Cost:** $9-20/month

### Google Analytics (Free Alternative)

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_ID', {
    'anonymize_ip': true, // Privacy!
    'allow_google_signals': false
  });
</script>
```

---

## 6️⃣ EMAIL & NOTIFICATIONS

### SendGrid (Transactional Email)

```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendWelcomeEmail(userEmail) {
    await sgMail.send({
        to: userEmail,
        from: 'hello@company.ke',
        subject: 'Welcome to Company',
        html: '<p>You\'re not alone. We\'re here for you.</p>'
    });
}
```

**Setup:**
1. Go to [sendgrid.com](https://sendgrid.com)
2. Create account
3. Verify sender email
4. Get API key

**Cost:** FREE tier (100 emails/day)

### Twilio SMS (Optional)

```javascript
const twilio = require('twilio');
const client = twilio(account_sid, auth_token);

async function sendSMS(phoneNumber, message) {
    return await client.messages.create({
        body: message,
        from: '+1234567890', // Twilio number
        to: '+254' + phoneNumber
    });
}
```

**For Kenya SMS outreach** (optional future feature)

---

## 7️⃣ MONITORING & ERROR TRACKING

### Sentry (Error Tracking)

```javascript
// https://sentry.io
import * as Sentry from "@sentry/browser";

Sentry.init({
    dsn: process.env.VITE_SENTRY_DSN,
    environment: 'production',
    tracesSampleRate: 0.1
});
```

**Setup:**
1. Go to [sentry.io](https://sentry.io)
2. Create project (JavaScript)
3. Get DSN
4. Add to `.env`

**Cost:** FREE tier (5,000 errors/month)

---

## 8️⃣ CI/CD PIPELINE (Automatic Deployments)

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Company

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Run tests
        run: npm test
      
      - name: Build
        run: npm run build
      
      - name: Deploy to Vercel
        uses: vercel/action@master
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
```

**Setup:**
1. Go to GitHub repo settings
2. Add secrets (from Vercel)
3. Commit → Auto-deploys

---

## 9️⃣ ENVIRONMENTAL VARIABLES (.env)

```env
# Deployment
NODE_ENV=production
VITE_API_URL=https://company.ke

# Firebase (optional)
VITE_FIREBASE_API_KEY=xxx
VITE_FIREBASE_PROJECT_ID=xxx

# Payments (optional)
VITE_STRIPE_PUBLIC_KEY=pk_live_xxx
VITE_PESAPAL_CONSUMER_KEY=xxx

# Analytics (optional)
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx

# Email (optional)
SENDGRID_API_KEY=SG.xxx
TWILIO_ACCOUNT_SID=ACxxx
TWILIO_AUTH_TOKEN=xxx
```

**NEVER commit .env to GitHub!**

---

## 🔟 PERFORMANCE OPTIMIZATION

### CDN Setup (Cloudflare)

1. **Buy domain** on Namecheap/GoDaddy
2. **Point nameservers** to Cloudflare
3. **Free tier:**
   - Global CDN (super fast for Kenya)
   - DDoS protection
   - Automatic HTTPS

### Image Optimization

```javascript
// Use WebP with fallback
<picture>
  <source srcset="image.webp" type="image/webp">
  <img src="image.jpg" alt="description">
</picture>
```

### Code Minification

```bash
# Automatically done by Vercel/Netlify
# Or manually:
npm install -g minify
minify app.js > app.min.js
```

### Test Performance

```bash
# Lighthouse CLI
npm install -g @lhci/cli@
lhci autorun

# Result: Should be 90+ scores ✨
```

---

## 🅾️ SCALING UP

### Phase 1: MVP (Now)
- Vercel free tier
- LocalStorage only
- No database
- ~100 concurrent users

### Phase 2: Growth (When needed)
- Add Firebase/Supabase
- Upgrade Vercel to Pro
- CDN in multiple regions
- ~10,000 concurrent users

### Phase 3: Scale (Enterprise)
- Self-hosted on AWS/Azure
- Load balancing
- Multiple servers
- ~100,000+ users

---

## 🚨 SECURITY CHECKLIST

- [ ] HTTPS enabled (automatic on Vercel)
- [ ] `Content-Security-Policy` headers set
- [ ] Rate limiting on API (if using backend)
- [ ] Input sanitization (XSS protection)
- [ ] CORS properly configured
- [ ] Secrets in `.env` (never in code)
- [ ] Regular dependency updates
- [ ] Backup strategy in place

---

## 📊 LAUNCH CHECKLIST

- [ ] Domain registered (.ke)
- [ ] SSL certificate (free via Vercel)
- [ ] Deployed to production
- [ ] Domain DNS pointed correctly
- [ ] Emergency numbers configured
- [ ] Payment system tested
- [ ] Analytics enabled
- [ ] Error tracking set up
- [ ] Legal pages published
- [ ] Moderation plan in place
- [ ] Beta tester feedback received
- [ ] Press release ready

---

## 💪 Kenya Network Optimization

### For Safaricom Users
```javascript
// Detect network type
if (navigator.connection.effectiveType === '4g') {
    // Show HD video option
} else if (navigator.connection.effectiveType === '3g') {
    // Use lower bitrate video
}
```

### Data Saver Mode
```javascript
if (navigator.connection.saveData) {
    // Disable auto-play video
    // Use text-only mode
    // Compress images
}
```

### Test on Real Networks
- Safaricom 4G/3G
- Airtel Kenya
- Equity networks
- Use browser throttling tools

---

## 🆘 TROUBLESHOOTING

### App not loading?
1. Check browser console (F12)
2. Check deployment logs (Vercel dashboard)
3. Verify DNS settings

### Video not working?
1. Check camera permissions
2. Ensure HTTPS (required for camera)
3. Test on different browser

### Payment failing?
1. Check M-Pesa/Stripe test mode
2. Verify API keys in `.env`
3. Check rate limiting

### Messages not saving?
1. Check localStorage available
2. Check browser privacy settings
3. Try incognito mode

---

## 📞 SUPPORT

- **Deployment Help:** dev@company.ke
- **Issues:** GitHub Issues
- **Urgent:** Direct message on Twitter

---

**Ready to deploy? You've got this! 🚀**

```
+ company 🇰🇪
```
