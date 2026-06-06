# 🚀 Actividad Cloudinary - API REST

API REST completa con: CRUD, Login, Registro, Recuperación de contraseña, Cookies, Correos HTML, Cloudinary y CRUD con arrays.

---

## ⚙️ Instalación

```bash
# 1. Instalar dependencias
npm install

# 2. Configurar el archivo .env con tus credenciales
# (ver sección de configuración abajo)

# 3. Correr el servidor
npm run dev
```

El servidor corre en: `http://localhost:4000`

---

## 🔑 Configuración del .env

Abre el archivo `.env` y llena tus credenciales:

```env
MONGO_URI=mongodb://localhost:27017/actividadCloudinaryDB
JWT_SECRET_KEY=tuLlaveSecretaAqui123

# Gmail: necesitas crear una "Contraseña de aplicación" en Google
USER_EMAIL=tucorreo@gmail.com
USER_PASSWORD=tuPasswordDeAplicacion

# Cloudinary (en tu dashboard de cloudinary.com)
CLOUDINARY_CLOUD_NAME=tuCloudName
CLOUDINARY_API_KEY=tuApiKey
CLOUDINARY_API_SECRET=tuApiSecret
```

---

## 📌 TODOS LOS ENDPOINTS

### 🔐 REGISTRO DE USUARIO

**Paso 1 - Registrar y recibir código por correo**
```
POST http://localhost:4000/api/register
Body (JSON):
{
  "name": "Juan",
  "lastName": "Pérez",
  "email": "juan@gmail.com",
  "password": "123456"
}
```

**Paso 2 - Verificar el código (llega al correo)**
```
POST http://localhost:4000/api/register/verify
Body (JSON):
{
  "verificationCode": "abc123"
}
```

---

### 🔑 INICIO DE SESION

```
POST http://localhost:4000/api/login
Body (JSON):
{
  "email": "juan@gmail.com",
  "password": "123456"
}
```
> ✅ Guarda automáticamente el token en una **cookie** llamada `authCookie`
> ⚠️ Si fallas 5 veces, la cuenta se bloquea por 5 minutos

---

### 🚪 CERRAR SESION

```
POST http://localhost:4000/api/logout
(No necesita body)
```

---

### 🔒 RECUPERACION DE CONTRASEÑA

**Paso 1 - Solicitar código**
```
POST http://localhost:4000/api/recovery
Body (JSON):
{
  "email": "juan@gmail.com"
}
```

**Paso 2 - Verificar código**
```
POST http://localhost:4000/api/recovery/verify
Body (JSON):
{
  "code": "abc123"
}
```

**Paso 3 - Cambiar contraseña**
```
POST http://localhost:4000/api/recovery/new-password
Body (JSON):
{
  "newPassword": "nuevaPass123",
  "confirmNewPassword": "nuevaPass123"
}
```

---

### 📦 CRUD DE PRODUCTOS (requiere login)

> ⚠️ Los endpoints marcados con 🔒 requieren estar logueado (cookie authCookie)

**Obtener todos los productos**
```
GET http://localhost:4000/api/products
```

**Obtener un producto por ID**
```
GET http://localhost:4000/api/products/:id
```

**Crear producto con imagen en Cloudinary** 🔒
```
POST http://localhost:4000/api/products
Body (form-data):
  name        = Pizza Pepperoni
  description = Deliciosa pizza
  price       = 15.99
  stock       = 50
  category    = pizzas
  image       = [seleccionar archivo de imagen]
```

**Actualizar producto (imagen opcional)** 🔒
```
PUT http://localhost:4000/api/products/:id
Body (form-data):
  name  = Nuevo nombre
  price = 18.99
  image = [archivo de imagen opcional]
```

**Eliminar producto** 🔒
```
DELETE http://localhost:4000/api/products/:id
```

**Productos con stock bajo (menos de 5)**
```
GET http://localhost:4000/api/products/low-stock
```

**Contar productos**
```
GET http://localhost:4000/api/products/count
```

