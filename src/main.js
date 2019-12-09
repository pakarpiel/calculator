class Calculator{
    constructor(){
        this.$display = $("#display");
        this.$buttons = $(".btn");

        this.$buttons.on("click", e => {
            const operation = e.target.dataset.code;
            this.handleOperation(operation);
        });
    }

    operationsMap = {
        "1": Numeral,
        "2": Numeral,
        "3": Numeral,
        "4": Numeral,
        "5": Numeral,
        "6": Numeral,
        "7": Numeral,
        "8": Numeral,
        "9": Numeral,
        "0": Numeral,
        DIVIDE: DivideOperation,
        MULTIPLY: MultiplyOperation,
        SUBSTRACT: SubstractOperation,
        ADD: AddOperation,
        C: ClearOperations,
        BRACKETS: BracketsOperation,
        PERCENT: PercentOperation,
        PLUSMINUS: PlusMinusOperation,
        COMA: ComaOperation,
        RESULT: ResultOperation
    }

    handleOperation(operationCode){
        const operationType = this.operationsMap[operationCode];
        const currentOperation = new operationType(operationCode);
        this.runOperations(currentOperation);
    }

    context = new CalcContext();

    runOperations(currentOperation){
        this.context.interpret(currentOperation);
        const operations = this.context.operationsArray;
        this.$display.val((operations.map(operation => operation.operationCode)).join(""));
        console.log(this.context.operationsArray);
    }
}

class CalcContext{
    constructor(){
        this.operationsArray = [];
        this.previousOperation = null;
    }
    result = new ResultOperation();

    interpret(currentOperation){
        

        if (currentOperation instanceof MainAxctions){
            this.previousOperation = null;
            this.operationsArray.push(currentOperation); 
            if (this.operationsArray.length >= 3){
                this.result.run(this);
            }
            return;
        }
        if (currentOperation instanceof Numeral){
            // if(this.operationsArray[0] instanceof ResultOperation){
            //     this.operationsArray = [];
            // }
            if (this.previousOperation) {
                currentOperation = currentOperation.join(this.previousOperation, currentOperation.operationCode);
                this.operationsArray.pop();
            };
            this.previousOperation = currentOperation.operationCode;
            this.operationsArray.push(currentOperation);
        } 
        if (currentOperation instanceof ResultOperation){
            this.previousOperation = null;
            if (this.operationsArray.length >= 3){
                currentOperation.run(this);
            }else{
                alert("Nieprawidłowy format!")
            }
        }
        if (currentOperation instanceof ClearOperations){
            currentOperation.run(this);
        }
    }
}

class Operation {
    constructor(operationCode){
        this.operationCode = parseFloat(operationCode);
    }
}
class Numeral extends Operation{
    join(previous, current){
        this.operationCode = parseFloat(`${previous}${current}`);
        return this;
    }
}
class PlusMinusOperation extends Numeral{
    operationCode = "-";
    
    join(previous, current){
        if(!previous){
            this.operationCode = "-";
        } else {
            this.operationCode = parseFloat(previous)*(-1);
        }
        return new Numeral(this.operationCode);
    }

}
class ComaOperation extends Numeral{
    operationCode = ".";
    join(previous, current){
        this.operationCode = `${previous}${current}`;
        return this;
    }

}
class MainAxctions extends Operation {
    
}
class DivideOperation extends MainAxctions{
    operationCode = "/";
    calculate(a, b){
        return new Numeral(a/b);
    }
}
class MultiplyOperation extends MainAxctions{
    operationCode = "*";
    calculate(a, b){
        return new Numeral(a*b);
    }
    
}
class SubstractOperation extends MainAxctions{
    operationCode = "-";
    calculate(a, b){
        return new Numeral(a-b);
    }
}
class AddOperation extends MainAxctions{
    operationCode = "+";
    calculate(a, b){
        return new Numeral(a+b);
    }
}
class ClearOperations {
    run(context){
        context.operationsArray = [];
    }
}
class BracketsOperation extends Operation{
    operationCode = "()";
}
class PercentOperation extends Operation{
    operationCode = "%";
}
class ResultOperation extends Operation{
    operationCode = "";

    run(context){
        const numbersArray = context.operationsArray.filter(operation => operation instanceof Numeral);
        const action = context.operationsArray.find(operation => operation instanceof MainAxctions);

        const result = action.calculate(numbersArray[0].operationCode, numbersArray[1].operationCode);
        context.operationsArray.splice(0, 3, result);

    }
    

}

const calculator = new Calculator;
