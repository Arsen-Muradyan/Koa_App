const Koa = require("koa");
const KoaRouter = require("koa-router");
const render = require("koa-ejs");
const bodyParser = require("koa-bodyparser");
const path = require("path");
const mongoose = require("mongoose");
const config = require("config");
const databaseUrl = config.get("mongo_url");
const Thing = require("./models/thing");

let app = new Koa();
let router = new KoaRouter();

// Connect Db
mongoose
  .connect(databaseUrl, {
    useNewUrlParser: true,
    useFindAndModify: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Databsae Connected");
  })
  .catch((err) => {
    if (err) throw err;
  });


app.context.name = "Arsen";
render(app, {
  viewExt: "html",
  root: path.join(__dirname, "views"),
  layout: "layout",
  debug: false,
  cache: false,
});
app.use(bodyParser());
router.get("", index);
router.get("/add", showAdd);
router.post("/add", add);
router.get('/delete/:id', deleteThing)
async function index(ctx) {
  const things = await Thing.find({})
  await ctx.render("index", {
    things: things,
  });
}
async function showAdd(ctx) {
  await ctx.render("add");
}
async function add(ctx) {
  const body = ctx.request.body;
  let thing = new Thing();
  thing.title = body.thing;
  await thing.save();
  ctx.redirect("/");
}
async function deleteThing(ctx) {
  await Thing.findByIdAndDelete(ctx.params.id);
  ctx.redirect("/");
}
router.get("/test", (ctx) => (ctx.body = `Hello ${ctx.name}`));

app.use(router.routes()).use(router.allowedMethods());

app.listen(3000, () => console.log("Server Started..."));
