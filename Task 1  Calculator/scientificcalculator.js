const display = document.getElementById("display");
let expression = "";

function append(value) {
  if (value === "π") {
    expression += Math.PI.toString();
  } else if (value === "^2") {
    expression += "^2";
  } else if (value === "√(") {
    expression += "sqrt(";
  } else {
    expression += value;
  }
  display.value = expression;
}

function clearDisplay() {
  expression = "";
  display.value = "";
}

function backspace() {
  expression = expression.slice(0, -1);
  display.value = expression;
}

function calculate() {
  try {
    const tokens = tokenize(expression);
    const rpn = toRPN(tokens);
    const result = evaluateRPN(rpn);
    display.value = Number(result).toFixed(5);
    expression = result.toString();
  } catch (e) {
    display.value = "Error";
    expression = "";
  }
}

function tokenize(expr) {
  const tokens = [];
  let i = 0;

  while (i < expr.length) {
    let ch = expr[i];

    if (ch >= '0' && ch <= '9' || ch === '.') {
      let num = ch;
      i++;
      while (i < expr.length && (expr[i] >= '0' && expr[i] <= '9' || expr[i] === '.')) {
        num += expr[i];
        i++;
      }
      tokens.push(parseFloat(num));
      continue;
    } else if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '^' || ch === '(' || ch === ')') {
      tokens.push(ch);
    } else {
      // Function or constant
      let func = ch;
      i++;
      while (i < expr.length && /[a-z]/i.test(expr[i])) {
        func += expr[i];
        i++;
      }
      tokens.push(func);
      continue;
    }
    i++;
  }

  return tokens;
}

function toRPN(tokens) {
  const output = [];
  const operators = [];

  const precedence = {
    '+': 1, '-': 1,
    '*': 2, '/': 2,
    '^': 3
  };

  for (let i = 0; i < tokens.length; i++) {
    let token = tokens[i];

    if (typeof token === "number") {
      output.push(token);
    } else if (isFunction(token)) {
      operators.push(token);
    } else if (token === '(') {
      operators.push(token);
    } else if (token === ')') {
      while (operators.length > 0 && operators[operators.length - 1] !== '(') {
        output.push(operators.pop());
      }
      operators.pop(); // Remove '('
      if (operators.length > 0 && isFunction(operators[operators.length - 1])) {
        output.push(operators.pop());
      }
    } else if (isOperator(token)) {
      while (
        operators.length > 0 &&
        isOperator(operators[operators.length - 1]) &&
        (
          precedence[token] < precedence[operators[operators.length - 1]] ||
          (precedence[token] === precedence[operators[operators.length - 1]] && token !== '^')
        )
      ) {
        output.push(operators.pop());
      }
      operators.push(token);
    }
  }

  while (operators.length > 0) {
    output.push(operators.pop());
  }

  return output;
}

function evaluateRPN(rpn) {
  const stack = [];

  for (let i = 0; i < rpn.length; i++) {
    let token = rpn[i];

    if (typeof token === "number") {
      stack.push(token);
    } else if (isOperator(token)) {
      let b = stack.pop();
      let a = stack.pop();
      if (token === '+') stack.push(a + b);
      else if (token === '-') stack.push(a - b);
      else if (token === '*') stack.push(a * b);
      else if (token === '/') stack.push(a / b);
      else if (token === '^') stack.push(Math.pow(a, b));
    } else if (isFunction(token)) {
      let a = stack.pop();
      stack.push(applyFunction(token, a));
    }
  }

  return stack[0];
}

function isOperator(token) {
  return token === '+' || token === '-' || token === '*' || token === '/' || token === '^';
}

function isFunction(token) {
  return ["sin", "cos", "tan", "log", "ln", "sqrt"].includes(token);
}

function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

function applyFunction(fn, x) {
  if (fn === "sin") return Math.sin(toRadians(x));
  if (fn === "cos") return Math.cos(toRadians(x));
  if (fn === "tan") return Math.tan(toRadians(x));
  if (fn === "log") return Math.log10(x);
  if (fn === "ln") return Math.log(x);
  if (fn === "sqrt") return Math.sqrt(x);
  return x;
}
