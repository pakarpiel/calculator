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
        this.$display.val(operations.join(""));
        console.log(this.context.operationsArray);
    }
}

class CalcContext{
    constructor(){
        this.operationsArray = [];
        this.previousOperation = null;
    }

    interpret(currentOperation){
        if (currentOperation instanceof MainAxctions){
            this.operationsArray.push(currentOperation.operationCode);
            this.previousOperation = null;
            return;
        }
        if (currentOperation instanceof Numeral){
            if (this.previousOperation) {
                currentOperation = currentOperation.join(this.previousOperation, currentOperation.operationCode);
                this.operationsArray.pop();
            
            };
            this.previousOperation = currentOperation.operationCode;
        }
        this.operationsArray.push(currentOperation.operationCode);
        
        
    }
}

class Operation {
    constructor(operationCode){
        this.operationCode = parseInt(operationCode);
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
        return this;
    }

}
class ComaOperation extends Numeral{
    operationCode = ".";
    join(previous, current){
        this.operationCode = `${previous}${current}`;
        return this;
    }

}
class MainAxctions extends Operation {}
class DivideOperation extends MainAxctions{
    operationCode = "/";
}
class MultiplyOperation extends MainAxctions{
    operationCode = "*";
}
class SubstractOperation extends MainAxctions{
    operationCode = "-";
}
class AddOperation extends MainAxctions{
    operationCode = "+";
}
class ClearOperations {}
class BracketsOperation extends Operation{
    operationCode = "()";
}
class PercentOperation extends Operation{
    operationCode = "%";
}
class ResultOperation extends Operation{
    operationCode = "=";
}

const calculator = new Calculator;
