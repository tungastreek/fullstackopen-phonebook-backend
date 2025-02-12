const mongoose = require("mongoose");

const mongoDbUri = process.env.MONGODB_URI;
mongoose.set("strictQuery", false);
mongoose
  .connect(mongoDbUri)
  .then(() => {
    console.log("Connected to MongoDB")
  })
  .catch(err => {
    console.log("Error connecting to MongoDB:", err.message);
  });

const personSchema = mongoose.Schema({
  name: String,
  number: String,
});

personSchema.set("toJSON", {
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
  }
});

const PersonModel = mongoose.model("Person", personSchema);

module.exports = PersonModel;
