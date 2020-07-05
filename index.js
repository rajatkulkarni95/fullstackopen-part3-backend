const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");

app.use(express.json());
app.use(morgan("combined"));
app.use(cors());

let persons = [
  {
    name: "Ada Lovelace",
    number: "39-44-5323523",
    id: 2,
  },
  {
    name: "Dan Abramov",
    number: "12-43-234345",
    id: 3,
  },
  {
    name: "Rajat Kulkarni",
    number: "12-43-123412",
    id: 4,
  },
  {
    name: "Manish K",
    number: "11-43-347232",
    id: 5,
  },
  {
    name: "Meghana Kulkarni",
    number: "146-43-123532",
    id: 6,
  },
];

app.get("/", (req, res) => {
  res.send("<h1>Request at /api/persons</h1>");
});

app.get("/info", (req, res) => {
  res.send(
    `<p>Phonebook has info for ${persons.length} people.</p><p>Date here</p>`
  );
});

app.get("/api/persons", (req, res) => {
  res.json(persons);
});

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;

  const person = persons.find((person) => person.id == id);
  person ? res.json(person) : res.status(404).end();
});

const generateId = () => {
  const maxID = persons.length > 0 ? Math.max(...persons.map((p) => p.id)) : 0;

  return maxID + 1;
};

app.post("/api/persons", (req, res) => {
  const body = req.body;

  if (!body.name || !body.number) {
    return res.status(400).json({
      error: "Content missing",
    });
  }

  persons.find((person) => person.name == body.name)
    ? res.status(500).json({ error: "Name already exists" })
    : null;

  const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
  };

  morgan(function (tokens, req, res) {
    return [
      tokens.status(req, res),
      tokens.res(req, res, "content-length"),
      "-",
      tokens["response-time"](req, res),
      "ms",
    ].join(" ");
  });

  persons = persons.concat(person);

  res.json(person);
});

app.delete("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  console.log(id);
  persons = persons.filter((person) => person.id !== id);

  res.status(204).end();
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
