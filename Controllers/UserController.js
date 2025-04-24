import express from "express"
import errorHandling from "../Middlewares/ErrorHandling.js"
import User from "../Modules/User.js"
import bcrypt from "bcryptjs"
const router = express.Router()

const adminUser = async () => {
    const [adminName, adminEmail, adminPassword, adminNumber] = ["Admin", "softseedssolution@gmail.com", "1234", "admin Number"]
    const checkAdmin = await User.findOne({ email: adminEmail })
    if (checkAdmin) return null;
    const hashAdminPassword = await bcrypt.hash(adminPassword, 10)
    await User.create({
        name: adminName,
        email: adminEmail,
        password: hashAdminPassword,
        number: adminNumber,
        role: "Admin"
    })
}

adminUser()

router.post("/addUser", errorHandling(async (req, res) => {
    const { name, email, password, confirmPassword, number, role } = req.body
    if (!name || !email || !password || !confirmPassword || !number || !role) return res.status(400).json({ message: "Fields with * are required" })

    const [checkEmail, checkNumber] = await Promise.all([
        User.findOne({ email }),
        User.findOne({ number })
    ])
    if (checkEmail) return res.status(400).json({ message: "Email already exists" })
    if (checkNumber) return res.status(400).json({ message: "Number already exists" })
    if (password !== confirmPassword) return res.status(400).json({ message: "Passwords don't match" })

    const hashedPassword = await bcrypt.hash(password, 10)
    const newUser = await User.create({ name, email, password: hashedPassword, number, role })
    res.json(newUser)
}))

router.post("/signIn", errorHandling(async (req, res) => {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: "Email and password are required" })
    const checkUser = await User.findOne({ email })
    if (!checkUser) return res.status(400).json({ message: "Email did not match" })

    const checkPassword = await bcrypt.compare(password, checkUser.password)
    if (!checkPassword) return res.status(400).json({ message: "Incorrect Password" })
    res.json(checkUser)
}))

router.get("/getUser", errorHandling(async (req, res) => {
    const allUsers = await User.find()
    res.json(allUsers)
}))

router.get("/getUserById/:id", errorHandling(async (req, res) => {
    const getUserById = await User.findById(req.params.id)
    if (!getUserById) return res.status(400).json({ message: "User not found" })
    res.json(getUserById)
}))

router.get("/titleUser/:title", errorHandling(async (req, res) => {
    const getUserByTitle = await User.findOne({ name: req.params.title })
    if (!getUserByTitle) return res.status(400).json({ message: "User not found" })
    res.json(getUserByTitle)
}))

router.delete("/delUser/:id", errorHandling(async (req, res) => {
    const delUserById = await User.findByIdAndDelete(req.params.id)
    if (!delUserById) return res.status(400).json({ message: "User not found" })
    res.json("User successfully deleted")
}))

router.get("/userCount", errorHandling(async (req, res) => {
    const userCount = await User.countDocuments()
    res.json(userCount)
}))

router.put("/updateUser/:id", errorHandling(async (req, res) => {
    const { name, email, password, number } = req.body
    const hashPassword = await bcrypt.hash(password, 10)
    const changeUser = {}
    if (name) changeUser.name = name
    if (email) changeUser.email = email
    if (password) changeUser.password = hashPassword
    if (number) changeUser.number = number

    const updatedUser = await User.findByIdAndUpdate(req.params.id, { $set: changeUser }, { new: true })
    if (!updatedUser) return res.status(400).json({ message: "User not found" })
    res.json(updatedUser)
}))

export default router;