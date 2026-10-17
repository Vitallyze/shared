/**
 * Redator de dados pessoais (LGPD). Fonte única, consumida como submódulo git em `app/src/shared`
 * pelo smartinn-app (logger central, exportação do conjunto de avaliação, texto antes da IA) e pelo
 * bot-platform (todo console.* do processo).
 */

/** Chaves cujo valor nunca vai para log, em qualquer nível do objeto. */
const SENSITIVE_KEYS = /^(phone|phones|displayphone|waid|wa_id|from|to|contactwaid|email|name|guestname|profilename|body|text|reply|summary|note|notes|password|passwordhash|token|secret|authorization|cookie|cpf|rg|passport|document|copypaste|pixcopypaste)$/i;

const EMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi;
const CPF = /(?<![\w-])\d{3}\.?\d{3}\.?\d{3}-?\d{2}(?![\w-])/g;
const RG = /(?<![\w-])\d{1,2}\.?\d{3}\.?\d{3}-?[\dXx](?![\w-])/g;
/** Passaporte: 1 a 2 letras + 6 a 8 dígitos (BR e a maioria dos países). */
const PASSPORT = /\b[A-Z]{1,2}\d{6,8}\b/g;
/** Telefone: 10 a 15 dígitos, com ou sem +, espaços, parênteses e hífens. */
const PHONE = /(?<![\w-])\+?\d[\d\s().-]{8,}\d(?![\w-])/g;

/** Números de documento viram [documento]. Usado antes de mandar texto à IA. */
export function redactDocuments(text: string): string {
  return text.replace(CPF, '[documento]').replace(PASSPORT, '[documento]').replace(RG, '[documento]');
}

/** Texto livre: documentos, e-mails e telefones. */
export function redactText(text: string): string {
  return redactDocuments(text)
    .replace(EMAIL, '[email]')
    .replace(PHONE, (m) => (m.replace(/\D/g, '').length >= 10 ? '[telefone]' : m));
}

/** Objeto de log: remove chaves sensíveis e redige textos restantes. Não altera o original. */
export function redactValue(value: unknown, depth = 0): unknown {
  if (depth > 6) return '[profundo]';
  if (typeof value === 'string') return redactText(value);
  if (Array.isArray(value)) return value.map((v) => redactValue(v, depth + 1));
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value as Record<string, unknown>)) {
      out[k] = SENSITIVE_KEYS.test(k) && v !== null && v !== undefined ? '[removido]' : redactValue(v, depth + 1);
    }
    return out;
  }
  return value;
}
