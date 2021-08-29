const mongoose = require("mongoose");

let blogSchema = new mongoose.Schema({
   name: {
      type: "string",
      required: true,
   },
   image: {
      type: "string",
      required: true,
   },
   price: {
      type: "Number",
      required: true,
   },
   content: {
      type: "String",
      required: true,
   },
   info: {
      type: "string",
      required: true,
   },
   created: {
      type: "Date",
      default: Date.now,
   },
});

let blog = mongoose.model("blog", blogSchema);

module.exports = blog;
