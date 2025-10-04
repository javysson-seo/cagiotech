# 📱 CagioTech - Configuração Mobile (iOS & Android)

## 🎯 Visão Geral

O aplicativo mobile CagioTech está configurado para **apenas Alunos e Personal Trainers**.

### ✅ Acesso Permitido no App Mobile
- 👤 **Alunos (Students)**
- 💪 **Personal Trainers**

### ❌ Acesso Apenas pelo Navegador Web
- 🏢 **Empresas/BOX Owners**
- 🛡️ **Administradores Cagio**
- 👔 **Staff/Funcionários**

## 🚀 Como Testar no Dispositivo/Emulador

### Passo 1: Exportar para Github
1. Clique no botão **"Export to Github"** no Lovable
2. Faça `git pull` do projeto no seu computador

### Passo 2: Instalar Dependências
```bash
npm install
```

### Passo 3: Adicionar Plataformas
Escolha iOS, Android ou ambos:

```bash
# Para iOS (requer Mac + Xcode)
npx cap add ios

# Para Android (requer Android Studio)
npx cap add android
```

### Passo 4: Atualizar Plataformas
```bash
# Para iOS
npx cap update ios

# Para Android
npx cap update android
```

### Passo 5: Build do Projeto
```bash
npm run build
```

### Passo 6: Sincronizar com Capacitor
```bash
npx cap sync
```

### Passo 7: Executar no Dispositivo
```bash
# Android
npx cap run android

# iOS (apenas Mac)
npx cap run ios
```

## 📝 Requisitos do Sistema

### Para iOS:
- Mac com Xcode instalado
- Conta Apple Developer (para dispositivos físicos)
- iOS 13.0 ou superior

### Para Android:
- Android Studio instalado
- SDK Android configurado
- Android 5.0 (API 21) ou superior

## 🔄 Após Mudanças no Código

Sempre que fizer `git pull` com novas alterações:

```bash
npm install          # Se houver novas dependências
npm run build       # Gerar novo build
npx cap sync        # Sincronizar com plataformas nativas
```

## 🎨 Configuração Atual

O aplicativo está configurado com:

- **App ID**: `app.lovable.e15d0864240b4aa494a5dda8699cde5b`
- **Nome**: `CagioTech`
- **Hot Reload**: Ativado (desenvolvimento)
- **URL Dev**: `https://e15d0864-240b-4aa4-94a5-dda8699cde5b.lovableproject.com`

## 🛡️ Segurança e Restrições

O aplicativo implementa verificações automáticas:

1. **Detecção de Plataforma**: Identifica se está rodando como app nativo
2. **Bloqueio de Acesso**: Usuários empresariais veem mensagem de redirecionamento
3. **UI Adaptativa**: Interface mostra avisos no modal de login

## 📚 Recursos Adicionais

- [Documentação Capacitor](https://capacitorjs.com/docs)
- [Blog Lovable - Mobile Development](https://lovable.dev/blogs/TODO)

## 🐛 Troubleshooting

### Erro ao sincronizar
```bash
# Limpar e reinstalar
rm -rf node_modules
npm install
npx cap sync
```

### Erro no iOS
- Verificar certificados no Xcode
- Garantir que o Team está configurado

### Erro no Android
- Verificar Android SDK instalado
- Garantir que ANDROID_HOME está configurado

## 📞 Suporte

Para problemas ou dúvidas, consulte:
- Documentação oficial do Capacitor
- Blog do Lovable
- Github Issues do projeto
