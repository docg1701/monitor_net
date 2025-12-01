# Arquivo: brief.md

## 1. Visão Geral do Projeto
**Nome do Projeto:** NetMonitor Desktop (Modernização)
**Objetivo:** Converter uma ferramenta CLI de monitoramento de rede existente (baseada em `plotext`/`curses`) em uma aplicação Desktop GUI nativa, moderna e visualmente polida, mantendo a lógica de backend em Python mas renderizando a interface via tecnologias Web.
**Driver Principal:** "Zero Hallucination Stack" — O uso de tecnologias amplamente documentadas e estáveis para garantir que Modelos de Linguagem (LLMs) possam gerar o código completo sem erros de dependência ou sintaxe.

## 2. Tech Stack Selecionada (LLM-Optimized)
Esta stack foi escolhida por sua alta representatividade nos datasets de treinamento de LLMs, garantindo geração de código precisa.

### 2.1 Backend (Lógica & OS)
* **Linguagem:** **Python 3.10+** (Padrão de mercado, tipagem forte recomendada).
* **Bridge (Middleware):** **Eel** (Versão mais recente estável).
    * *Justificativa:* Biblioteca minimalista que expõe funções Python para JS e vice-versa. Ao contrário do Electron, não exige Node.js no ambiente final, facilitando o empacotamento.
* **Monitoramento:** **Subprocess** (Nativo do Python).
    * *Reuso:* A lógica de `ping` do script atual `monitor_net.py` deve ser preservada e adaptada.

### 2.2 Frontend (Interface)
* **Estrutura:** **HTML5** Semântico.
* **Estilização:** **CSS3 Vanilla** (Sem Tailwind/Bootstrap).
    * *Justificativa:* LLMs são excelentes em gerar CSS puro para layouts Flexbox/Grid modernos. Frameworks exigem configuração extra que aumenta a chance de erro em scripts "single-shot".
* **Lógica de UI:** **JavaScript (ES6+) Vanilla**.
* **Visualização de Dados:** **Chart.js** (Versão 3.x ou 4.x).
    * *Justificativa:* A biblioteca de gráficos mais comum na web. O modelo conhece a API de cor. Deve ser carregada localmente (baixada na pasta `web/`) para que o app funcione offline.

### 2.3 Empacotamento & Distribuição
* **Ferramenta:** **PyInstaller**.
* **Formato:** Single Executable (`.exe` no Windows, Binário no Linux/Mac).
* **Flag Crítica:** `--noconsole` (para esconder o terminal) e `--add-data` (para incluir a pasta `web/` dentro do binário).

## 3. Requisitos Técnicos para Migração

### 3.1 Refatoração do Backend (`monitor_net.py` -> `app.py`)
O modelo deve ser instruído a realizar as seguintes transformações na lógica existente:
1.  **Remoção de TUI:** Eliminar todas as dependências de `curses`, `plotext`, `termios` e prints de console (`sys.stdout`).
2.  **Ciclo de Vida:** Substituir o loop `while True` bloqueante por:
    * Uma *Eel exposed function* `start_monitoring(host)` que inicia uma **Greenlet** (via gevent, nativo do Eel) ou uma **Thread** separada para não congelar a GUI.
    * O loop de ping deve rodar nesta thread e, a cada iteração, chamar `eel.update_stats(data)` (função JS) em vez de imprimir na tela.
3.  **Lógica de Ping:** Manter a detecção de OS (`platform.system()`) e os comandos de ping específicos (Windows vs Linux) já implementados no script original.

### 3.2 Especificações de Interface (UI/UX)
Para atingir o visual "Modern CLI" (estilo Vercel/Claude/Gemini):
* **Tema:** Dark Mode obrigatório (`background: #0d0d0d`, texto: `#ededed`).
* **Tipografia:** Fontes Monospace para dados (ex: `Roboto Mono`, `Fira Code` ou `Consolas`).
* **Layout:**
    * **Header:** Input de Host minimalista (sem bordas, apenas underline) e botão de ação (Start/Stop).
    * **Main:** Canvas do Chart.js ocupando 60% da altura.
    * **Footer:** Grid de estatísticas (Ping Atual, Média, Jitter, Packet Loss).
* **Feedback Visual:** O gráfico deve ter animação suave ("smooth transition") desativada para updates rápidos ou configurada para performance.

### 3.3 Intercâmbio de Dados (JSON Schema)
O Python enviará dados para o Frontend no seguinte formato JSON (padronizado para evitar erros de parsing no JS):

```json
{
  "timestamp": "HH:MM:SS",
  "latency": 45.5,          // Float ou null (para timeout)
  "is_timeout": false,
  "stats": {
    "min": 40.1,
    "max": 150.2,
    "avg": 55.0,
    "loss_percent": 0.5
  }
}
```

## 4. Instruções para o PRD (Para o Modelo)
Ao gerar o PRD, o modelo deve detalhar:
1.  **Estrutura de Pastas:**
    ```text
    /
    ├── app.py              # Entry point (antigo monitor_net.py refatorado)
    ├── web/
    │   ├── index.html
    │   ├── style.css
    │   ├── script.js
    │   └── chart.min.js    # Lib local
    └── monitor_config.ini  # Configuração (opcional, legado)
    ```
2.  **Tratamento de Erros:** Como a GUI deve reagir se o Python lançar uma exceção de "Permissão Negada" no ping (comum em alguns Linux) ou "Host não encontrado". O erro deve aparecer como um "Toast" (notificação flutuante) na interface HTML.
3.  **Cross-Platform quirks:** Instruções específicas para o PyInstaller lidar com os caminhos de arquivos estáticos (`web/`) que mudam quando se roda o `.exe` (uso de `sys._MEIPASS`).

## 5. Critérios de Sucesso (DoR - Definition of Ready)
O código gerado será considerado pronto se:
1.  Rodar com um único comando (`python app.py`).
2.  Abrir uma janela nativa (Chrome/Edge view) sem barra de endereços.
3.  O gráfico atualizar em tempo real sem piscar a tela.
4.  O botão "Stop" interromper a thread de ping imediatamente.
