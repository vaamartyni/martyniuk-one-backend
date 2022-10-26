import express from 'express';
import mongoose from "mongoose";
import { registerValidation } from "./validation/auth.js";
import checkAuth from "./utils/checkAuth.js";
import * as UserController from "./controllers/UserController.js";
import * as PostController from "./controllers/PostController.js";
import multer from 'multer';
import cors from 'cors';

mongoose.connect(
    'mongodb+srv://martyniukvaa:tAYGUFhmfEFem3eu@cluster0.fnzmk7g.mongodb.net/mern-app-v1?retryWrites=true&w=majority'
)
    .then(() => console.log('Mongo Database connected'))
    .catch((err)=>console.log('Mongo Database has an error while connecting', err))

const app = express();
app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

//MULTER
const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads');
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage });

//UPLOAD API
app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.send({
        url: `/uploads/${req.file.originalname}`,
        message: "success"
    });
})

//AUTH API
app.get('/', (req,res) => {
    res.send('Hello user');
});
app.get('/auth/me',checkAuth, UserController.getMe);
app.post('/auth/login', UserController.login);
app.post('/auth/register', registerValidation, UserController.register);

//POST API
app.get('/posts', PostController.getAll);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.patch('/posts/:id' ,checkAuth, PostController.update);

//TAGS API
app.get('/tags', PostController.getTags);

app.listen(4444, (err) => {
    if (err) {
        return console.log(err);
    }
    console.log('Express server started');
});