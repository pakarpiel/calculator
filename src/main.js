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
    }

    interpret(currentOperation){
        this.operationsArray.push(currentOperation.operationCode);
    }
}

class Operation {
    constructor(operationCode){
        this.operationCode = operationCode;
    }
}
class Numeral extends Operation{}
class DivideOperation extends Operation{
    operationCode = "/";
}
class MultiplyOperation extends Operation{
    operationCode = "*";
}
class SubstractOperation extends Operation{
    operationCode = "-";
}
class AddOperation extends Operation{
    operationCode = "+";
}
class ClearOperations extends Operation{}
class BracketsOperation extends Operation{}
class PercentOperation extends Operation{}
class PlusMinusOperation extends Operation{}
class ComaOperation extends Operation{}
class ResultOperation extends Operation{}

const calculator = new Calculator;
