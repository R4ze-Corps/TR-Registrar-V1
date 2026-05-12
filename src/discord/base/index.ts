import {
  Client,
  REST,
  Routes,
  Interaction,
  ApplicationCommandType,
} from 'discord.js';

export class Command {
  public name: string;
  public data: Record<string, any>;
  public run: (interaction: any) => Promise<void>;

  constructor(cfg: {
    name: string;
    description: string;
    type: ApplicationCommandType;
    options?: any[];
    run: (interaction: any) => Promise<void>;
  }) {
    this.name = cfg.name;
    this.data = {
      name: cfg.name,
      description: cfg.description,
      type: cfg.type,
    };
    if (cfg.options) {
      this.data.options = cfg.options;
    }
    this.run = cfg.run;
  }

  toJSON() {
    return this.data;
  }
}

interface ResponderConfig {
  customId: string;
  types: string[];
  cache: string;
  run: (interaction: any) => Promise<void>;
}

export function bootstrap(
  client: Client,
  commands: Command[],
  responders: ResponderConfig[]
) {
  const commandMap = new Map<string, Command>();
  for (const cmd of commands) {
    commandMap.set(cmd.name, cmd);
  }

  client.on('interactionCreate', async (interaction: Interaction) => {
    try {
      if (interaction.isChatInputCommand()) {
        const command = commandMap.get(interaction.commandName);
        if (!command) {
          await interaction.reply({
            content: 'Comando não encontrado.',
            ephemeral: true,
          });
          return;
        }
        await command.run(interaction);
        return;
      }

      if (interaction.isButton() || interaction.isModalSubmit()) {
        const type = interaction.isButton() ? 'Button' : 'Modal';
        const responder = responders.find((r) =>
          r.types.includes(type) &&
          interaction.customId.startsWith(r.customId)
        );
        if (responder) {
          await responder.run(interaction);
          return;
        }
      }
    } catch (err) {
      console.error('[Interaction] erro:', err);
      if ((interaction as any).isChatInputCommand?.() && !(interaction as any).replied) {
        try {
          await (interaction as any).reply({
            content: 'Ocorreu um erro ao processar a interação.',
            ephemeral: true,
          });
        } catch {}
      }
    }
  });

  client.once('ready', async () => {
    console.log(`[Bot] Logado como ${client.user?.tag}`);
    await registerCommands(client, commands);
  });
}

async function registerCommands(client: Client, commands: Command[]) {
  const rest = new REST({ version: '10' }).setToken(
    process.env.DISCORD_TOKEN!
  );

  const guildId = process.env.GUILD_ID;
  if (!guildId) {
    console.log('[Commands] Nenhum GUILD_ID definido. Pulando registro.');
    return;
  }

  try {
    const commandsData = commands.map((cmd) => cmd.toJSON());
    await rest.put(
      Routes.applicationGuildCommands(client.user!.id, guildId),
      { body: commandsData }
    );
    console.log(`[Commands] ${commandsData.length} comandos registrados.`);
  } catch (err) {
    console.error('[Commands] Erro ao registrar comandos:', err);
  }
}
