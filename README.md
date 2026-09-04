# 🌍 COMPANY - Peer Support for Kenya

A web-based peer support platform connecting Kenyans struggling with depression and demotivation. **Free. Private. No judgment.**

## 🎯 Mission

Company provides real human connection when you need it most. Peer-to-peer chat and video support from people who understand. An AI guide available anytime. Built for Kenya, by Kenyans who care.

---

## ✨ Features

### Core
- **Text Chat** - Peer matching and anonymous messaging
- **Live Video** - Face-to-face connection with privacy blur
- **AI Guide** - 24/7 AI support (fallback + anytime)
- **Message History** - Stored locally on your device
- **Completely Private** - No accounts, no tracking, no data collection beyond session

### Safety & Privacy
- **18+ Age Gate** - Facial detection for verification (optional, local only)
- **Facial Privacy** - Blur your video feed in live calls
- **Anonymous by Default** - Show your name only if you want to
- **Legal Disclaimer** - Clear warnings about offline meetings (not our responsibility)
- **Privacy Controls** - Location sharing, camera access all optional

### Kenya-Focused
- **Kenya Emergency Numbers** - Befrienders Kenya, Red Cross, local hospitals
- **KES Support** - M-Pesa, Stripe, PayPal donations (coming soon)
- **Nairobi-First** - But accessible nationwide (online)
- **Local Time Zone** - EAT (UTC+3)

### Monetization-Ready
- **Donation Button** - Stripe/M-Pesa/PayPal integration
- **Premium Features** - (Optional: priority matching, video filters, etc.)
- **Sponsorships** - Mental health organizations
- **Grants** - NGOs, tech for good programs

---

## 🏗️ Architecture

```
company/
├── index.html           # Landing page with age gate
├── chat.html            # Main chat & video interface
├── styles.css           # Complete styling
├── app.js               # Core application logic
├── README.md            # This file
└── deployment/
    ├── docker/          # Docker setup
    ├── vercel.json      # Vercel deployment config
    └── env.example      # Environment variables
```

### Tech Stack
- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Video:** WebRTC (real browser connections)
- **Face Detection:** TensorFlow.js + FaceMesh (optional, local-only)
- **Storage:** IndexedDB (messages) + LocalStorage (settings)
- **Database:** (Optional: Firebase, Supabase, or self-hosted)
- **Deployment:** Vercel, Netlify, or self-hosted on AWS/Azure

---

## 🚀 Getting Started

### Local Development

1. **Clone the repo:**
```bash
git clone https://github.com/yourusername/company.git
cd company
```

2. **Start a local server:**
```bash
# Using Python 3
python -m http.server 8000

# Or using Node.js
npx http-server
```

3. **Open in browser:**
```
http://localhost:8000
```

### Quick Deploy to Vercel (Recommended for Kenya)

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Configure:**
- Select your project
- Set deployment region to nearest to Kenya (Europe or Africa)
- Connect custom domain (company.ke or similar)

### Docker Deployment

1. **Build image:**
```bash
docker build -t company:latest .
```

2. **Run container:**
```bash
docker run -p 3000:3000 company:latest
```

### Self-Hosted on AWS/Azure/DigitalOcean

**Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 3000
CMD ["npx", "http-server", "-p", "3000"]
```

**Deploy with:**
- AWS EC2 + CloudFront
- Azure App Service
- DigitalOcean Apps
- Heroku

---

## 🔧 Configuration

### Environment Variables

Create `.env` file:
```env
# Deployment
VITE_API_URL=https://company.ke
VITE_ENVIRONMENT=production

# Optional: Firebase
VITE_FIREBASE_API_KEY=your_key
VITE_FIREBASE_PROJECT_ID=your_project

# Optional: Analytics
VITE_GOOGLE_ANALYTICS_ID=your_ga_id

