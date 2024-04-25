const mongoose = require('mongoose')
const connectDB = async (dbUri) => {
    try {
        await mongoose.connect(dbUri)
    } catch (err) {
        console.log(err)
    }
}

module.exports = connectDB