**Buscar por rango de precio**
```
POST http://localhost:4000/api/products/price-range
Body (JSON):
{
  "min": 5,
  "max": 20
}
```

**Buscar por categoría**
```
GET http://localhost:4000/api/products/category/pizzas
```

---

### 🏷️ CRUD CON ARRAYS - TAGS DEL PRODUCTO 🔒

**Ver todos los tags**
```
GET http://localhost:4000/api/products/:id/tags
```

**Agregar un tag** 🔒
```
POST http://localhost:4000/api/products/:id/tags
Body (JSON):
{
  "tag": "vegana"
}
```

**Editar un tag** 🔒
```
PUT http://localhost:4000/api/products/:id/tags
Body (JSON):
{
  "oldTag": "vegana",
  "newTag": "vegetariana"
}
```

**Eliminar un tag** 🔒
```
DELETE http://localhost:4000/api/products/:id/tags
Body (JSON):
{
  "tag": "vegetariana"
}
```

---

### 👤 CRUD DE USUARIOS 🔒

**Obtener todos los usuarios**
```
GET http://localhost:4000/api/users
```

**Obtener usuario por ID**
```
GET http://localhost:4000/api/users/:id
```

**Actualizar usuario (con foto de perfil a Cloudinary)**
```
PUT http://localhost:4000/api/users/:id
Body (form-data):
  name         = Juan
  lastName     = González
  profileImage = [seleccionar imagen]
```

**Eliminar usuario**
```
DELETE http://localhost:4000/api/users/:id
```

---

### 🏠 CRUD CON ARRAYS - DIRECCIONES DEL USUARIO 🔒

**Ver direcciones**
```
GET http://localhost:4000/api/users/:id/addresses
```

**Agregar dirección**
```
POST http://localhost:4000/api/users/:id/addresses
Body (JSON):
{
  "street": "Calle Principal 123",
  "city": "San Salvador",
  "state": "San Salvador",
  "zipCode": "01001",
  "isDefault": true
}
```

**Editar una dirección específica**
```
PUT http://localhost:4000/api/users/:id/addresses/:addressId
Body (JSON):
{
  "street": "Nueva Calle 456",
  "city": "Santa Ana",
  "state": "Santa Ana",
  "zipCode": "02001",
  "isDefault": false
}
```

**Eliminar una dirección**
```
DELETE http://localhost:4000/api/users/:id/addresses/:addressId
```

---

## 🍪 Configurar Postman para las cookies

1. En Postman ve a **Settings** → **Cookies**
2. Asegúrate de que la opción **"Automatically follow redirects"** esté activada
3. Después de hacer login, Postman guardará automáticamente la cookie `authCookie`
4. Los endpoints protegidos la enviarán automáticamente

---

## 📁 Estructura del Proyecto

```
actividad-cloudinary/
├── src/
│   ├── controllers/
│   │   ├── registerController.js    → Registro con código por correo
│   │   ├── loginController.js       → Login con bloqueo de cuenta
│   │   ├── logoutController.js      → Cerrar sesión
│   │   ├── recoveryPasswordController.js → Recuperar contraseña
│   │   ├── productController.js     → CRUD productos + CRUD arrays (tags)
│   │   └── userController.js        → CRUD usuarios + CRUD arrays (addresses)
│   ├── models/
│   │   ├── user.js                  → Schema de usuarios con array de addresses
│   │   └── product.js               → Schema de productos con array de tags
│   ├── routes/
│   │   ├── register.js
│   │   ├── login.js
│   │   ├── logout.js
│   │   ├── recovery.js
│   │   ├── products.js
│   │   └── users.js
│   ├── middlewares/
│   │   └── authMiddleware.js        → Verificar token JWT de la cookie
│   └── utils/
│       ├── cloudinaryConfig.js      → Configuración de Cloudinary + Multer
│       ├── HTMLVerificationEmail.js → Template HTML del correo de verificación
│       └── HTMLRecoveryEmail.js     → Template HTML del correo de recuperación
├── app.js
├── index.js
├── database.js
├── config.js
├── .env                             ← PON TUS CREDENCIALES AQUI
└── package.json
```
