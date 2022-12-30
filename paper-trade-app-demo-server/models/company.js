import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
        },
        ticker: {
            type: String,
            trim: true,
            required: true,
            uppercase: true,
            unique: true
        }
    },
    {
        toJSON: {
            transform: function (doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.__v;
            }
        }
    }
);

const Company = mongoose.model('Company', companySchema);

export default Company;