// ── Safe math expression evaluator (recursive descent parser) ──
// No eval, no Function constructor — pure parser

export function evaluateMath(expr: string): number | null {
  try {
    const cleaned = expr.replace(/\s+/g, '').replace(/,/g, '.');
    const parser = new MathParser(cleaned);
    const result = parser.parseExpression();
    if (parser.pos < cleaned.length) return null; // leftover = invalid
    if (!isFinite(result) || isNaN(result)) return null;
    return result;
  } catch {
    return null;
  }
}

class MathParser {
  pos = 0;

  constructor(private input: string) {}

  private peek(): string {
    return this.input[this.pos] || '';
  }

  private advance(): string {
    return this.input[this.pos++] || '';
  }

  private skipWhitespace(): void {
    while (this.pos < this.input.length && /\s/.test(this.input[this.pos])) {
      this.pos++;
    }
  }

  parseExpression(): number {
    let left = this.parseTerm();
    while (this.peek() === '+' || this.peek() === '-') {
      const op = this.advance();
      const right = this.parseTerm();
      left = op === '+' ? left + right : left - right;
    }
    return left;
  }

  private parseTerm(): number {
    let left = this.parseFactor();
    while (this.peek() === '*' || this.peek() === '/') {
      const op = this.advance();
      const right = this.parseFactor();
      if (op === '*') left *= right;
      else {
        if (right === 0) throw new Error('Division by zero');
        left /= right;
      }
    }
    return left;
  }

  private parseFactor(): number {
    let base = this.parseBase();
    if (this.peek() === '^') {
      this.advance();
      const exp = this.parseFactor();
      base = Math.pow(base, exp);
    }
    return base;
  }

  private parseBase(): number {
    this.skipWhitespace();
    const ch = this.peek();
    if (ch === '-') {
      this.advance();
      return -this.parseBase();
    }
    if (ch === '+') {
      this.advance();
      return this.parseBase();
    }
    if (ch === '(') {
      this.advance();
      const val = this.parseExpression();
      if (this.peek() !== ')') throw new Error('Expected )');
      this.advance();
      return val;
    }
    // number
    let num = '';
    while (this.pos < this.input.length && /[\d.]/.test(this.input[this.pos])) {
      num += this.advance();
    }
    if (num === '') throw new Error('Expected number');
    return parseFloat(num);
  }
}
