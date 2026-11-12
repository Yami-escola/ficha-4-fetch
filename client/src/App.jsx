import { useEffect, useState } from "react";
import Card from "./Card.jsx";

function App() {
  const [filter, setFilter] = useState("Todas");
  const [search, setSearch] = useState("");
  const [randomCard, setRandomCard] = useState(null);
  const [sorted, setSorted] = useState(false);
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Estados do formulário
  const [name, setName] = useState("");
  const [type, setType] = useState("Criatura");
  const [attack, setAttack] = useState("");

  useEffect(() => {
    fetch("http://localhost:3000/api/cartas")
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => setCards(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    if (!name.trim()) return;

    const cardData = {
      name: name.trim(),
      type,
      attack: Number(attack) || 0,
    };

    // Tarefa 3: Enviar para o servidor
    fetch("http://localhost:3000/api/cartas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(cardData),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((newCardFromServer) => {
        // A carta que entra na lista é a que o servidor devolveu
        setCards([...cards, newCardFromServer]);
        
        // Limpar o form
        setName("");
        setType("Criatura");
        setAttack("");
      })
      .catch((err) => {
        console.error("Erro no POST:", err);
        // Na tarefa 5 vamos mostrar isto na página bonito, por agora fica um alerta
        alert("Erro ao enviar a carta: " + err.message); 
      });
  }

  let visible = cards
    .filter((card) => filter === "Todas" || card.type === filter)
    .filter((card) => card.name.toLowerCase().includes(search.toLowerCase()));

  if (sorted) {
    visible = [...visible].sort((a, b) => b.attack - a.attack);
  }

  function pickRandom() {
    setRandomCard(cards[Math.floor(Math.random() * cards.length)]);
  }

  if (loading) return <p>A carregar…</p>;
  if (error) return <p>Erro: {error}</p>;

  return (
    <main>
      <h1>A minha coleção</h1>

      <p>
        Tenho {cards.length} cartas · a mostrar {visible.length}
      </p>

      <h2>Nova carta</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nome da carta"
        />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="Criatura">Criatura</option>
          <option value="Feitiço">Feitiço</option>
        </select>
        <input
          type="number"
          value={attack}
          onChange={(e) => setAttack(e.target.value)}
          placeholder="Ataque"
        />
        <button type="submit">Adicionar carta</button>
      </form>

      <div>
        <button onClick={() => setFilter("Todas")}>Todas</button>
        <button onClick={() => setFilter("Criatura")}>Só criaturas</button>
        <button onClick={() => setFilter("Feitiço")}>Só feitiços</button>
        <button onClick={() => setSorted(!sorted)}>
          {sorted ? "Ordem original" : "Ordenar por ataque"}
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Procurar pelo nome…"
      />

      {visible.length === 0 ? (
        <p>Nenhuma carta corresponde.</p>
      ) : (
        <ul>
          {visible.map((card) => (
            <Card key={card.name} {...card} />
          ))}
        </ul>
      )}

      <h2>Carta à sorte</h2>
      <button onClick={pickRandom}>Escolher outra</button>
      {randomCard && (
        <p>
          <b>{randomCard.name}</b> — {randomCard.type} · ataque {randomCard.attack} ·
          defesa {randomCard.defense}
        </p>
      )}
    </main>
  );
}

export default App;