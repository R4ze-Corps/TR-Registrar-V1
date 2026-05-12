import 'dotenv/config';
import { Client, GatewayIntentBits } from 'discord.js';
import { bootstrap } from '#base';
import registrarCmd from './discord/commands/public/registrar.js';
import configurarCmd from './discord/commands/public/configurar.js';
import responderModal from './discord/responders/modalRegistro.js';
import responderAbrir from './discord/responders/abrirRegistro.js';
import responderAprovar from './discord/responders/aprovar.js';
import responderReprovar from './discord/responders/reprovar.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
  ]
});

bootstrap(client, [registrarCmd, configurarCmd], [responderModal, responderAbrir, responderAprovar, responderReprovar]);

client.login(process.env.DISCORD_TOKEN);
