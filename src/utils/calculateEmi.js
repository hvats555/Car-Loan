function calculateEmi(loanAmount, interestRate, loanDuration){         
    var interestPerYear = (loanAmount * interestRate)/100; 
    var monthlyInterest = interestPerYear/12;
    
    var monthlyPayment = monthlyInterest + (loanAmount/loanDuration);
    // var totalInterestCost = monthlyInterest * loanDuration;
    // var totalRepayment = monthlyPayment * loanDuration;
    return Math.round(monthlyPayment);  
}

export default calculateEmi;