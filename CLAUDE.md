# CLAUDE.md - Notas para o Agente de Desenvolvimento

## Ionic Angular - IMPORTANTE

### Nunca misturar Standalone e Modules

O Ionic Angular possui duas abordagens de build que **NÃO PODEM ser usadas ao mesmo tempo**:

1. **Modules** - usa `IonicModule.forRoot()` e imports de `@ionic/angular`
2. **Standalone** - usa imports individuais de `@ionic/angular/standalone`

**Regra:** Se o projeto usa `IonicModule.forRoot()` no `app.module.ts`, todos os componentes devem importar `IonicModule` de `@ionic/angular`, e **NUNCA** de `@ionic/angular/standalone`.

**Exemplo ERRADO (causa quebra do CSS no dev server):**
```typescript
// app.module.ts usa IonicModule.forRoot()
// MAS app.component.ts importa de standalone:
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone'; // ERRADO!
```

**Exemplo CORRETO:**
```typescript
// app.module.ts usa IonicModule.forRoot()
// app.component.ts também usa IonicModule:
import { IonicModule } from '@ionic/angular'; // CORRETO!
```

**Sintoma do problema:** O app funciona quando compilado para produção (AppImage), mas no dev server (`npm run tauri dev`) o CSS/design fica completamente quebrado, mostrando apenas dados crus sem estilização.

**Fonte:** https://ionicframework.com/docs/angular/build-options

## Tauri + Mold Linker

O projeto usa `mold` como linker para acelerar compilações Rust. Configuração em `.cargo/config.toml`:

```toml
[build]
jobs = 28

[target.x86_64-unknown-linux-gnu]
rustflags = ["-C", "link-arg=-fuse-ld=mold"]
```

**Nota:** Após `cargo clean`, a primeira compilação demora ~2-5 minutos pois recompila todas as dependências. Compilações subsequentes são rápidas (~10-40 segundos).

## Estrutura do Projeto

- `netmonitor/` - Código Angular/Ionic
- `netmonitor/src-tauri/` - Código Rust/Tauri
- `docs/` - Documentação e stories
