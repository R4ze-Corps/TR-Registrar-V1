import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { bootstrap } from '#base';
import registrarCmd from './discord/commands/public/registrar.js';
import configurarCmd from './discord/commands/public/configurar.js';
import responderModal from './discord/responders/modalRegistro.js';
import responderAbrir from './discord/responders/abrirRegistro.js';
import responderAprovar from './discord/responders/aprovar.js';
import responderReprovar from './discord/responders/reprovar.js';

process.on('unhandledRejection', (reason) => {
  console.log('[UNHANDLED_REJECTION]', reason);
});
process.on('uncaughtException', (err) => {
  console.log('[UNCAUGHT_EXCEPTION]', err);
});

async function main() {
  console.log('[STARTUP] Iniciando bot...');

  if (!process.env.DISCORD_TOKEN) {
    console.log('[STARTUP] DISCORD_TOKEN não definido!');
    return;
  }
  if (!process.env.GUILD_ID) {
    console.log('[STARTUP] GUILD_ID não definido!');
    return;
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMembers,
    ]
  });

  bootstrap(client, [registrarCmd, configurarCmd], [responderModal, responderAbrir, responderAprovar, responderReprovar]);

  try {
    await client.login(process.env.DISCORD_TOKEN);
    console.log('[STARTUP] Login realizado com sucesso');
  } catch (err) {
    console.log('[STARTUP] Erro ao fazer login:', err);
  }
}

main().catch((err) => console.log('[STARTUP] Erro fatal:', err));
