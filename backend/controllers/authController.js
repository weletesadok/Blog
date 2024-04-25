const User = require('../models/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dpuotea85',
  api_key: '269375457246699',
  api_secret: 'X9pIatqQEemSd33QDw9h3Q3m47I',
  api_environment_variable: 'CLOUDINARY_URL=cloudinary://269375457246699:X9pIatqQEemSd33QDw9h3Q3m47I@dpuotea85'
});


const registerUser = async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, zipCode, username, password, roles } = req.body;

    
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    
    let avatarUrl;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path);
      avatarUrl = result.secure_url;
    }

    
    const newUser = new User({
      firstName,
      lastName,
      email,
      phoneNumber,
      zipCode,
      username,
      password,
      roles,
      avatar: avatarUrl 
    });

    
    await newUser.save();

    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const login = async (req, res) => {
    const { username, password } = req.body

    if (!username || !password) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    const foundUser = await User.findOne({ username }).exec()

    if (!foundUser || !foundUser.active) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })
    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "id": foundUser._id,
                "username": foundUser.username,
                "roles": foundUser.roles,
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        { "username": foundUser.username },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    
    res.cookie('jwt', refreshToken, {
        httpOnly: true, 
        secure: true, 
        sameSite: 'None', 
        maxAge: 7 * 24 * 60 * 60 * 1000 
    })

    
    res.json({ accessToken })
}




const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const foundUser = await User.findOne({ username: decoded.username }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "username": foundUser.username,
                        "roles": foundUser.roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        }
    )
}




const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) 
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout,
    registerUser
}
