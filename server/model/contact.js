const mongoose = require('mongoose');


const contactSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    submittedAt: { type: Date, default: Date.now },
    },
    { collection: 'contacts'}


);


module.exports = mongoose.model('Contact' , contactSchema);
