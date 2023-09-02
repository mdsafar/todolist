import express from "express";
import bodyparser from "body-parser";
import Mongoose, { Schema } from "mongoose";
import alert from "alert";
const app = express();
const port = 3000;
app.use(express.static("public"))
app.use(bodyparser.urlencoded({ extended: true }))

Mongoose.connect("mongodb+srv://safar:Test123@cluster0.oypa87p.mongodb.net/todoDb")

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const day = days[new Date().getDay()]
const month = monthNames[new Date().getMonth()]
const date = new Date().getDate()
const year = new Date().getFullYear()

const todaySchema = new Mongoose.Schema({
  name: String,
  date : Schema.Types.Mixed
})

const Today = Mongoose.model("today", todaySchema)

const workSchema = new Mongoose.Schema({
  name: String,
  dates : Schema.Types.Mixed
})
const Work = Mongoose.model("work", workSchema)

app.get("/", (req, res) => {
  
  Today.find({}).then((founditem) => {
    res.render('index.ejs', { items: founditem , d : day, m : month, t : date})
  })
  
})

app.post("/", (req, res) => {
  let newitems = req.body.newItem;
  if (newitems) {
    const today = new Today({
      name: newitems,
      date :{
         day : date,
         month : month,
         year : year
      }
    })
    today.save()
    res.redirect("/")
  } else {
    alert("Please type Something")
    res.redirect('/')
  }
})
app.post("/delete", (req, res) => {
  const checkedListid = req.body.checked;
  Today.deleteOne({ _id: checkedListid }).then(() => {
    setTimeout(() => {
      res.redirect('/')
    }, 1000);
  })
})


app.get("/work", (req, res) => {
  Work.find({}).then((founditem) => {
    res.render('work.ejs', { workItems: founditem, d : day, m : month, t : date})
    console.log(founditem.dates)
  })
})

app.post("/work", (req, res) => {
  let workitems = req.body.newItem;
  if (workitems) {
    const work = new Work({
      name: workitems,
      dates : {
        day : date,
        month : month,
        year : year
      }
    })
    work.save()
    res.redirect('/work')
  } else {
    alert("Please type Something")
    res.redirect('/work')
  }
})

app.post("/deletework", (req, res) => {
  const checkedListid = req.body.checked;
  Work.deleteOne({ _id: checkedListid }).then(() => {
    setTimeout(() => {
      res.redirect('/work')
    }, 1000);
  })
})


app.listen(port, () => {

})