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

#### Configurações de Monitoramento

| Configuração | Descrição | Padrão |
|--------------|-----------|--------|
| Ping Target | Seleção via dropdown (ver opções abaixo) | `Google DNS (8.8.8.8)` |
| Intervalo | Segundos entre pings | `5` |

**Opções de Ping Target (Dropdown):**

| Label | Endereço | Protocolo | Notas |
|-------|----------|-----------|-------|
| Google DNS | 8.8.8.8 | ICMP/HTTP | Mais confiável, presença global |
| Cloudflare DNS | 1.1.1.1 | ICMP/HTTP | Conhecido por baixa latência |
| Quad9 DNS | 9.9.9.9 | ICMP/HTTP | Alternativa focada em segurança |
| OpenDNS | 208.67.222.222 | ICMP/HTTP | Popular em empresas |
| Google Web | www.google.com | HTTP HEAD | Medição via web |
| Cloudflare Web | www.cloudflare.com | HTTP HEAD | Alternativa via web |

> **Nota de Segurança:** Usar dropdown com alvos pré-definidos em vez de campo de texto livre mantém a segurança do backend Rust (whitelist de domínios permitidos) enquanto oferece opções úteis ao usuário.

#### País/Região

| Opção | Órgão de Reclamação | Legislação |
|-------|---------------------|------------|
| 🇧🇷 Brasil | ANATEL, PROCON | CDC, Marco Civil |
| 🇺🇸 Estados Unidos | FCC, State Attorney General | FCC Rules, State Consumer Laws |
| 🇪🇺 União Europeia | National Telecom Authority | EECC, GDPR |
| 🇬🇧 Reino Unido | Ofcom, Ombudsman Services | Communications Act 2003 |

#### Dados do Usuário (para relatório)

| Campo | Brasil | EUA | UE | UK |
|-------|--------|-----|----|----|
| Nome completo | ✓ | ✓ | ✓ | ✓ |
| Documento | CPF/CNPJ | SSN (opcional) | National ID | NIN (opcional) |
| Endereço | Rua, Cidade/UF | Street, City, State, ZIP | Street, City, Postal Code | Street, City, Postcode |
| Telefone | +55 | +1 | +XX | +44 |

#### Dados da Conexão (para relatório)

| Campo | Descrição | Exemplo |
|-------|-----------|---------|
| Operadora | Nome do provedor | Vivo / Comcast / BT / Orange |
| Plano | Nome do plano contratado | Fibra 300 Mbps |
| Velocidade | Mbps contratados | 300 |
| Tipo | Fibra, Cabo, DSL, etc. | Fibra Óptica |
| Número do contrato | Identificador do serviço | Opcional |

