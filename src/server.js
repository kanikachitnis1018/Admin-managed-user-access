const express = require("express");
const app = express();
const path = require("path");
const multer = require("multer");
const { connectDB, User } = require("./config");
const flash = require("express-flash-message");
const { compare } = require("bcrypt");

app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const storage = multer.memoryStorage(); 
const upload = multer({ storage });

connectDB();

const adminCredentials = {
  users: {
    admin: 'password123' 
  },
  challenge: true, 
  unauthorizedResponse: 'Unauthorized'
};

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
      return next();
    }
    res.redirect("/login"); 
};

app.get('/', (req, res) => {
    res.render("admin-login.ejs");
});

app.post('/', (req, res) => {
    const userId = req.body['user-id-admin'];
    const password = req.body['password-admin'];
    if (userId === 'admin' && password === adminCredentials.users.admin) {
        res.redirect('/create-view-user')
    }
    else {
        res.flash("Incorrect credentials for Admin, try again");
    }
});

app.get('/create-view-user', async (req, res) => {
    if (req.auth.user !== 'admin') {
        return res.status(403).send('Only admin can access this view.');
    }

    const user = new User({
        name: req.body.user_id,
        password: req.body.password2
    });

    const existingUser = await connectDB.findOne({name: user.name})
    if(existingUser){
        res.flash("User already exists, please try wiht another user id");
    } else {
        await connectDB.insertMany(data);
    }

    try {
        const users = await connectDB.find({}, 'name').limit(2).lean();
        const [user1, user2] = users;

        res.render("create-view-user.ejs", {
            user1,
            user2,
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).send("Internal Server Error");
    }

    res.render("create-view-user.ejs");
});

app.get('/user-input', (req, res) => {
    res.render("user-input.ejs");
});

app.post('/user-input', async (req, res) => {
    try {
        const check = await connectDB.findOne({name: req.body.user-id});
        if(!check) {
            res.flash("Username not found");
        }

        const isPasswordMatch = await compare(req.body.password2, check.password2);
        if(isPasswordMatch) { 
            res.flash("Password Incorrect");
        }
    } catch{
        res.flash("Wrong Details");
    }
});

app.get('/upload-image', (req, res) => {
    res.render("upload-image.ejs")
})

app.post('/upload-image', upload.single('image'), async (req, res) => {
    try {
      const user = req.user;
      const { file } = req;
  
      if (!file) {
        return res.status(400).send('No file uploaded.');
      }
  
      user.croppedImage = file.buffer;
  
      await user.save();
  
      res.status(200).send('Image uploaded and cropped successfully.');
    } catch (error) {
      console.error('Error uploading and cropping image:', error);
      res.status(500).send('Internal Server Error');
    }
  });
app.listen(3000, () => {
    console.log('Server is running on port 3000');
})