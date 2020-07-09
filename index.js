const express = require("express");
const mongoose = require("mongoose");
const cookieSession = require("cookie-session");
const passport = require("passport");
const bodyParser = require("body-parser");
const cors = require("cors");
const keys = require("./config/keys");
const fileUpload = require("express-fileupload")
const PUBLIC_DIR = "public";
const STATIC_DIR = "static";

// Models
require("./models/User");
require("./models/Jam");

mongoose.Promise = global.Promise;
const options = {
	 useNewUrlParser: true
 }
mongoose.connect(keys.mongoURI, options);

const app = express();
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(cors());
app.use(
	cookieSession({
		maxAge: 30 * 24 * 60 * 60 * 1000,
		keys: [keys.cookieKey]
	})
);
app.use(passport.initialize());
app.use(passport.session());

app.use(fileUpload());
app.use(express.static(STATIC_DIR));
app.use(express.static(PUBLIC_DIR));

require("./services/passport");
require("./routes/authRoutes")(app);
require("./routes/userRoutes")(app);


app.get("/", (req, res) => {
	let adminContent = `
    <div>
      You don't appear to be logged in.  You can log in by visiting
      <a href="/auth/google">the Authentication Route</a>. You could
      also look at details about yourself at <a href="/current_user">the Current User route</a>
    </div>
  `;
	if (req.user) {
		adminContent = `
      <div>
        You appear to be logged in, so you can visit <a href="/admins">the Admins route</a>
        or you can <a href="/logout">Logout</a>.
      </div>
    `;
	}
	res.send(`
    <div>
      <h4>Hi!  Welcome to the React SSR API</h4>
      <div>
        You can see <a href="/users">the Users route</a>
      </div>
      ${adminContent}
    </div>
  `);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT);
