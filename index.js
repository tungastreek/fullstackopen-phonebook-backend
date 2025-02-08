const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();
app.use(cors())
app.use(express.json());
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'), '-',
      tokens['response-time'](req, res), 'ms',
      JSON.stringify(req.body),
    ].join(' ')
  })
);

let people = [
  {
    "id": "1",
    "name": "Arto Hellas",
    "number": "040-123456"
  },
  {
    "id": "2",
    "name": "Ada Lovelace",
    "number": "39-44-5323523"
  },
  {
    "id": "3",
    "name": "Dan Abramov",
    "number": "12-43-234345"
  },
  {
    "id": "4",
    "name": "Mary Poppendieck",
    "number": "39-23-6423122"
  }
];

app.get("/info", (req, res) => {
  let message = `<p>Phonebook has info for ${people.length} people</p>`;
  message += `<p>${new Date()}</p>`;
  res.send(message);
})

app.get("/api/persons", (req, res) => {
  res.json(people);
})

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name) {
    return res.status(400).json({error: "Name is required"});
  }
  if (!body.number) {
    return res.status(400).json({error: "Number is required"});
  }
  if (people.map(p => p.name).includes(body.name)) {
    return res.status(400).json({error: "Name must be unique"});
  }

  const newPerson = {
    id: String(Math.round(Math.random() * 5000)),
    name: body.name,
    number: body.number,
  }
  people = people.concat(newPerson);
  res.json(newPerson);
})

app.get("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = people.find((person) => person.id === id);
  if (!person) {
    return res.status(404).end();
  }
  res.json(person);
})

app.delete("/api/persons/:id", (req, res) => {
  const id = req.params.id;
  const person = people.find((person) => person.id === id);
  people = people.filter(person => person.id !== id);
  res.status(204).end();
})

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
});
