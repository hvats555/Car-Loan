// function calculateEmi(loanAmount, interestRate, loanDuration){         
//     var interestPerYear = (loanAmount * interestRate)/100; 
//     var monthlyInterest = interestPerYear/12;
    
//     var monthlyPayment = monthlyInterest + (loanAmount/loanDuration);
//     // var totalInterestCost = monthlyInterest * loanDuration;
//     // var totalRepayment = monthlyPayment * loanDuration;
//     return Math.round(monthlyPayment); 
    
//     var calc = ((monInt + (monInt / (Math.pow((1 + monInt), months) -1))) * (amount - (totalDown || 0))).toFixed(2);
// }


function calculateEmi(loanAmount, interestRate, term, downPayment, tradeIn){
    let amount = parseInt(loanAmount);
    let intRate = parseInt(interestRate);
    let months = parseInt(term);
    let down = parseInt(downPayment);
    let trade = parseInt(tradeIn);

    let totalDown  = down + trade;
    let annInterest = intRate;
    let monInt = annInterest/ 1200;

    var calc = ((monInt + (monInt / (Math.pow((1 + monInt), months) -1))) * (amount - (totalDown || 0))).toFixed(2);

    return calc;
}

export default calculateEmi;
