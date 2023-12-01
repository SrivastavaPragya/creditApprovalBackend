const mongoose=require("mongoose")

const CustomerSchema = new mongoose.Schema({
    first_name: String,
    last_name: String,
    age: Number,
    monthly_income: Number,
    phone_number: Number,
    approved_limit: Number
});



const LoanSchema = new mongoose.Schema({
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'customer', 
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    interestRate: {
        type: Number,
        required: true
    },
    tenure: {
        type: Number,
        required: true
    },
    monthlyInstallment: {
        type: Number,
        required: true
    },
    totalAmountPaid: {
        type: Number,
        default: 0
    }
  
});


// define mongoose model
const customer=mongoose.model('customer',CustomerSchema)
const Loan = mongoose.model('Loan', LoanSchema);




module.exports={
    customer,
    Loan
};