import bcrypt from 'bcrypt'
import UserSchema from '../modals/UserSchema.js';
import jwt from "jsonwebtoken"
export async function register(req, res) {
  const { fullName: { firstName, lastName }, email, password } = req.body;
  const userexist = await UserSchema.findOne({ email });
  if (userexist) {
    return res.status(400).json({ message: "user alreay exist" })
  }
  const user = await UserSchema.create({
    fullName: { firstName, lastName },
    email,
    password: await bcrypt.hash(password, 10)
  })

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

  res.cookie("token", token)

  res.status(201).json({
    message: "user created successfully",
    user
  })

}

export async function login(req, res) {
  const { email, password } = req.body;
  const user = await UserSchema.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "user not found" })
  }

  const isValidPassword = bcrypt.compare(password, user.password)

  if (!isValidPassword) return res.status(400).json({ msg: "Please enter a correct password" })
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

  res.cookie("token", token)

  res.status(201).json({
    message: "logged in successfully",
    user
  })

}