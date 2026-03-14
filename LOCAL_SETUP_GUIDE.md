# Local Development Setup Guide
## StoreHubBD — Step by Step for Windows

Follow this guide exactly before starting Phase 1 of the build plan.

---

## Current Status (Auto Checked)

| Tool | Status | Version |
|------|--------|---------|
| Node.js | ✅ Installed | v22.19.0 |
| npm | ✅ Installed | v11.6.0 |
| Git | ✅ Installed | v2.48.1 |
| Python | ✅ Installed | v3.11.7 (use `py` command) |
| pip | ✅ Installed | (via `py -m pip`) |
| Docker | ⏭️ Skipped | Will add later if needed |
| Docker Compose | ⏭️ Skipped | Will add later if needed |
| PostgreSQL | ✅ Installed | port 5432 |

**All required tools are installed. Docker is skipped for now — will run services directly.**

---

## Step 1 — Install Node.js ✅ DONE (v22.19.0)

Already installed. Skip this step.

---

## Step 2 — Install Python ✅ DONE (v3.11.7)

Already installed. Use `py` command instead of `python`:
```
py --version
py -m pip --version
```

---

## Step 3 — Docker Desktop ⏭️ SKIPPED

Docker is skipped for now. Services will run directly:
- FastAPI → run with `py -m uvicorn`
- Next.js → run with `npm run dev`
- PostgreSQL → already running locally on port 5432

Will revisit Docker when deploying to production.

---

## Step 4 — Verify PostgreSQL

You already installed PostgreSQL. Let's confirm it's running:

1. Open **pgAdmin 4** from Start menu
2. Login with the password you set during installation
3. You should see `PostgreSQL 18` in the left panel
4. Expand it → you should see `Databases`

If pgAdmin opens and connects — PostgreSQL is working.

---

## Step 5 — Create the Database

1. In pgAdmin, right click on **Databases**
2. Click **Create → Database**
3. Name it: `storehubbd`
4. Click **Save**

You should now see `storehubbd` under Databases.

---

## Step 6 — Install Git ✅ DONE (v2.48.1)

Already installed. Skip this step.

---

## Step 7 — Install VS Code (Recommended)

1. Go to `https://code.visualstudio.com`
2. Download and install
3. Install these extensions inside VS Code:
   - **Python** (by Microsoft)
   - **Pylance**
   - **ESLint**
   - **Prettier**
   - **Tailwind CSS IntelliSense**
   - **Docker**

---

## Step 8 — Final Verification Checklist

After completing Steps 2 and 3, open **Command Prompt** and run each command. All must return version numbers:

```
node --version
npm --version
python --version
pip --version
docker --version
docker-compose --version
git --version
```

Expected results:
| Command | Expected |
|---------|---------|
| node --version | v22.19.0 ✅ already passing |
| npm --version | v11.6.0 ✅ already passing |
| python --version | Should print 3.11+ after install |
| pip --version | Should print version after install |
| docker --version | Should print version after install |
| docker-compose --version | Should print version after install |
| git --version | v2.48.1 ✅ already passing |

If all 7 pass — your machine is ready.

---

## Step 9 — Configure Windows Hosts File (For Subdomain Testing)

This lets your browser treat `arjha.localhost` as a real subdomain locally.

1. Open **Notepad as Administrator**
   - Press Windows key
   - Type `Notepad`
   - Right click → **Run as administrator**

2. Open this file in Notepad:
```
C:\Windows\System32\drivers\etc\hosts
```

3. Add these lines at the bottom:
```
127.0.0.1 app.localhost
127.0.0.1 arjha.localhost
127.0.0.1 testshop.localhost
```

4. Save the file

5. Verify by opening browser and going to `http://app.localhost:3000` later when the app is running.

> **Note**: Every time you onboard a new test seller, add their subdomain here too.

---

## Step 10 — Tell Claude You Are Ready

Once Steps 2 and 3 are done and all 7 verification commands pass, tell me:

> "Local setup done. Python installed. Docker running. Database storehubbd created."

Then we start **Phase 1 — Project Setup** of the build plan.

---

## Common Issues & Fixes

| Problem | Fix |
|---------|-----|
| Docker says WSL2 not installed | Follow the popup — it guides you to install WSL2 from Microsoft Store |
| Python not found after install | Close and reopen Command Prompt. If still not found, manually add Python to PATH in Environment Variables |
| pgAdmin won't connect | Make sure PostgreSQL service is running. Open Windows Services (services.msc), find postgresql-x64-18, click Start |
| `docker-compose` command not found | In newer Docker Desktop, use `docker compose` (without hyphen) instead |
| Hosts file won't save | Make sure Notepad was opened as Administrator |