**Funcionalidades:**
- Seleção de país altera campos e validações
- Validação de documentos por país (CPF, etc.)
- Persistência no SQLite
- Restaurar valores padrão
- Campos opcionais não bloqueiam uso do app

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

  "region": {
    "country_code": "BR",
    "country_name": "Brasil",
    "regulatory_body": "ANATEL",
    "consumer_protection": "PROCON",
    "applicable_law": "Código de Defesa do Consumidor, Marco Civil da Internet"
  },

  "user_info": {
    "name": "João da Silva",
    "document_type": "CPF",
    "document_number": "123.456.789-00",
    "phone": "+55 11 99999-9999",
    "address": {
      "street": "Rua Example, 123",
      "neighborhood": "Bairro",
      "city": "São Paulo",
      "state": "SP",
      "postal_code": "01234-567",
      "country": "Brasil"
    },
    "coordinates": {
      "latitude": -23.5505,
      "longitude": -46.6333,
      "accuracy_meters": 10
    }
  },

  "connection_info": {
    "provider": "Operadora XYZ",
    "plan": "Fibra 300 Mbps",
    "contract_speed_mbps": 300,
    "contract_number": "123456789",
    "public_ip": "189.45.123.67",
    "ip_collected_at": "2025-12-10T10:00:00Z",
    "connection_type": "Fiber"
  },

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
      "duration_minutes": 5.2,
      "public_ip_before": "189.45.123.67",
      "public_ip_after": "189.45.124.12"
    }
  ],

  "hourly_summary": [
    {"hour": "2025-12-10T00:00:00Z", "avg_latency": 42.1, "success_rate": 100},
    {"hour": "2025-12-10T01:00:00Z", "avg_latency": 38.5, "success_rate": 98.3}
  ]
}
```

### Dados do Usuário e Conexão

#### Informações Coletadas

| Dado | Origem | Obrigatório |
|------|--------|-------------|
| Nome completo | Input do usuário | Sim |
| CPF/Documento | Input do usuário | Sim |
| Endereço | Input do usuário | Sim |
| Coordenadas GPS | Geolocation API (todas plataformas) | Não |
| Nome da operadora | Input do usuário | Sim |
| Plano contratado | Input do usuário | Sim |
| Velocidade contratada | Input do usuário | Sim |
| IP público | API externa (ipify.org) | Automático |

#### Coleta de IP Público

O app consulta periodicamente o IP público para:
- Registrar mudanças de IP (útil para identificar reconexões)
- Documentar o IP no momento de cada queda
- Provar que a conexão é do endereço declarado

**API sugerida:**
```typescript
// Gratuita, sem limite, HTTPS
const response = await fetch('https://api.ipify.org?format=json');
const { ip } = await response.json();
```

#### Geolocalização (Todas as Plataformas)

Solicitar permissão de localização para:
- Confirmar que o monitoramento é do endereço declarado
- Adicionar coordenadas GPS ao relatório (prova técnica)

| Plataforma | API | Notas |
|------------|-----|-------|
| Android/iOS | `@capacitor/geolocation` | Plugin nativo |
| Desktop | `navigator.geolocation` | Web API funciona no WebView |

```typescript
// Funciona em TODAS as plataformas (Web Geolocation API)
navigator.geolocation.getCurrentPosition(
  (position) => {
    const { latitude, longitude, accuracy } = position.coords;
  },
  (error) => console.error(error),
  { enableHighAccuracy: true }
);

// Ou com Capacitor (mobile-first, mas funciona em web)
import { Geolocation } from '@capacitor/geolocation';
const position = await Geolocation.getCurrentPosition();
```

> **Nota:** No desktop, a precisão depende do Wi-Fi/IP. Em mobile, usa GPS real.

### Fluxo do Usuário

1. Abre aba Relatórios
2. Clica em "Exportar para IA"
3. App gera 2 arquivos para download:
   - `netmonitor_dados.json` (dados de monitoramento)
   - `netmonitor_prompt.txt` (prompt + instruções)
4. Usuário acessa ChatGPT/Claude/Gemini
5. Anexa o arquivo JSON
6. Cola o prompt
7. IA gera relatório completo com gráficos e documentos

### Arquivos Exportados

#### 1. `netmonitor_dados.json`
Contém todos os dados de monitoramento em formato JSON (estrutura mostrada acima).

#### 2. `netmonitor_prompt.txt`
Contém as instruções e o prompt para a IA:

```
═══════════════════════════════════════════════════════════════
              NETMONITOR - EXPORTAÇÃO PARA IA
═══════════════════════════════════════════════════════════════

COMO USAR:

1. Acesse um chatbot de IA:
   • ChatGPT Plus: https://chat.openai.com (GPT-4 recomendado)
   • Claude Pro: https://claude.ai
   • Gemini Advanced: https://gemini.google.com

2. Inicie uma nova conversa

3. ANEXE o arquivo "netmonitor_dados.json"

4. COLE o prompt abaixo e envie:

═══════════════════════════════════════════════════════════════
                         PROMPT
═══════════════════════════════════════════════════════════════

You are an expert in telecommunications and consumer rights.

Analyze the internet connection monitoring data in the attached
JSON file. Note the "region" field to determine applicable laws
and regulatory bodies.

Generate:

1. **Technical Report** with charts:
   - Line chart: latency over time
   - Bar chart: outages per day
   - Statistical summary

2. **SLA Analysis**:
   - Compare against acceptable standards (99.5% uptime, <100ms)
   - Identify quality violations
   - Calculate total downtime

3. **Complaint Documents** (if issues found):

   FOR BRAZIL (BR):
   - Texto para reclamação no PROCON
   - Texto para reclamação na ANATEL
   - Notificação extrajudicial

   FOR USA (US):
   - FCC complaint text
   - State Attorney General complaint
   - Demand letter to provider

   FOR EU:
   - National Telecom Authority complaint
   - Consumer protection complaint (per country)
   - GDPR data request (if applicable)

   FOR UK (GB):
   - Ofcom complaint text
   - Ombudsman Services complaint
   - Letter before action

