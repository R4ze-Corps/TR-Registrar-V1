import { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';

function localCreateResponder(cfg: any) {
  return cfg;
}

export default localCreateResponder({
  customId: 'btn-abrir-registro',
  types: ['Button' as any],
  cache: 'cached',
  async run(interaction: any) {
    try {
      const modal = new ModalBuilder()
        .setCustomId('modal-registro')
        .setTitle('Novo Registro');

      const nomeInput = new TextInputBuilder()
        .setCustomId('nome')
        .setLabel('Nome')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(100)
        .setRequired(true);

      const idInput = new TextInputBuilder()
        .setCustomId('id')
        .setLabel('ID')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(50)
        .setRequired(true);

      const recrutadorInput = new TextInputBuilder()
        .setCustomId('recrutador')
        .setLabel('Recrutador')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(100)
        .setRequired(true);

      const telefoneInput = new TextInputBuilder()
        .setCustomId('telefone')
        .setLabel('Telefone')
        .setStyle(TextInputStyle.Short)
        .setMaxLength(30)
        .setRequired(true);

      const row1 = new ActionRowBuilder<TextInputBuilder>().addComponents(nomeInput);
      const row2 = new ActionRowBuilder<TextInputBuilder>().addComponents(idInput);
      const row3 = new ActionRowBuilder<TextInputBuilder>().addComponents(recrutadorInput);
      const row4 = new ActionRowBuilder<TextInputBuilder>().addComponents(telefoneInput);

      modal.addComponents(row1, row2, row3, row4);

      await interaction.showModal(modal);
    } catch (err) {
      console.error('[AbrirRegistro] erro:', err);
    }
  },
});
