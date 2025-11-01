import 'dotenv/config';

export const ENV = {
  PORT: parseInt(process.env.PORT || '4000', 10),
  ORIGIN: process.env.ORIGIN || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret',
  WHATSAPP_PROVIDER: process.env.WHATSAPP_PROVIDER || 'console',
  UPLOAD_DIR: process.env.UPLOAD_DIR || '/app/uploads',
  UPLOAD_MAX_MB: parseInt(process.env.UPLOAD_MAX_MB || '3', 10),
  TWILIO: {
    ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID || '',
    AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN || '',
    FROM: process.env.TWILIO_FROM_NUMBER || '',
    REGION: process.env.TWILIO_REGION || ''
  }
};
