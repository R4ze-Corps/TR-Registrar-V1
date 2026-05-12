import { ButtonBuilder, ButtonStyle, MessageFlags } from 'discord.js';
import { createContainer, createRow } from '@magicyan/discord';
import { configCentral, pendingRegistros } from '#functions';

function localCreateResponder(cfg: any) {
  return cfg;
}

export default localCreateResponder({
  customId: 'modal-registro',
  types: ['Modal' as any],
  cache: 'cached',
  async run(interaction: any) {
    try {
      const nome = interaction.fields.getTextInputValue('nome');
      const id = interaction.fields.getTextInputValue('id');
      const recrutador = interaction.fields.getTextInputValue('recrutador');
      const telefone = interaction.fields.getTextInputValue('telefone');

      const logChannelId = configCentral.canalRegistro;
      if (!logChannelId) {
        await interaction.reply({
          content: 'Canal de registro não configurado. Avise um administrador.',
          ephemeral: true,
        });
        return;
      }

      const logChannel = await interaction.guild.channels.fetch(logChannelId);
      if (!logChannel?.isTextBased()) {
        await interaction.reply({
          content: 'Canal de registro inválido. Avise um administrador.',
          ephemeral: true,
        });
        return;
      }

      pendingRegistros.set(interaction.user.id, { nome, id, recrutador, telefone });

      const botoes = createRow(
        new ButtonBuilder()
          .setCustomId(`aprovar-registro_${interaction.user.id}`)
          .setLabel('✔ APROVAR')
          .setStyle(ButtonStyle.Success),
        new ButtonBuilder()
          .setCustomId(`reprovar-registro_${interaction.user.id}`)
          .setLabel('❌ REPROVAR')
          .setStyle(ButtonStyle.Danger)
      );

      const container = createContainer(
        '#000000',
        `# 🎈 Novo Registro Para Avaliação

**👥 CANDIDATO:**
<@${interaction.user.id}>

**🏷 NOME:**
${nome}

**🎲 ID:**
${id}

**📞 TELEFONE:**
${telefone}

**⭐ RECRUTADOR:**
${recrutador}

**⚡ STATUS:**
⏳ Pendente

**🔎 AUTORIZADO POR:**
—`,
        botoes
      );

      await logChannel.send({
        components: [container as any],
        flags: MessageFlags.IsComponentsV2,
      });

      await interaction.reply({
        content: 'Registro enviado para avaliação!',
        ephemeral: true,
      });
    } catch (err) {
      console.error('[ModalRegistro] erro:', err);
      if (!interaction.replied) {
        await interaction.reply({
          content: 'Erro ao processar registro.',
          ephemeral: true,
        });
      }
    }
  },
});
