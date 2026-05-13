import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const configPath = join(__dirname, '..', '..', 'ConfigCentral.json');

interface ConfigData {
  canalRegistro: string;
  cargos: {
    registrar: string;
    aprovado: string;
    aprovado2: string;
  };
}

function load(): ConfigData {
  if (!existsSync(configPath)) {
    console.log(`[Config] Arquivo não encontrado em: ${configPath}`);
    return { canalRegistro: '', cargos: { registrar: '', aprovado: '', aprovado2: '' } };
  }
  return JSON.parse(readFileSync(configPath, 'utf-8'));
}

function save(data: ConfigData) {
  writeFileSync(configPath, JSON.stringify(data, null, 2), 'utf-8');
}

export const configCentral = load();

export function setConfigValue(key: string, value: string) {
  if (key === 'canalRegistro') {
    configCentral.canalRegistro = value;
  } else if (key.startsWith('cargos.')) {
    const sub = key.split('.')[1] as 'registrar' | 'aprovado' | 'aprovado2';
    configCentral.cargos[sub] = value;
  }
  save(configCentral);
}

export const pendingRegistros = new Map<string, {
  nome: string;
  id: string;
  recrutador: string;
  telefone: string;
}>();
