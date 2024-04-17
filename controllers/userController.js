const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");
const Prof = require("../models/profModel");

module.exports.usersignUp = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    console.log(name, email, phone, password);
    // Check If The Input Fields are Valid
    if (!name || !email || !phone || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in all your details appropriately!" });
    }

    // Check If User Exists In The Database
    const existingEmail = await User.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    // Hash The User's Password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save The User To The Database
    const newUser = new User({
      name,
      email,
      phone,

      password: hashedPassword,
    });

    await newUser.save();
    return res
      .status(201)
      .json({ message: "User Created Successfully", newUser });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Error creating user" });
  }
};

module.exports.profsignUp = async (req, res) => {
  try {
    const {
      title,
      name,
      profession,
      specialty,
      address,
      email,
      phone,
      password,
    } = req.body;
    console.log(req.body);
    // Check If The Input Fields are Valid
    if (
      !title ||
      !profession ||
      !specialty ||
      !address ||
      !name ||
      !email ||
      !phone ||
      !password
    ) {
      return res
        .status(400)
        .json({ message: "Please fill in all your details appropriately!" });
    }

    // Check If User Exists In The Database
    const existingEmail = await Prof.findOne({ email });

    if (existingEmail) {
      return res.status(400).json({ message: "User Already Exists" });
    }

    // Hash The User's Password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Save The User To The Database
    const newProf = new Prof({
      name,
      email,
      phone,
      profession,
      specialty,
      title,
      address,
      password: hashedPassword,
    });

    await newProf.save().then((data) => {
      return res
        .status(201)
        .json({ message: "User Created Successfully", newProf });
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error creating user" });
  }
};
module.exports.profsignIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check If The Input Fields are Valid
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in your login details appropriately" });
    }

    const user = await Prof.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid name or password" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid name or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.SECRET_KEY || "1234!@#%<{*&)",
      { expiresIn: "600h" }
    );

    console.log(user, token);
    return res
      .status(200)
      .json({ message: "Login Successful", data: user, token });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Error during login" });
  }
};

module.exports.usersignIn = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);

    // Check If The Input Fields are Valid
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please fill in your login details appropriately" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Invalid name or password" });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid name or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { userId: user._id, name: user.name },
      process.env.SECRET_KEY || "1234!@#%<{*&)",
      { expiresIn: "600h" }
    );

    console.log(user, token);
    return res
      .status(200)
      .json({ message: "Login Successful", data: user, token });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Error during login" });
  }
};

module.exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ id }, { password: 0 }); // Exclude the password field from the response

    return res.status(200).json({ users });
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Error fetching users" });
  }
};

module.exports.getProf = async (req, res) => {
  try {
    const { id } = req.body;
    // Retrieve all users from the database

    console.log(id);
    const users = await Prof.find({ profession: id }, { password: 0 }).then(
      (data) => {
        return res.status(200).json(data);
      }
    ); // Exclude the password field from the response
  } catch (error) {
    console.log(error.message);
    return res.status(500).json({ message: "Error fetching users" });
  }
};

module.exports.verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const decoded = await jwt.verify(
      token,
      process.env.SECRET_KEY || "1234!@#%<{*&)"
    );
    if (!decoded) {
      throw new Error();
    }
    req.user = decoded;

    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error Validating Token" });
  }
};
