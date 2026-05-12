import { Command } from '#base';
import { ApplicationCommandType } from 'discord.js';
import { setConfigValue } from '#functions';

export default new Command({
  name: 'configurar',
  description: 'Configurar o sistema de registro',
  type: ApplicationCommandType.ChatInput,
  options: [
    {
      type: 1,
      name: 'canal',
      description: 'Configurar canal de log de registro',
      options: [
        {
          type: 7,
          name: 'canal',
          description: 'Canal de log',
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: 'cargo-registrar',
      description: 'Configurar cargo necessário para se registrar',
      options: [
        {
          type: 8,
          name: 'cargo',
          description: 'Cargo requerido',
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: 'cargo-aprovado',
      description: 'Configurar cargo de aprovado',
      options: [
        {
          type: 8,
          name: 'cargo',
          description: 'Cargo de aprovado',
          required: true,
        },
      ],
    },
    {
      type: 1,
      name: 'cargo-aprovado2',
      description: 'Configurar segundo cargo de aprovado',
      options: [
        {
          type: 8,
          name: 'cargo',
          description: 'Segundo cargo de aprovado',
          required: true,
        },
      ],
    },
  ],
  async run(interaction: any) {
    try {

      const sub = interaction.options.getSubcommand();

      if (sub === 'canal') {
        const channel = interaction.options.getChannel('canal');
        setConfigValue('canalRegistro', channel.id);
        await interaction.reply({
          content: `Canal de registro configurado: ${channel}`,
          ephemeral: true,
        });
      } else if (sub === 'cargo-registrar') {
        const role = interaction.options.getRole('cargo');
        setConfigValue('cargos.registrar', role.id);
        await interaction.reply({
          content: `Cargo para registrar configurado: ${role}`,
          ephemeral: true,
        });
      } else if (sub === 'cargo-aprovado') {
        const role = interaction.options.getRole('cargo');
        setConfigValue('cargos.aprovado', role.id);
        await interaction.reply({
          content: `Cargo de aprovado configurado: ${role}`,
          ephemeral: true,
        });
      } else if (sub === 'cargo-aprovado2') {
        const role = interaction.options.getRole('cargo');
        setConfigValue('cargos.aprovado2', role.id);
        await interaction.reply({
          content: `Segundo cargo de aprovado configurado: ${role}`,
          ephemeral: true,
        });
      }
    } catch (err) {
      console.error('[Configurar] erro:', err);
      if (!interaction.replied) {
        await interaction.reply({
          content: 'Erro ao configurar.',
          ephemeral: true,
        });
      }
    }
  },
});
