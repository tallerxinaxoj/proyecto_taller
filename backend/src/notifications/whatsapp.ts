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
  try {
    const twilio = (await import('twilio')).default as any;
    const client = twilio(ACCOUNT_SID, AUTH_TOKEN, REGION ? { region: REGION } : undefined);
    await client.messages.create({
      from: `whatsapp:${FROM}`,
      to: `whatsapp:${msg.to}`,
      body: msg.body
    });
  } catch (e: any) {
    const m = e?.message || String(e);
    throw new Error(`Twilio error: ${m}`);
  }
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

export function getWhatsAppStatus() {
  const provider = ENV.WHATSAPP_PROVIDER;
  if (provider !== 'twilio') {
    return {
      provider,
      ready: false,
      reason: 'Proveedor console (simulado). Cambia WHATSAPP_PROVIDER=twilio para envío real.'
    };
  }
  const { ACCOUNT_SID, AUTH_TOKEN, FROM } = ENV.TWILIO;
  const missing = [
    ['TWILIO_ACCOUNT_SID', ACCOUNT_SID],
    ['TWILIO_AUTH_TOKEN', AUTH_TOKEN],
    ['TWILIO_FROM_NUMBER', FROM]
  ].filter(([k, v]) => !v).map(([k]) => k);
  if (missing.length) {
    return { provider, ready: false, reason: `Faltan variables: ${missing.join(', ')}` };
  }
  return { provider, ready: true } as const;
}
