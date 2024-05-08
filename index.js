const express = require("express");
const { connectToMongoDB } = require("./connect");
const urlRoute = require("./routes/url");
const URL = require("./models/url");

const app = express();
const PORT = 8001 ;

connectToMongoDB("mongodb+srv://awanishmishra:urlshortner@urlshortner.et2lxbh.mongodb.net/urlshortner").then(() =>
  console.log("Mongodb connected")
);

app.use(express.json());

app.get("/",(req,res)=>{
  res.status(200).send("This is URL Shortner for Avasant");
});


app.use("/url", urlRoute);


app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
          timestamp: Date.now(),
        },
      },
    }
  );
  if (!res){
    res.redirect(entry.redirectURL);
  }

});

app.listen(PORT||process.env.PORT, () => console.log(`Server Started at PORT:${PORT}`));
