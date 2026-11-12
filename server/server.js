const express = require("express");
const cors = require("cors");
const fs = require("fs"); // <-- Importar o módulo File System

const app = express();
const PORT = 3000;

// ---- middlewares ----
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// ---- Ler o ficheiro ao arrancar ----
const caminhoFicheiro = "./cartas.json";
let cards = [];

try {
  const dados = fs.readFileSync(caminhoFicheiro, "utf-8");
  cards = JSON.parse(dados); // Converte o texto em array de objetos
} catch (err) {
  console.error("Erro ao ler o ficheiro cartas.json:", err.message);
  // Se o ficheiro não existir, começa com um array vazio para não crashar
}

function page(title, body) {
  return `<!DOCTYPE html>
<html lang="pt">
  <head>
    <meta charset="utf-8">
    <title>${title}</title>
  </head>
  <body>
    <nav>
      <a href="/">Início</a> ·
      <a href="/cartas">Cartas</a> ·
      <a href="/sobre">Sobre</a> ·
      <a href="/agora">Agora</a>
    </nav>
    <h1>${title}</h1>
    ${body}
  </body>
</html>`;
}

// ---- API ----
app.get("/api/cartas", (req, res) => {
  res.json(cards);
});

app.post("/api/cartas", (req, res) => {
  const { name, type, attack, defense } = req.body;

  const card = {
    name,
    type,
    attack: Number(attack) || 0,
    defense: Number(defense) || 0,
  };

  cards.push(card);

  // ---- Gravar no ficheiro a cada POST ----
  try {
    // O 'null, 2' serve para formatar o JSON com indentação bonita no ficheiro
    fs.writeFileSync(caminhoFicheiro, JSON.stringify(cards, null, 2));
  } catch (err) {
    console.error("Erro ao gravar o ficheiro cartas.json:", err.message);
  }

  res.status(201).json(card); // devolve a carta criada
});

// ---- páginas HTML ----
app.get("/", (req, res) => {
  res.send(page(
    "A minha coleção",
    `<p>Neste momento tenho <b>${cards.length}</b> cartas na coleção.</p>`
  ));
});

app.get("/sobre", (req, res) => {
  res.send(page(
    "Sobre",
    `<p>Feito por <b>&lt;Yami Araújo&gt;</b>, turma &lt;TGPSI24U&gt;.</p>`
  ));
});

app.get("/cartas", (req, res) => {
  const items = cards
    .map((card) => `<li><b>${card.name}</b> — ${card.type}, ataque ${card.attack}</li>`)
    .join("");

  res.send(page("Cartas", `<ul>${items}</ul>`));
});

app.get("/cartas/aleatoria", (req, res) => {
  const card = cards[Math.floor(Math.random() * cards.length)];

  res.send(page(
    "Carta à sorte",
    `<h2>${card.name}</h2>
     <p>${card.type} · ataque ${card.attack} · defesa ${card.defense}</p>`
  ));
});

app.get("/agora", (req, res) => {
  const now = new Date().toLocaleString("pt-PT", {
    dateStyle: "long",
    timeStyle: "medium",
  });

  res.send(page("Agora", `<p>Este pedido foi respondido às <b>${now}</b>.</p>`));
});

// ---- 404 (por último) ----
app.use((req, res) => {
  res.status(404).send(page(
    "404 — não encontrado",
    `<p>Não existe nada em <code>${req.url}</code>.</p>
     <p><a href="/">Voltar ao início</a></p>`
  ));
});

app.listen(PORT, () => {
  console.log(`Server a correr em http://localhost:${PORT}`);
});