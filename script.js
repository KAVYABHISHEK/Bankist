'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Ross Geller',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Chandler Bing',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Joey Tribiyani',
  movements: [200, -200, 340, -300, -20, 50, 400, -460, 5000],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Patrik Batemen',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


//Display movements
const displayMovements = function(movements,sort = false) {
    containerMovements.innerHTML = ''; 

    const movs = sort ? movements.slice().sort((a, b)=> a - b) : movements;

    movs.forEach(function(mov,i){
      const type = mov > 0 ? 'deposit':'withdrawal';
         
        const html = `  
         <div class="movements__row">
        <div class="movements__type movements__type--${type}">${i+1} ${type}</div>
        <div class="movements__value">${mov}</div>
      </div>`; 
     
      containerMovements.insertAdjacentHTML('afterbegin',html);
     });
};

//Display Balance
const calcDisplayBalance = function(acc){
    acc.balance = acc.movements.reduce((acc , mov) => acc + mov, 0);
    
labelBalance.textContent =` ${acc.balance} €` ;
};

//display summary
const calcDisplaySummary = function(acc){
 const incomes =  acc.movements.filter(mov=> mov > 0).reduce((acc , mov)=> acc+mov ,0);
   labelSumIn.textContent = `${incomes}€`

   const out =  acc.movements.filter(mov=> mov < 0).reduce((acc , mov)=> acc+mov ,0);
   labelSumOut.textContent = `${Math.abs(out)}€`
   
   const intrest  =  acc.movements.filter(mov=> mov > 0).map(deposit=>(deposit * acc.interestRate)/ 100)
   .filter((int,i,arr)=>{
 
    return int >= 1 ;
   })
   .reduce((acc , int)=> acc+int ,0);
   labelSumInterest.textContent = `${intrest}€`
   

}

//user names

const createUsernames = function (accs) {
    accs.forEach(function (acc) {
        acc.username = acc.owner
          .toLowerCase()
          .split(' ')
          .map(name => name[0])
         .join('');
    });
};
createUsernames(accounts);

const updateUI= function(acc){
//display movements
displayMovements(acc.movements);
//display balance
calcDisplayBalance(acc);
//display summary
calcDisplaySummary(acc);


}



//evnt handler
let currentAccount ;

btnLogin.addEventListener('click', function (e){
//prenting form from submitting
e.preventDefault();

currentAccount = accounts.find(acc => acc.username === inputLoginUsername.value);
console.log(currentAccount);

if (currentAccount?.pin === Number(inputLoginPin.value)) {
   labelWelcome.textContent = `Welcome back, ${currentAccount.owner.split(' ')[0]
}`;
containerApp.style.opacity = 100;

//clear input fields
inputLoginPin.value = inputLoginUsername.value = '';
inputLoginPin.blur();

//update UI
updateUI(currentAccount)
}
});


//transfer button
btnTransfer.addEventListener('click', function(e){
    e.preventDefault();
    const amount = Number(inputTransferAmount.value) ;
    const recieverAcc = accounts.find(
        acc => acc.username === inputTransferTo.value);
    
   inputTransferAmount.value = inputTransferTo.value = '';

    if (amount > 0  &&
        recieverAcc &&
         currentAccount.balance >= amount &&
         recieverAcc?.username !== currentAccount.username) {
         }

         currentAccount.movements.push(-amount)
         recieverAcc.movements.push(amount);

         updateUI(currentAccount);
})

//loan button
btnLoan.addEventListener('click',function(e){
    e.preventDefault ();

    const amount = Number(inputLoanAmount.value);

    if (amount > 0 &&
         currentAccount.movements.some(mov=>
            mov >= amount * 0.1));{
                 currentAccount.movements.push(amount);

                 updateUI(currentAccount)
            }
            inputLoanAmount.value = '';
})

//acount close button
btnClose.addEventListener('click', function(e){
    e.preventDefault();
   
    if (inputCloseUsername.value === currentAccount.username &&
        Number(inputClosePin.value) === currentAccount.pin){

        const index = accounts.findIndex(
            acc => acc.username === currentAccount.username);
        console.log(index);

        accounts.splice(index, 1);
        //hide ui
        containerApp.style.opacity = 0;

        inputClosePin.value = inputCloseUsername.value = '';
    }
})

let sorted = false;
btnSort.addEventListener('click',function(e) {
    e.preventDefault();
    displayMovements(currentAccount.movements, !sorted);
    sorted = !sorted;
})



/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
/////////////////////////////////////////////////
/*
const checkDogs = function (dogsJulia,dogskate) {
  const dogsJuliaCorrected = dogsJulia.slice();
    dogsJuliaCorrected.splice(0,1);
    dogsJuliaCorrected.splice(-2);
    console.log(dogsJuliaCorrected);

    const dogs = dogsJuliaCorrected.concat(dogskate);
    console.log(dogs);

    dogs.forEach(function(dog,i){
if(dog>3){
    console.log(`Dog number ${i+1} is an Adult, and it is ${dog} years old`);
}else{
    console.log(`Dog number ${i+1} is not an Adult, and it is still a puppy🐶`)
}
    })

    
};
checkDogs ([3,5,2,12,7],[4,1,15,8,3]);
*/

//Map method 
const eurToUSD = 1.1;

const movementsUSD = movements.map(function(mov){
    return mov * eurToUSD ;
});
console.log(movements);
console.log(movementsUSD);

const movementDescriptions = movements.map(
    (mov, i) => `Movement ${i+1}: you ${mov > 0 ? 'deposited' : 'withdrawl'} ${Math.abs(mov)}`
)
console.log(movementDescriptions);
/*
const fun = function(x,y){
    return x + y ;
}
console.log(fun(15,98));
const ifun = 3

const qrr = [1,2,4,8,56];
const jfun = qrr.map(function(qr,i){
    return qr * ifun;
})
console.log(jfun);



//filter method
const can = [12 , 22 , 10 , 9 , 4 , 1 , 3] ;
const tan = can.filter(function(c){
    return c > 5  ;
})
console.log(tan);

//Reduce method
const rtan = can.reduce(function(acc,cur,i,arr){
    console.log(`itration ${i} : ${acc}`)
    return acc + cur ;
},0);
console.log(rtan);
//coding challenge

//find method
const firstWithdrawl = movements.find(mov => mov < 0);
console.log(firstWithdrawl);

*/

//seperate callback

const deposit = mov => mov > 0;
console.log(movements.some(deposit));
console.log(movements.every(deposit));
console.log(movements.filter(deposit));

//flat and flat map

const arr = [[1,2,3],[4,5,6],7,8];
console.log(arr.flat());

const arrdeep = [[[1,2],3],[4,[5,6]],7,8];
console.log(arrdeep.flat(2));
//flat
const overBalance = accounts.map(acc=> 
acc.movements).flat().reduce((acc,mov)=>acc+mov,0);
console.log(overBalance);
//flatmap
const overBalance2 = accounts.flatMap(acc=> 
    acc.movements).reduce((acc,mov)=>acc+mov,0);
    console.log(overBalance2);


 //sorting arrays
//strings
 const owners = ['Ross','Chandler','Joey','Patrik'];
 console.log(owners.sort());
//numbers
//ascending order
movements.sort((a, b)=> a-b);
console.log(movements);
//decending order
movements.sort((a, b)=> b-a);
console.log(movements); 
