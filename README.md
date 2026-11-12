## Como colocar a funcionar:
# Terminal 1 - servidor
node --watch server.js

# Terminal 2 - React
cd client
npm run dev

Pergunta 3:
Quem bloqueou o pedido foi o browser, devido à política CORS. O servidor recebeu o pedido, mas não enviou o cabeçalho necessário para permitir o acesso. Isto pode ser confirmado no terminal do servidor e na consola do browser.