Use the user and connection data in the file to personalize
all generated documents. Write documents in the user's language
based on their country.

═══════════════════════════════════════════════════════════════
```

---

### Fase 4: Monetização com AdMob

**Objetivo:** Gerar receita com anúncios não-intrusivos, apenas no mobile (Android/iOS).

#### Tecnologia

| Plataforma | Plugin | Versão |
|------------|--------|--------|
| Capacitor | `@capacitor-community/admob` | 6.x |

#### Instalação

```bash
npm install @capacitor-community/admob
npx cap sync
```

#### Tipos de Anúncio

| Tipo | Localização | Comportamento | Gatilho |
|------|-------------|---------------|---------|
| **Banner** | Camada superior à barra inferior | Aparece/some em ciclos | Automático durante uso |
| **Rewarded Video** | Tela cheia | Usuário assiste até o fim | Ao exportar relatório |

#### Banner Rotativo

O banner aparece numa camada flutuante acima da tab bar, com animação de fade in/out:

```typescript
import { AdMob, BannerAdSize, BannerAdPosition } from '@capacitor-community/admob';

// Configuração
const BANNER_INTERVAL = 60000;  // 60s visível
const BANNER_PAUSE = 120000;    // 120s oculto

async function initBannerRotation() {
  await AdMob.initialize();

  const options = {
    adId: 'ca-app-pub-XXXXXX/YYYYYY', // Seu Ad Unit ID
    adSize: BannerAdSize.ADAPTIVE_BANNER,
    position: BannerAdPosition.BOTTOM_CENTER,
    margin: 56, // Altura da tab bar em dp
  };

  // Ciclo: mostrar → esconder → mostrar...
  setInterval(async () => {
    await AdMob.showBanner(options);

    setTimeout(async () => {
      await AdMob.hideBanner();
    }, BANNER_INTERVAL);

  }, BANNER_INTERVAL + BANNER_PAUSE);
}
```

**Comportamento:**
- Banner fica visível por 60 segundos
- Desaparece por 120 segundos
- Ciclo se repete enquanto app está em primeiro plano
- Animação suave de fade para não irritar o usuário

#### Vídeo Recompensado (Rewarded Ad)

O usuário deve assistir um vídeo completo para desbloquear a exportação do relatório:

```typescript
import { AdMob, RewardAdPluginEvents } from '@capacitor-community/admob';

async function showRewardedAdForExport(): Promise<boolean> {
  return new Promise(async (resolve) => {
    // Listener para recompensa
    AdMob.addListener(RewardAdPluginEvents.Rewarded, () => {
      resolve(true); // Usuário completou o vídeo
    });

    // Listener para fechamento sem completar
    AdMob.addListener(RewardAdPluginEvents.Dismissed, () => {
      resolve(false); // Usuário pulou/fechou
    });

    // Carregar e mostrar
    await AdMob.prepareRewardVideoAd({
      adId: 'ca-app-pub-XXXXXX/ZZZZZZ', // Rewarded Ad Unit ID
    });

    await AdMob.showRewardVideoAd();
  });
}

// Uso no fluxo de exportação
async function exportReport() {
  const adWatched = await showRewardedAdForExport();

  if (adWatched) {
    // Gerar e baixar os arquivos JSON + TXT
    generateExportFiles();
  } else {
    // Mostrar mensagem explicando que precisa assistir o vídeo
    showToast('Assista o vídeo completo para exportar o relatório');
  }
}
```

#### Fluxo de Exportação com Ad

```
┌─────────────────────────────────────────────────────────┐
│                    Aba Relatórios                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│   📊 Estatísticas do Período                           │
│   ─────────────────────────                            │
│   Total de pings: 15.234                               │
│   Uptime: 98.38%                                       │
│   Latência média: 45ms                                 │
│                                                         │
│   ┌─────────────────────────────────────────────────┐  │
│   │         🎬 Exportar para IA                     │  │
│   │                                                 │  │
│   │   Assista um breve vídeo para desbloquear      │  │
│   │   a exportação dos dados de monitoramento.     │  │
│   │                                                 │  │
│   │            [ Assistir e Exportar ]              │  │
│   └─────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

#### Considerações

