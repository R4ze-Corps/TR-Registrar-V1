import { Command } from '#base';
import {
  ApplicationCommandType,
  ButtonBuilder,
  ButtonStyle,
  MessageFlags,
} from 'discord.js';
import { createContainer } from '@magicyan/discord';

export default new Command({
  name: 'registrar',
  description: 'Abrir formulário de registro',
  type: ApplicationCommandType.ChatInput,
  async run(interaction: any) {
    try {
      const container = createContainer(
        '#FF0000',
        '**Bem-vindo ao Sistema de Registro**\nPara fazer sua liberação, precisamos de algumas informações suas.\n\nPor favor, clique no botão abaixo para abrir o formulário e preencher o seu **Nome, ID** e **Telefone.**',
        new ButtonBuilder()
          .setCustomId('btn-abrir-registro')
          .setLabel('📃 Registrar')
          .setStyle(ButtonStyle.Secondary)
      );

      await interaction.reply({
        components: [container as any],
        flags: MessageFlags.IsComponentsV2,
      });
    } catch (err) {
      console.error('[Registrar] erro:', err);
      if (!interaction.replied) {
        await interaction.reply({
          content: 'Erro ao abrir formulário.',
          ephemeral: true,
        });
      }
    }
  },
});
