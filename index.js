const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const PersonModel = require("./src/models/person");
const {request} = require("express");

const app = express();
app.use(express.json());
app.use(express.static("dist"));
app.use(cors())
app.use(
  morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"), "-",
      tokens["response-time"](req, res), "ms",
      JSON.stringify(req.body),
    ].join(' ');
  })
);

app.get("/info", (req, res) => {
  PersonModel.find().then((people) => {
    let message = `<p>Phonebook has info for ${people.length} people</p>`;
    message += `<p>${new Date()}</p>`;
    res.send(message);
  });
});

app.get("/api/persons", (req, res) => {
  PersonModel.find().then((people) => {
    res.json(people);
  });
});

app.post("/api/persons", (req, res) => {
  const body = req.body;
  if (!body.name) {
    return res.status(400).json({error: "Name is required"});
  }
  if (!body.number) {
    return res.status(400).json({error: "Number is required"});
  }

  PersonModel.find().then((people) => {
    if (people.map(p => p.name).includes(body.name)) {
      return res.status(400).json({error: "Name must be unique"});
    }
    const newPerson = new PersonModel({
      name: body.name,
      number: body.number,
    });
    newPerson.save().then((savedPerson) => {
      res.json(savedPerson);
    });
  });
});

app.get("/api/persons/:id", (req, res, next) => {
  PersonModel
    .findById(req.params.id)
    .then((person) => {
      if (!person) {
        return res.status(404).json({error: "Not Found"});
      }
      return res.json(person);
    })
    .catch((err) => {
      next(err);
    })
});

app.put("/api/persons/:id", (req, res, next) => {
  PersonModel
    .findById(req.params.id)
    .then((person) => {
      if (!person) {
        return res.status(404).json({error: "Not Found"});
      }
      const body = req.body;
      if (!body.name) {
        return res.status(400).json({error: "Name is required"});
      }
      if (!body.number) {
        return res.status(400).json({error: "Number is required"});
      }
      person.name = body.name;
      person.number = body.number;
      person.save().then((savedPerson) => {
        res.json(savedPerson);
      });
    })
    .catch((err) => {
      next(err);
    })
})

app.delete("/api/persons/:id", (req, res, next) => {
  PersonModel.findByIdAndDelete(req.params.id)
    .then(() => {
      res.status(204).end();
    })
    .catch((err) => {
      next(err);
    })
});

const errorHandler = (err, req, res, next) => {
  console.error(err);

  if (err.name === "CastError") {
    return res.status(400).json({error: "Malformed id"});
  }

  next(err);
}

app.use(errorHandler)

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