# Payment
VITE_STRIPE_PUBLIC_KEY=your_stripe_key
VITE_MPESA_API_KEY=your_mpesa_key
```

### Domain & SSL

For Kenya deployment:
1. **Register domain:** `.ke` domain from ICTA-accredited registrar
2. **SSL Certificate:** Let's Encrypt (free)
3. **CDN:** Cloudflare (faster for Kenya access)

```
company.ke → Cloudflare CDN → Vercel/Your Server
```

---

## 📱 Mobile Optimization

The app is mobile-first:
- Responsive design (works on all phones)
- Touch-optimized buttons
- Minimal data usage
- Works on 2G+ networks (with fallbacks)

Test on:
- Chrome/Firefox mobile
- Safari iOS
- Samsung Internet

---

## 🔒 Security & Privacy

### Backend (If Needed)

```javascript
// Minimal backend for message relay + moderation
app.post('/api/chat/send', (req, res) => {
    const { message, userId } = req.body;
    
    // No logging of message content
    // No IP collection beyond rate limiting
    // Automatic message deletion after 30 days
    
    res.json({ status: 'sent' });
});
```

### Data Handling
- ✅ Messages stored **locally** on device by default
- ✅ Optional server relay (end-to-end encrypted if enabled)
- ✅ No user profiling
- ✅ No selling data to third parties
- ✅ GDPR-compliant (even though Kenya-focused)

### Rate Limiting
```
- 100 messages/hour per session
- 10 new connections/hour
- Prevents abuse, not blocking legitimate use
```

---

## 📊 Monitoring & Support

### Error Tracking
```javascript
// Sentry integration (optional)
Sentry.init({
    dsn: "your_sentry_dsn",
    environment: "production"
});
```

### Moderation (Community Safety)
- Report button on each conversation
- AI content filtering (optional)
- Manual review queue for serious violations
- Ban system for abusers

### Analytics (Privacy-First)
```javascript
// Only track: page views, errors, performance
// Never: user behavior, message content, location
```

---

## 🇰🇪 Kenya-Specific Setup

### Telecom Optimization
- Works on Safaricom, Airtel, Equity networks
- Video compression for low bandwidth
- SMS fallback (optional: 100 KES for chat via SMS)

### Payment Integration
```javascript
// M-Pesa via Pesapal or Safaricom API
async function donateViaMpesa(amount) {
    // amount in KES
    // Redirect to M-Pesa prompt
    // Callback to verify payment
}
```

### Emergency Resources (Pre-loaded)
```javascript
const emergencyNumbers = {
    'Befrienders Kenya': '0722 178 177',
    'Kenya Red Cross': '1199',
    'Police': '999',
    'Ambulance': '+254 700 622 444'
};
```

### Localization
- Swahili support (coming v2.0)
- KES currency
- East Africa Time (EAT)

---

## 📈 Growth & Monetization

### Phase 1 (Now)
- Free peer support + AI guide
- Optional donations
- No premium tier

### Phase 2 (6 months)
- Partner with mental health NGOs
- Grants from tech-for-good programs
- Premium features (optional, still free to access)

### Phase 3 (1 year)
- Corporate wellness partnerships
- Licensed therapist integration (optional)
- Educational content + courses

---

## 🤝 Contributing

We welcome:
- **Bug reports** - Found something broken? Submit an issue
- **Feature ideas** - Have an idea? Let's discuss
- **Translations** - Help translate to Swahili, other languages
- **Peer moderators** - Help keep the community safe

### Code Style
```javascript
// Use clear, simple JavaScript
// Comment complex logic
// Test on real Kenya networks
// Validate accessibility (WCAG 2.1 AA)
```

---

## ⚖️ Legal & Liability

**Company is NOT:**
- Emergency medical service
- Mental health treatment
- Crisis hotline replacement
- Matchmaking service

**Users agree to:**
- Be 18+ years old
- Use platform responsibly
- Not share explicit content
- Report abuse immediately
- Meet offline at own risk (Company not liable)

**See full terms:** [Legal](/legal/terms.html)

---

## 🆘 Support & Contact

### For Users
- **Emergency:** Befrienders Kenya 0722 178 177
- **Report Abuse:** report@company.ke
- **General Help:** help@company.ke

### For Developers
- **GitHub Issues:** [company/issues](https://github.com/company/issues)
- **Discord:** [Join community](https://discord.gg/company)
- **Email:** dev@company.ke

---

## 📜 License

Creative Commons + Open Source

- Free to use, modify, deploy
- Credit Company as origin
- No selling without permission
- Community-first always

---

## 🙏 Acknowledgments

Built for every Kenyan dealing with depression, demotivation, loneliness. You're not alone.

Special thanks to:
- Befrienders Kenya
- Kenya Mental Health Association
- ICTA (Kenyan tech authority)
- All peer supporters

---

## 🎯 Roadmap

```
Q1 2024 - MVP Launch
├─ Text chat
├─ Video support
└─ AI guide

Q2 2024 - Scaling
├─ Swahili UI
├─ M-Pesa integration
└─ 100k users goal

Q3 2024 - Partnerships
├─ NGO integrations
├─ Corporate wellness
└─ Professional support tiers

Q4 2024 - Sustainability
├─ Grants
├─ Donations
└─ Break-even operations
```

---

**Made with ❤️ for Kenya**

```
+ company
```
