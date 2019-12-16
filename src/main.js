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
        const text = ops.length != 0 ? (ops.map(op => op.opCode)).join("") : 0;
        this.$display.text(text);
        console.log(this.context.opsArr);
    }
}

class CalcContext{
    constructor(){
        this.opsArr = [];
        this.previousDigits = null;
    }
    result = new ResultOp();

    interpret(currentOp){
        if (currentOp instanceof MainActions || currentOp instanceof ResultOp){
            this.previousDigits = null;
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
                const res = this.opsArr[this.opsArr.length-1].opCode;
                this.opsArr.splice(-1, 1, new ResultNumeral(res));
            }else{
                alert("Nieprawidłowy format!")
            }
            return;
        }
        if (currentOp instanceof Numeral){
            if (this.opsArr[this.opsArr.length - 1] instanceof ResultNumeral) {
                this.opsArr.pop();
            }
            if (currentOp instanceof PercentOp){
                if(!this.previousDigits){
                    alert("Nieprawidłowy format!")
                    return;
                }
            }
            if (this.previousDigits != null) {
                currentOp = currentOp.join(this.previousDigits, currentOp.opCode);
                this.opsArr.pop();
            };
            this.previousDigits = currentOp.opCode;
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
            this.previousDigits = null;
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
        if(typeof(previous) === "string" && current === 0){
            this.opCode = `${previous}${current}`;
            return this;
        }
        this.opCode = parseFloat(`${previous}${current}`);
        return this;   
    }
}
class ResultNumeral extends Numeral {}
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
        return new Numeral((a/b).toFixed(6));
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
        context.previousDigits = null;
    }
}
class SqrtOp extends Operation{
    run(context){
        const last = context.opsArr[context.opsArr.length -1];
        const sqrt = Math.sqrt(last.opCode);
        context.opsArr.splice(-1,1, new Numeral((sqrt).toFixed(6)));
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
            if (action instanceof SubstractOp || action instanceof AddOp){
                second.opCode = first.opCode*parseFloat(second.opCode)/100;
            }else{
                second.opCode = parseFloat(second.opCode)/100;
            }  
        }
        // ----------

        const res = action.calculate(first.opCode, second.opCode);
        context.opsArr.splice(0, 3, res);
    }
}

const calculator = new Calculator;
