const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;
const User = require("../models/User");

const auth= {

signup: async (req, res) => {
    const { username, password } = req.body;
  
    try {
      // Check if the username already exists
      const existingUser = await User.findOne({ username });
  
      if (existingUser) {
        return res.status(400).json({ error: "Username already exists" });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const newUser = new User({ username, password: hashedPassword });
      await newUser.save();
  
      res.status(201).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error in signup:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },

login: async (req, res) => {
    const { username, password } = req.body;
  
    const user = await User.findOne({ username });      //finding user
  
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
  
   
    const isPasswordValid = await bcrypt.compare(password, user.password);  //pwd check

    if (!isPasswordValid) {
      return res.status(401).json({ error: "Invalid password" });
    }
  
    // Generate JWT token
    const token = jwt.sign({ user: user.username }, secretKey, { expiresIn: "10d" });
  
    res.json({ token })
},
};

module.exports = auth;