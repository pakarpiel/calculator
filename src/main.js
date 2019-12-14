class Calculator{
    constructor(){
        this.$display = $("#display");
        this.$buttons = $(".btn");
        this.$buttons.on("click", e => {
            const op = e.target.dataset.code;
            this.handleOperation(op);
        });
    }

    opsMap = {
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
        DIVIDE: DivideOp,
        MULTIPLY: MultiplyOp,
        SUBSTRACT: SubstractOp,
        ADD: AddOp,
        C: ClearOp,
        SQRT: SqrtOp,
        PERCENT: PercentOp,
        PLUSMINUS: PlusMinusOp,
        COMA: ComaOp,
        RESULT: ResultOp
    }

    handleOperation(opCode){
        const opType = this.opsMap[opCode];
        const currentOp = new opType(opCode);
        this.runOperations(currentOp);
    }

    context = new CalcContext();

    runOperations(currentOp){
        this.context.interpret(currentOp);
        const ops = this.context.opsArr;
        this.$display.val((ops.map(op => op.opCode)).join(""));
        console.log(this.context.opsArr);
        console.log(this.context.previousDigit);
    }
}

class CalcContext{
    constructor(){
        this.opsArr = [];
        this.previousDigit = null;
        // this.bracketsCounter = 0;
    }
    result = new ResultOp();

    interpret(currentOp){

        if (currentOp instanceof MainActions || currentOp instanceof ResultOp){
            this.previousDigit = null;
            if (this.opsArr.length === 0) return;
            if (this.opsArr[this.opsArr.length - 1] instanceof ComaOp){
                let codeOperation = this.opsArr[this.opsArr.length - 1].opCode;
                this.opsArr.splice(-1,1, new Numeral(codeOperation));
            }
        }
        if (currentOp instanceof MainActions){
            if (this.opsArr[this.opsArr.length - 1] instanceof MainActions){
                this.opsArr.pop();
            }
            this.opsArr.push(currentOp);
            if (this.opsArr.length >= 3){
                this.result.run(this);
            }
            return;
        }
        if (currentOp instanceof ResultOp){
            if (this.opsArr.length >= 3){
                currentOp.run(this);
                this.previousDigit = null;
            }else{
                alert("Nieprawidłowy format!")
            }
            return;
        }
        if (currentOp instanceof Numeral){
            if (this.opsArr[this.opsArr.length - 1] instanceof Numeral){
                this.opsArr.pop();
            }
            if (currentOp instanceof PercentOp){
                if(!this.previousDigit){
                    alert("Nieprawidłowy format!")
                    return;
                }
            }
            if (this.previousDigit) {
                currentOp = currentOp.join(this.previousDigit, currentOp.opCode);
                this.opsArr.pop();
            };
            this.previousDigit = currentOp.opCode;
            this.opsArr.push(currentOp);
            return;
        } 
        if (currentOp instanceof ClearOp){
            currentOp.run(this);
            return;
        }
        if (currentOp instanceof SqrtOp){
            if (this.opsArr[this.opsArr.length-1] instanceof Numeral){
                currentOp.run(this)
            } else {
                alert("Nieprawidłowy format!")
            }
            context.previousDigit = null;
        }
    }
}

class Operation {
    constructor(opCode){
        this.opCode = parseFloat(opCode);
    }
}
class Numeral extends Operation{
    join(previous, current){
        this.opCode = parseFloat(`${previous}${current}`);
        return this;
    }
}
class PlusMinusOp extends Numeral{
    opCode = "-";   
    join(previous, current){
        if(!previous){
            this.opCode = "-";
        } else {
            this.opCode = parseFloat(previous)*(-1);
        }
        return new Numeral(this.opCode);
    }
}
class ComaOp extends Numeral{
    opCode = ".";
    join(previous, current){
        this.opCode = `${previous}${current}`;
        return this;
    }
}
class PercentOp extends Numeral{
    opCode = "%";
    join(previous, current){
        this.opCode = `${previous}${current}`;
        return this;
    }
}
class MainActions extends Operation {}
class DivideOp extends MainActions{
    opCode = "/";
    calculate(a, b){
        return new Numeral(a/b);
    }
}
class MultiplyOp extends MainActions{
    opCode = "*";
    calculate(a, b){
        return new Numeral(a*b);
    }  
}
class SubstractOp extends MainActions{
    opCode = "-";
    calculate(a, b){
        return new Numeral(a-b);
    }
}
class AddOp extends MainActions{
    opCode = "+";
    calculate(a, b){
        return new Numeral(a+b);
    }
}
class ClearOp {
    run(context){
        context.opsArr = [];
        context.previousDigit = null;
    }
}
class SqrtOp extends Operation{
    run(context){
        const last = context.opsArr[context.opsArr.length -1];
        const sqrt = Math.sqrt(last.opCode);
        context.opsArr.splice(-1,1, new Numeral(sqrt));
        
    }
}
class ResultOp extends Operation{
    opCode = "";
    run(context){
        const numbersArray = context.opsArr.filter(op => op instanceof Numeral || op instanceof PercentOp);
        const action = context.opsArr.find(op => op instanceof MainActions);
        const first = numbersArray[0];
        const second = numbersArray[1];

        // Operations for percents
        if (first instanceof PercentOp){
            first.opCode = parseFloat(first.opCode)/100;
        }
        if (second instanceof PercentOp){
            if (action instanceof SubstractOp || action instanceof SubstractOp){
                second.opCode = first.opCode*parseFloat(second.opCode)/100;
            }else{
                second.opCode = parseFloat(second.opCode)/100;
            }  
        }
        // ----------

        const result = action.calculate(first.opCode, second.opCode);
        context.opsArr.splice(0, 3, result);
    }
}

const calculator = new Calculator;
