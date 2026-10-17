import { describe, expect, it } from 'vitest';
import { redactDocuments, redactText, redactValue } from './redact';

describe('redator de PII', () => {
  it('documentos viram [documento]', () => {
    expect(redactDocuments('Meu CPF é 123.456.789-09 e o passaporte AB1234567')).toBe('Meu CPF é [documento] e o passaporte [documento]');
    expect(redactDocuments('cpf 12345678909')).toBe('cpf [documento]');
  });

  it('texto livre: e-mail e telefone; datas, horas, valores e números curtos ficam', () => {
    expect(redactText('Fale com ana.silva@gmail.com ou +55 (11) 98765-4321')).toBe('Fale com [email] ou [telefone]');
    expect(redactText('Check-in 14:00 em 20/11/2026, quarto 12, R$ 450,00')).toBe('Check-in 14:00 em 20/11/2026, quarto 12, R$ 450,00');
  });

  it('objetos: chaves sensíveis em qualquer nível; ids e contagens ficam', () => {
    const out = redactValue({ conversationId: 'c1', waId: '5511987654321', count: 3, nested: { guestName: 'Ana', text: 'oi', ok: true }, err: { message: 'falhou para 5511987654321' } });
    expect(out).toEqual({ conversationId: 'c1', waId: '[removido]', count: 3, nested: { guestName: '[removido]', text: '[removido]', ok: true }, err: { message: 'falhou para [telefone]' } });
  });

  it('IDs (UUID, hashes) não são confundidos com telefone ou documento', () => {
    const id = '9db7a226-544c-4a81-aa4b-123456789012';
    expect(redactText(`pedido ${id} falhou`)).toBe(`pedido ${id} falhou`);
    expect(redactText('hash a1b2c3d4e5f60718293a')).toBe('hash a1b2c3d4e5f60718293a');
    expect(redactText('ligue 11 98765-4321 ou CPF 123.456.789-09')).toBe('ligue [telefone] ou CPF [documento]');
  });
});
