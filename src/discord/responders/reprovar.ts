import { createContainer } from "@magicyan/discord";
import { pendingRegistros } from "#functions";

function localCreateResponder(cfg: any) {
  return cfg;
}

export default localCreateResponder({
  customId: "reprovar-registro",
  types: ["Button" as any],
  cache: "cached",
  async run(interaction: any) {
    try {
      const targetUserId = interaction.customId.split("_")[1];
      const data = pendingRegistros.get(targetUserId);

      const container = createContainer(
        "#000000",
        `# 🎈 NOVO REGISTRO PARA AVALIAÇÃO

**👥 CANDIDATO:**
<@${targetUserId}>

**🏷 NOME:**
${data?.nome || "—"}

**🎲 ID:**
${data?.id || "—"}

**📞 TELEFONE:**
${data?.telefone || "—"}

**⭐ RECRUTADOR:**
${data?.recrutador || "—"}

**⚡ STATUS:**
❌ Negado

**🔎 AUTORIZADO POR:**
Negado por <@${interaction.user.id}>`,
      );

      await interaction.update({
        components: [container as any],
      });

      pendingRegistros.delete(targetUserId);
    } catch (err) {
      console.error("[Reprovar] erro:", err);
    }
  },
});
