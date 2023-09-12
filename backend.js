import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url'; // Importa la función fileURLToPath

import { initializeApp } from "firebase/app";
import { getFirestore, collection, setDoc, doc, getDocs, updateDoc, deleteDoc } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAPs1tBJ0Q6XdAC3G7U5x-h2qeVnnAd7-4",
  authDomain: "lista-de-deseos-de-compras.firebaseapp.com",
  projectId: "lista-de-deseos-de-compras",
  storageBucket: "lista-de-deseos-de-compras.appspot.com",
  messagingSenderId: "161724110379",
  appId: "1:161724110379:web:7d803237e2cc7103c5bc6e"
};

const app = express();

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore(firebaseApp);

// Middleware para manejar JSON
app.use(express.json());
const __dirname = path.dirname(fileURLToPath(import.meta.url)); // Obtiene el valor de __dirname
app.use(express.static(__dirname));

// Ruta para obtener todos los elementos
app.get('/api/items', async (req, res) => {
  const itemsRef = collection(db, 'Lista Compras');
  const snapshot = await getDocs(itemsRef);
  const items = [];
  snapshot.forEach(doc => {
    items.push({ id: doc.id, ...doc.data() });
  });
  res.json(items);
});

// Ruta para agregar un elemento
app.post('/api/items', async (req, res) => {
  const newItem = req.body;
  const itemDocRef = doc(collection(db, 'Lista Compras'));
  await setDoc(itemDocRef, newItem);
  res.json({ message: 'Item added successfully' });
});

// Ruta para actualizar un elemento
app.put('/api/items/:id', async (req, res) => {
  const itemId = req.params.id;
  const newData = req.body;
  const itemDocRef = doc(db, 'Lista Compras', itemId);
  await updateDoc(itemDocRef, newData);
  res.json({ message: 'Item updated successfully' });
});

// Ruta para eliminar un elemento
app.delete('/api/items/:id', async (req, res) => {
  const itemId = req.params.id;
  const itemDocRef = doc(db, 'Lista Compras', itemId);
  await deleteDoc(itemDocRef);
  res.json({ message: 'Item deleted successfully' });
});
// Rutas para servir las páginas HTML
const publicPath = path.join(process.cwd());

app.get('/', (req, res) => {
  res.sendFile(path.join(publicPath, 'index.html'));
});

app.get('/anadir', (req, res) => {
  res.sendFile(path.join(publicPath, 'anadir.html'));
});

app.get('/consultar', (req, res) => {
  res.sendFile(path.join(publicPath, 'consultar.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});