# Deploy a Vercel

## 📦 Configuración

Este proyecto usa **variables de entorno dinámicas en runtime** para Vercel.

### 1. Conecta tu repo a Vercel

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Importa tu repositorio `ova-projetct`

### 2. Configura las variables de entorno en Vercel

En **Settings → Environment Variables**, añade:

```
SUPABASE_URL =
SUPABASE_ANON_KEY =
```

**Importante:**
- Usa los nombres exactos (sin prefijos)
- Vercel las inyectará durante el build vía `scripts/generate-config.js`
- Se generará `/config.json` con los valores

### 3. Build Command en Vercel

Vercel detectará automáticamente `vercel-build` en `package.json`:

```json
"vercel-build": "node scripts/generate-config.js && ng build"
```

### 4. Deploy

Click **Deploy** — Vercel:
1. Ejecutará `generate-config.js` (crea `/config.json` con tus env vars)
2. Compilará Angular con `ng build`
3. Angular cargará `/config.json` antes del bootstrap (vía `APP_INITIALIZER`)

---

## 🛠️ Desarrollo local

```bash
# Genera config.json desde .env
node scripts/generate-config.js

# Inicia el servidor
npm start
```

El script usa las variables de tu `.env` como fallback si no están en `process.env`.

---

## ✅ Ventajas de este enfoque

- ✅ Variables editables sin recompilar (cambias en Vercel → redeploy automático)
- ✅ No expones credenciales en el código
- ✅ Mismo flujo en local y producción
- ✅ `SUPABASE_ANON_KEY` es segura para el frontend (diseñada para ser pública)

---

## 🔐 Seguridad

**NUNCA añadas a Vercel:**
- `SUPABASE_SERVICE_ROLE_KEY` (solo para backend/scripts locales como `create-admin.ts`)

**SÍ puedes añadir:**
- `SUPABASE_URL` y `SUPABASE_ANON_KEY` (públicas por diseño de Supabase)
