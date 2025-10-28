# 🔐 Cloudflare SSL Setup Guide

This guide explains how to set up SSL for `team.elaramedical.com` using Cloudflare Origin Certificates.

## 📋 Prerequisites

- Domain `elaramedical.com` already configured in Cloudflare
- Hetzner server with Docker installed
- Nginx running in Docker container

---

## ✅ Step 1: Configure Cloudflare DNS

1. **Go to Cloudflare Dashboard:**
   - Navigate to your domain: https://dash.cloudflare.com
   - Select `elaramedical.com`

2. **Add DNS Record:**
   - Go to **DNS** → **Records**
   - Click **Add record**
   - Configure:
     - **Type:** A
     - **Name:** `team`
     - **IPv4 address:** Your Hetzner server IP (e.g., `65.108.x.x`)
     - **Proxy status:** ✅ **Proxied** (orange cloud icon)
     - **TTL:** Auto
   - Click **Save**

3. **Optional: Add www subdomain:**
   - **Type:** CNAME
   - **Name:** `www.team`
   - **Target:** `team.elaramedical.com`
   - **Proxy status:** ✅ **Proxied**

---

## 🔒 Step 2: Configure SSL/TLS Mode

1. **Go to SSL/TLS Settings:**
   - In Cloudflare dashboard → **SSL/TLS** → **Overview**

2. **Select Encryption Mode:**
   - Choose **Full (strict)** (Recommended for production)
   - This ensures encrypted connection between Cloudflare and your server

3. **Enable Additional Security (Optional):**
   - Go to **SSL/TLS** → **Edge Certificates**
   - Enable:
     - ✅ Always Use HTTPS
     - ✅ HTTP Strict Transport Security (HSTS)
     - ✅ Minimum TLS Version: TLS 1.2
     - ✅ Opportunistic Encryption
     - ✅ Automatic HTTPS Rewrites

---

## 📜 Step 3: Generate Cloudflare Origin Certificate

1. **Create Certificate:**
   - Go to **SSL/TLS** → **Origin Server**
   - Click **Create Certificate**

2. **Configure Certificate:**
   - **Private key type:** RSA (2048)
   - **Hostnames:**
     ```
     team.elaramedical.com
     *.elaramedical.com
     ```
   - **Certificate validity:** 15 years
   - Click **Create**

3. **Save Certificate Files:**
   - You'll see two text boxes:
     - **Origin Certificate** (public certificate)
     - **Private Key** (keep this secret!)
   - **IMPORTANT:** Copy both now - you won't see them again!

---

## 🖥️ Step 4: Install Certificates on Server

SSH into your Hetzner server and run these commands:

```bash
# SSH to server
ssh your-user@your-server-ip

# Navigate to project directory
cd /opt/team-track

# Create certificate directory
mkdir -p certs/live/team.elaramedical.com

# Create certificate file
nano certs/live/team.elaramedical.com/fullchain.pem
```

**Paste the Origin Certificate** from Cloudflare, then save (Ctrl+X, Y, Enter)

```bash
# Create private key file
nano certs/live/team.elaramedical.com/privkey.pem
```

**Paste the Private Key** from Cloudflare, then save (Ctrl+X, Y, Enter)

```bash
# Set correct permissions
chmod 600 certs/live/team.elaramedical.com/privkey.pem
chmod 644 certs/live/team.elaramedical.com/fullchain.pem

# Verify files exist
ls -la certs/live/team.elaramedical.com/
```

You should see:

```
-rw-r--r-- 1 user user 1234 Oct 28 12:00 fullchain.pem
-rw------- 1 user user 5678 Oct 28 12:00 privkey.pem
```

---

## 🔄 Step 5: Deploy with Updated Configuration

The nginx.conf has been updated to work with Cloudflare SSL. Simply deploy:

```bash
# Pull latest code (if not already done)
cd /opt/team-track
git pull origin main

# Ensure certificates are in place
ls -la certs/live/team.elaramedical.com/

# Start services
docker compose -f docker-compose-prod.yml up -d

# Check nginx logs
docker compose -f docker-compose-prod.yml logs nginx
```

---

## ✅ Step 6: Verify SSL is Working

1. **Test in Browser:**
   - Visit: https://team.elaramedical.com
   - Click the padlock icon in address bar
   - Verify certificate is valid

2. **Test SSL Grade:**
   - Visit: https://www.ssllabs.com/ssltest/
   - Enter: `team.elaramedical.com`
   - Should get A or A+ rating

3. **Test from Terminal:**

   ```bash
   # Test connection
   curl -I https://team.elaramedical.com

   # Should return:
   # HTTP/2 200
   # server: nginx
   # ...
   ```

---

## 🔍 Key Features of This Setup

### **What's Included:**

✅ **SSL Termination at Cloudflare**

- Automatic certificate management
- Free SSL certificates
- DDoS protection included

✅ **Encrypted Cloudflare → Server Connection**

