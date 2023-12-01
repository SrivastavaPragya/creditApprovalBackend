const express = require('express');
const router = express.Router();
const { customer, Loan } = require("../db/models/Schema");

router.post('/register', async (req, res) => {
    const { first_name, last_name, age, monthly_income, phone_number } = req.body;
    const approved_limit = Math.round((36 * monthly_income) / 100000) * 100000; 

    try {
        const user = await customer.findOne({ first_name, last_name });
        if (user) {
            res.status(409).json({ message: "customer already exists" });
        } else {
            const newUser = new customer({
                first_name,
                last_name,
                age,
                monthly_income,
                phone_number,
                approved_limit
            });
            await newUser.save();
            res.status(200).json({ message: "customer created successfully", customer: newUser });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
});

router.post("/create-loan", async (req, res) => {
    const { customer_id, loan_amount, interest_rate, tenure } = req.body;

    try {
        const user = await customer.findById(customer_id);
        if (!user) {
            return res.status(404).json({ message: 'Customer not found' });
        } else {
            const monthly_installment = calculateMonthlyInstallment(loan_amount, interest_rate, tenure);
            const newLoan = new Loan({
                customer: customer_id,
                amount: loan_amount,
                interestRate: interest_rate,
                tenure,
                monthlyInstallment: monthly_installment
            });
            await newLoan.save();
            res.json({
                loan_id: newLoan._id,
                customer_id,
                loan_approved: true,
                message: "Loan created successfully",
                monthly_installment
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
});

function calculateMonthlyInstallment(amount, interestRate, tenure) {
    const monthlyInterestRate = interestRate / 12 / 100;
    return (amount * monthlyInterestRate) / (1 - Math.pow(1 + monthlyInterestRate, -tenure));
}

router.get('/view-loan/:loan_id', async (req, res) => {
    const loan_id = req.params.loan_id;

    try {
        const loan = await Loan.findById(loan_id).populate('customer');
        if (!loan) {
            return res.status(404).json({ message: 'Loan not found' });
        }
        const customerDetails = {
            id: loan.customer._id,
            first_name: loan.customer.first_name,
            last_name: loan.customer.last_name,
            phone_number: loan.customer.phone_number,
            age: loan.customer.age
        };
        res.json({
            loan_id: loan._id,
            customer: customerDetails,
            loan_amount: loan.amount,
            interest_rate: loan.interestRate,
            monthly_installment: loan.monthlyInstallment,
            tenure: loan.tenure
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get('/view-statement/:customer_id/:loan_id', async (req, res) => {
    const { customer_id, loan_id } = req.params;

    try {
        const loan = await Loan.findById(loan_id);
        if (!loan || loan.customer.toString() !== customer_id) {
            return res.status(404).json({ message: 'Loan or customer not found' });
        }
        res.json({
            customer_id: customer_id,
            loan_id: loan_id,
            principal: loan.amount,
            interest_rate: loan.interestRate,
            Amount_paid: loan.totalAmountPaid,
            monthly_installment: loan.monthlyInstallment
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;



// {
//     "customer_id":"6565fe3862f1fa09ee29c77b",
//     "loan_amount":5000,
//     "interest_rate":5,
//     "tenure":5
                
//     }



// {
//     "first_name":"anamika",
//     "last_name":"srivastava",
//     "age":45,
//     "monthly_income":40000,
//     "phone_number":837483538
// }