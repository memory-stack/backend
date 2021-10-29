const mongoose = require('mongoose');
const userSchema = mongoose.Schema({
    name:{
        type: String,
        default: ""
    },
    password:{
        type: String,
        default: "",
        required: true
    },
    username:{
        type: String,
        default: "",
        required: true
    }, 
    about:{
        type: String,
        default: ""
    }, 
    thought:{
        type: Array,
        default: []
    },
    logs:{
        type: Array,
        default: []    
    },
    rank:{ 
        type: Number,
        default: 0
    },
    email:{
        type:String,
        default: "",
        required: true
    },
    isVerified:{
        type: Boolean,
        default: false,
    },
    unique:{
        type: String,
        default: "",
    }
});

module.exports = mongoose.model('User', userSchema);