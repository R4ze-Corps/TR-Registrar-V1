import { createContainer } from '@magicyan/discord';
import { configCentral, pendingRegistros } from '#functions';
import { PermissionFlagsBits } from 'discord.js';

function localCreateResponder(cfg: any) {
  return cfg;
}

export default localCreateResponder({
  customId: 'aprovar-registro',
  types: ['Button' as any],
  cache: 'cached',
  async run(interaction: any) {
    try {
      const targetUserId = interaction.customId.split('_')[1];
      const data = pendingRegistros.get(targetUserId);

      const container = createContainer(
        '#000000',
        `# 🎈 Novo Registro Para Avaliação

**👥 CANDIDATO:**
<@${targetUserId}>

**🏷 NOME:**
${data?.nome || '—'}

**🎲 ID:**
${data?.id || '—'}

**📞 TELEFONE:**
${data?.telefone || '—'}

**⭐ RECRUTADOR:**
${data?.recrutador || '—'}

**⚡ STATUS:**
✅ Aprovado

**🔎 AUTORIZADO POR:**
<@${interaction.user.id}>`
      );

      await interaction.update({
        components: [container as any],
      });

      try {
        const member = await interaction.guild.members.fetch(targetUserId);

        if (data) {
          await member.setNickname(`${data.id} | ${data.nome}`).catch(() => {});
        }

        const roleIds = [configCentral.cargos.aprovado, configCentral.cargos.aprovado2].filter(Boolean);
        if (roleIds.length > 0) {
          await member.roles.add(roleIds);
        }

        const registrarRoleId = configCentral.cargos.registrar;
        if (registrarRoleId && member.roles.cache.has(registrarRoleId)) {
          await member.roles.remove(registrarRoleId);
        }
      } catch (err) {
        console.error('[Aprovar] erro ao processar membro:', err);
      }

      pendingRegistros.delete(targetUserId);
    } catch (err) {
      console.error('[Aprovar] erro:', err);
    }
  },
});
