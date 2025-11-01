import { ENV } from '../config/env';

type Message = { to: string; body: string };

async function sendViaConsole(msg: Message) {
  console.log('WhatsApp (simulado):', msg);
}

async function sendViaTwilio(msg: Message) {
  const { ACCOUNT_SID, AUTH_TOKEN, FROM, REGION } = ENV.TWILIO;
  if (!ACCOUNT_SID || !AUTH_TOKEN || !FROM) {
    throw new Error('Config Twilio incompleta');
  }
  const twilio = (await import('twilio')).default as any;
  const client = twilio(ACCOUNT_SID, AUTH_TOKEN, REGION ? { region: REGION } : undefined);
  await client.messages.create({
    from: `whatsapp:${FROM}`,
    to: `whatsapp:${msg.to}`,
    body: msg.body
  });
}

export async function sendWhatsApp(to: string, body: string) {
  if (ENV.WHATSAPP_PROVIDER === 'twilio') {
    return sendViaTwilio({ to, body });
  }
  return sendViaConsole({ to, body });
}

export function orderCreatedMessage(code: string) {
  return `¡Hola! Tu orden ${code} fue creada. Te avisaremos los avances.`;
}

export function orderStatusMessage(code: string, status: string) {
  return `Actualización: tu orden ${code} cambió a estado "${status}".`;
}