| Aspecto | Decisão |
|---------|---------|
| Desktop (Tauri) | Sem ads - AdMob não suporta desktop |
| Frequência do banner | Balanceada para não irritar (1min on / 2min off) |
| Fallback offline | Se sem internet, permitir exportação sem ad |
| Teste | Usar IDs de teste do AdMob durante desenvolvimento |

#### IDs de Teste (Desenvolvimento)

```typescript
// Android
const TEST_BANNER_ID = 'ca-app-pub-3940256099942544/6300978111';
const TEST_REWARDED_ID = 'ca-app-pub-3940256099942544/5224354917';

// iOS
const TEST_BANNER_ID_IOS = 'ca-app-pub-3940256099942544/2934735716';
const TEST_REWARDED_ID_IOS = 'ca-app-pub-3940256099942544/1712485313';
```

---

### Fase 5: Melhorias de UX

#### Cartão de Uptime
Na tela principal, exibir há quanto tempo o app está monitorando:
```
Monitorando há: 2h 34m 12s
```

> **Nota:** O app só monitora enquanto está em primeiro plano (tela ativa).
> Não há serviço em background nem notificações push.

---

### Fase 6: Futuro (Opcional)

- Widget de status para home screen
- Histórico visual simples de quedas

---

---

## Privacidade e Dados

**O NetMonitor NÃO coleta, transmite ou utiliza seus dados de nenhuma forma.**

| Aspecto | Garantia |
|---------|----------|
| Armazenamento | 100% local no dispositivo do usuário |
| Transmissão | Nenhum dado é enviado para servidores externos |
| Telemetria | Zero. Não há analytics ou rastreamento próprio |
| Uso pelo App | Os dados existem apenas para consulta e exportação pelo usuário |

Os dados pessoais (nome, CPF, endereço) e de monitoramento ficam **exclusivamente** no SQLite local do dispositivo. O único momento em que saem do dispositivo é quando o **próprio usuário** escolhe exportar os arquivos para usar em um chatbot de IA.

> **Nota:** A consulta ao IP público (ipify.org) é a única requisição externa feita pelo app, e serve apenas para registrar o IP no relatório. Nenhum dado pessoal é enviado nessa consulta.

#### Sobre os Anúncios (Mobile)

O app mobile utiliza Google AdMob para exibição de anúncios. O AdMob pode coletar dados de acordo com sua própria política de privacidade do Google. **Importante:**

- O NetMonitor **não compartilha** dados pessoais do usuário com o AdMob
- O AdMob coleta apenas dados padrão de dispositivo/uso para personalização de anúncios
- A versão desktop (Tauri) **não contém anúncios**

---

## Documentação Pública

O tutorial de uso com IA e o prompt serão publicados no repositório:

| Arquivo | Idioma | Conteúdo |
|---------|--------|----------|
| `docs/AI-EXPORT-GUIDE.md` | 🇬🇧 English | Guide for US, EU, UK users |
| `docs/AI-EXPORT-GUIDE.pt-BR.md` | 🇧🇷 Português | Guia para usuários brasileiros |

O app exporta o tutorial no idioma correspondente ao país selecionado:
- **Brasil** → Português brasileiro
- **EUA, UE, UK** → Inglês

Isso permite que usuários consultem as instruções sem precisar exportar dados primeiro.

---

## Referências

### Técnicas
- [Tauri SQL Plugin](https://v2.tauri.app/plugin/sql/)
- [Capacitor SQLite](https://github.com/capacitor-community/sqlite)
- [Capacitor AdMob](https://github.com/capacitor-community/admob)

### Legislação por Região

**Brasil:**
- [ANATEL - Regulamentos](https://www.anatel.gov.br)
- [Código de Defesa do Consumidor](http://www.planalto.gov.br/ccivil_03/leis/l8078compilado.htm)

**Estados Unidos:**
- [FCC Consumer Complaints](https://consumercomplaints.fcc.gov)
- [FCC Rules on Internet Service](https://www.fcc.gov/consumers/guides)

**União Europeia:**
- [EECC - European Electronic Communications Code](https://digital-strategy.ec.europa.eu/en/policies/connectivity)
- [BEREC - Consumer Rights](https://www.berec.europa.eu)

**Reino Unido:**
- [Ofcom - Complaints](https://www.ofcom.org.uk/complaints)
- [Communications Act 2003](https://www.legislation.gov.uk/ukpga/2003/21)