- Uses Origin Certificate
- Valid for 15 years
- No renewal needed

✅ **Real IP Restoration**

- Nginx sees actual visitor IPs, not Cloudflare IPs
- Important for logging and access control

✅ **Optimized SSL Settings**

- TLS 1.2 and 1.3 only
- Modern cipher suites
- Session caching enabled

---

## 🚫 What Was Removed

- ❌ **Certbot service** - Not needed with Cloudflare
- ❌ **Let's Encrypt challenges** - Not needed
- ❌ **Certificate renewal cron jobs** - Cloudflare Origin certs last 15 years
- ❌ **certbot-www volume** - No longer used

---

## 🔧 Troubleshooting

### **Problem: "ERR_SSL_VERSION_OR_CIPHER_MISMATCH"**

**Solution:**

- Check Cloudflare SSL/TLS mode is set to **Full (strict)**
- Verify certificate files exist on server
- Restart nginx: `docker compose -f docker-compose-prod.yml restart nginx`

### **Problem: "Cannot reach server"**

**Solution:**

- Verify DNS propagation: `dig team.elaramedical.com`
- Check orange cloud is enabled in Cloudflare DNS
- Wait 5-10 minutes for DNS to propagate

### **Problem: "Certificate is not valid"**

**Solution:**

- Ensure you copied the entire certificate (including BEGIN/END lines)
- Check file permissions: `ls -la certs/live/team.elaramedical.com/`
- Verify Cloudflare SSL mode is **Full (strict)**

### **Problem: "502 Bad Gateway"**

**Solution:**

- Check app container is running: `docker ps`
- Check app logs: `docker compose -f docker-compose-prod.yml logs app`
- Verify database is connected: `docker compose -f docker-compose-prod.yml logs db`

---

## 📊 SSL Flow Diagram

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │ HTTPS (TLS 1.3)
       │ Certificate from Cloudflare
       ▼
┌─────────────────┐
│   Cloudflare    │
│   (SSL Proxy)   │
└──────┬──────────┘
       │ HTTPS (Origin Certificate)
       │ Encrypted connection
       ▼
┌─────────────────┐
│  Your Server    │
│  (Nginx)        │
└──────┬──────────┘
       │ HTTP (internal)
       │ No encryption needed
       ▼
┌─────────────────┐
│  Next.js App    │
│  (Port 3000)    │
└─────────────────┘
```

---

## 🔐 Security Best Practices

✅ **Do:**

- Keep private key files secure (600 permissions)
- Use Full (strict) SSL mode in Cloudflare
- Enable HSTS in Cloudflare
- Enable "Always Use HTTPS"
- Keep Cloudflare proxy enabled (orange cloud)

❌ **Don't:**

- Share your private key file
- Use "Flexible" SSL mode (insecure)
- Commit certificate files to Git (already in .gitignore)
- Disable Cloudflare proxy without proper SSL setup

---

## 📝 Certificate Renewal

**Good news:** Cloudflare Origin Certificates last **15 years**!

You only need to renew in 2040. When that time comes:

1. Generate new Origin Certificate in Cloudflare
2. Replace certificate files on server
3. Restart nginx container

---

## 🆚 Cloudflare SSL vs Let's Encrypt

| Feature            | Cloudflare Origin Cert | Let's Encrypt     |
| ------------------ | ---------------------- | ----------------- |
| Cost               | Free                   | Free              |
| Validity           | 15 years               | 90 days           |
| Auto-renewal       | Not needed             | Required          |
| Setup complexity   | Simple                 | Complex (certbot) |
| DDoS protection    | ✅ Included            | ❌ Not included   |
| CDN                | ✅ Included            | ❌ Not included   |
| Valid for browsers | ❌ Only with CF proxy  | ✅ Everywhere     |

**Recommendation:** Use Cloudflare Origin Certificate (current setup)

---

## 📞 Support Resources

- **Cloudflare SSL Docs:** https://developers.cloudflare.com/ssl/
- **Origin Certificates:** https://developers.cloudflare.com/ssl/origin-configuration/origin-ca/
- **SSL Labs Test:** https://www.ssllabs.com/ssltest/
- **Cloudflare Community:** https://community.cloudflare.com/

---

## ✅ Quick Reference Commands

```bash
# Check certificate files
ls -la certs/live/team.elaramedical.com/

# Test nginx config
docker compose -f docker-compose-prod.yml exec nginx nginx -t

# Restart nginx
docker compose -f docker-compose-prod.yml restart nginx

# View nginx logs
docker compose -f docker-compose-prod.yml logs -f nginx

# Test SSL from command line
curl -vI https://team.elaramedical.com

# Check certificate expiry
openssl x509 -in certs/live/team.elaramedical.com/fullchain.pem -text -noout | grep "Not After"
```

---

**Setup completed!** Your application now uses Cloudflare SSL with secure origin certificates. 🎉
