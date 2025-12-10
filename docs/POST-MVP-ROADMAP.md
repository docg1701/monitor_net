# Post-MVP Roadmap

Este documento descreve as funcionalidades planejadas para implementação após o MVP do NetMonitor.

## Visão Geral

O app será organizado em uma estrutura de abas:

1. **Aba Monitor** - Monitoramento em tempo real (atual)
2. **Aba Configurações** - Parâmetros de monitoramento
3. **Aba Relatórios** - Gestão de dados e exportação

---

## Fases de Implementação

### Fase 1: Persistência com SQLite

**Objetivo:** Armazenar dados de ping para análise posterior.

#### Tecnologias

| Plataforma | Pacote | Versão |
|------------|--------|--------|
| Tauri (Desktop) | `@tauri-apps/plugin-sql` | 2.3.x |
| Tauri (Rust) | `tauri-plugin-sql` | 2.3.1 |
| Capacitor (Mobile) | `@capacitor-community/sqlite` | 7.x |

#### Schema do Banco

```sql
CREATE TABLE pings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    timestamp TEXT NOT NULL,
    latency_ms REAL,
    success INTEGER NOT NULL,
    target TEXT NOT NULL
);

CREATE TABLE settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL
);

CREATE INDEX idx_pings_timestamp ON pings(timestamp);
```

#### Instalação

**Tauri (Cargo.toml):**
```toml
[dependencies]
tauri-plugin-sql = { version = "2", features = ["sqlite"] }
```

**Capacitor:**
```bash
npm install @capacitor-community/sqlite@^7.0.0
npx cap sync
```

---

### Fase 2: Aba Configurações

| Configuração | Descrição | Padrão |
|--------------|-----------|--------|
| Ping Target | IP ou hostname para testes | `8.8.8.8` |
| Intervalo | Segundos entre pings | `5` |

**Funcionalidades:**
- Validação de IP/hostname
- Persistência no SQLite
- Restaurar valores padrão

---

### Fase 3: Aba Relatórios

#### Estatísticas Exibidas
- Período de monitoramento (início/fim)
- Total de pings realizados
- Uptime (%)
- Latência média/mínima/máxima
- Número de quedas detectadas
- Tempo total offline

#### Ações
- **Limpar Dados** - Remove todos os registros (com confirmação)
- **Exportar para IA** - Gera JSON + prompt otimizado

---

## Exportação para IA (LLMs)

Em vez de gerar relatórios PDF complexos no app, exportamos dados estruturados + prompt para que ChatGPT, Claude ou Gemini gerem os gráficos e documentos.

### Formato de Exportação

```json
{
  "app": "NetMonitor",
  "version": "1.x.x",
  "export_date": "2025-12-10T10:00:00Z",
  "period": {
    "start": "2025-12-01T00:00:00Z",
    "end": "2025-12-10T10:00:00Z"
  },
  "summary": {
    "total_pings": 15234,
    "successful": 14987,
    "failed": 247,
    "uptime_percent": 98.38,
    "avg_latency_ms": 45.2,
    "min_latency_ms": 12,
    "max_latency_ms": 890,
    "total_downtime_minutes": 23.5
  },
  "outages": [
    {
      "start": "2025-12-05T14:23:00Z",
      "end": "2025-12-05T14:28:12Z",
      "duration_minutes": 5.2
    }
  ],
  "hourly_summary": [
    {"hour": "2025-12-10T00:00:00Z", "avg_latency": 42.1, "success_rate": 100},
    {"hour": "2025-12-10T01:00:00Z", "avg_latency": 38.5, "success_rate": 98.3}
  ]
}
```

### Prompt Incluído

O app gera automaticamente este prompt junto com os dados:

```
Você é um especialista em telecomunicações e direito do consumidor brasileiro.

Analise os dados de monitoramento de conexão de internet anexados e gere:

1. **Relatório Técnico** com gráficos:
   - Gráfico de linha: latência ao longo do tempo
   - Gráfico de barras: quedas por dia
   - Resumo estatístico formatado

2. **Análise de SLA**:
   - Compare com padrões aceitáveis (99.5% uptime, <100ms latência)
   - Identifique violações de qualidade

3. **Documentos para Reclamação** (se houver problemas significativos):
   - Texto para reclamação no PROCON
   - Texto para reclamação na ANATEL
   - Modelo de notificação extrajudicial ao provedor

Dados do monitoramento:
[COLE OS DADOS JSON AQUI]
```

### Fluxo do Usuário

1. Abre aba Relatórios
2. Clica em "Exportar para IA"
3. App gera JSON + prompt + instruções
4. Usuário copia para área de transferência
5. Cola no ChatGPT/Claude/Gemini
6. IA gera relatório completo com gráficos e documentos

### Instruções Incluídas na Exportação

O app também exporta estas instruções para o usuário:

```
═══════════════════════════════════════════════════════════════
                    COMO USAR ESTA EXPORTAÇÃO
═══════════════════════════════════════════════════════════════

1. ACESSE UM CHATBOT DE IA:
   • ChatGPT: https://chat.openai.com (recomendado: GPT-4)
   • Claude: https://claude.ai
   • Gemini: https://gemini.google.com

2. INICIE UMA NOVA CONVERSA

3. COLE TODO O CONTEÚDO ABAIXO (prompt + dados)

4. ENVIE E AGUARDE A ANÁLISE

5. A IA IRÁ GERAR:
   ✓ Gráficos de latência e quedas
   ✓ Análise de qualidade da conexão
   ✓ Documentos para reclamação (se necessário)

DICA: Se os dados forem muito grandes, a IA pode pedir para
      anexar como arquivo. Salve como "netmonitor_dados.json".

═══════════════════════════════════════════════════════════════
```

---

### Fase 4: Melhorias de UX

#### Cartão de Uptime
Na tela principal, exibir há quanto tempo o app está monitorando:
```
Monitorando há: 2h 34m 12s
```

#### Notificação de Queda (Android)
Enviar notificação push quando a conexão cair, mesmo com app em background.

---

### Fase 5: Futuro (Opcional)

- Widget de status para home screen
- Histórico visual simples de quedas
- Temas claro/escuro

---

## Referências

- [Tauri SQL Plugin](https://v2.tauri.app/plugin/sql/)
- [Capacitor SQLite](https://github.com/capacitor-community/sqlite)
- [Regulamento ANATEL](https://www.anatel.gov.br)
- [Código de Defesa do Consumidor](http://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm)
