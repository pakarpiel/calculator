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
        const operation = new operationType();
        this.displayResult(operationCode);
    }

    displayResult(operation){
        this.$display.val(operation);
    }
}

class Numeral{}
class DivideOperation{}
class MultiplyOperation{}
class SubstractOperation{}
class AddOperation{}
class ClearOperations{}
class BracketsOperation{}
class PercentOperation{}
class PlusMinusOperation{}
class ComaOperation{}
class ResultOperation{}

const calculator = new Calculator;
