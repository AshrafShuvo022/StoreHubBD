# Running StoreHubBD Locally

## Prerequisites
- Python conda env `storehubbd` installed
- Node.js installed
- PostgreSQL running on port 5432 (installed at `D:\Program Files\PostgreSQL\18`)

---

## Start the Backend

Open a terminal in `E:\StoreHubBD\backend` and run:

```powershell
C:\Users\fmrah\.conda\envs\storehubbd\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

API will be available at: `http://localhost:8000`
Interactive docs at: `http://localhost:8000/docs`

---

## Start the Frontend

Open a **second** terminal in `E:\StoreHubBD\frontend` and run:

```powershell
npm run dev
```

Frontend will be available at: `http://localhost:3000`

---

## Test URLs

| URL | What it does |
|-----|-------------|
| `http://localhost:3000` | Landing page |
| `http://app.localhost:3000/register` | Seller registration |
| `http://app.localhost:3000/login` | Seller login |
| `http://app.localhost:3000/dashboard` | Seller dashboard |
| `http://arjha.localhost:3000` | Customer store (subdomain) |

> **Note:** Subdomain URLs require hosts file entries — see below.

---

## One-Time: Add Subdomain Entries to Hosts File

1. Open Notepad **as Administrator**
2. Open file: `C:\Windows\System32\drivers\etc\hosts`
3. Add these lines at the bottom:

```
127.0.0.1 app.localhost
127.0.0.1 arjha.localhost
```

4. Save and close. Add a new line for each new store you want to test locally.

---

## Common Errors & Fixes

### `uvicorn is not recognized`
PowerShell is using the base conda Python, not the project env.
**Fix:** Always use the full path:
```powershell
C:\Users\fmrah\.conda\envs\storehubbd\python.exe -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### `Port 8000 is already in use`
A previous backend process is still running.
**Fix:**
```powershell
netstat -ano | findstr :8000
taskkill /F /PID <pid_from_above>
```

### `npm : File cannot be loaded, running scripts is disabled`
PowerShell execution policy is blocking npm.
**Fix (run once):**
```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

### `Port 3000 is in use` / `Unable to acquire lock`
A previous frontend process is still running.
**Fix:**
```powershell
netstat -ano | findstr :3000
taskkill /F /PID <pid_from_above>
```
Then run `npm run dev` again.

---

## Stop Everything

To stop the backend: press `Ctrl+C` in the backend terminal.
To stop the frontend: press `Ctrl+C` in the frontend terminal.
