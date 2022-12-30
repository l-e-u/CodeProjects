import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            trim: true,
            required: true
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        toJSON: {
            transform: function (doc, ret) {
                ret.id = ret._id;
                delete ret.password;
                delete ret.__v;
            }
        }
    }
);

// Hash the password before saving the user document
userSchema.pre('save', function (next) {
    bcrypt.hash(this.password, 10)
        .then(hash => {
            this.password = hash;
            next();
        });
});

// When a user is deleted, so will all its trade documents
userSchema.pre('remove', function (next) {
    this.model('Trade').deleteMany({ user: this._id }, next);
});

const User = mongoose.model('User', userSchema);

export default User;