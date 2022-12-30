import mongoose from 'mongoose';

const tradeSchema = new mongoose.Schema(
    {
        user_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        company_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: true
        },
        amount: Number,
        shares: Number,
        date: Date,
        note: String
    },
    {
        toJSON: {
            transform: function (doc, ret) {
                ret.id = ret._id;
                ret.company = ret.company_id;
                delete ret._id;
                delete ret.company_id;
                delete ret.user_id;
                delete ret.__v;
            }
        }
    }
);

// Before saving a trade document, convert the id string into an ObjectId
tradeSchema.pre('save', function (next) {
    const userID = mongoose.Types.ObjectId(this.user_id);
    const companyID = mongoose.Types.ObjectId(this.company_id);

    this.user_id = userID;
    this.company_id = companyID;

    next();
});

const Trade = mongoose.model('Trade', tradeSchema);

export default Trade;