const functions = require('firebase-functions');

const admin = require('firebase-admin');
// insere  o parametro do texto passado ao terminal HTTP 
// no Real Database pelo caminho:/messages/:pushId/original

exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Responsavel por pegar o parametro do texto.
    
    const original = req.query.text;
    // Leva a mensagem até o Realtime Database usando o Firebase Admin SDK.
    
    const snapshot = await admin.database().ref('/messages').push({ original: original });
    // Redireciona com 303 'veja outros' para a URL do objeto levado ao Firebase console.
    res.redirect(303, snapshot.ref.toString());
});
admin.initializeApp();

// Escuta novas mensagem adicionadas ao /messages/:pushId/original e cria uma 
//versão em caixa alta da mensagem para /messages/:pushId/uppercase

exports.makeUppercase = functions.database.ref('/messages/{pushId}/original')
    .onCreate((snapshot, context) => {
        // Pega o valor atual do que já foi escrito no Realtime Database.
        const original = snapshot.val();
        console.log('Uppercasing', context.params.pushId, original);
       
        const uppercase = original.toUpperCase();
        // Você deve retornar uma Promise quando estiver excutando uma tarefa assíncrona dentro de funções como:
        // escrevendo ao Firebase Realtime Database.
        // Setting um "uppercase" irmão no Realtime Database retorna uma Promise.
        return snapshot.ref.parent.child('uppercase').set(uppercase);
    });
        // função responsavel por deletar coleções no do firestore
    exports.deleteDocument = functions.https.onRequest(async (req) => {
        const docId = req.query.docId;
        const colId = req.query.colId;
         
        //  acessa o banco de dados do firestore   
        var db = admin.firestore();
           
        // acessa as coleções e as deleta
        db.collection(colId).doc(docId).delete().then(() => {
            console.log("Documento deletado");
        }).catch((erro) => {
            var error = erro;
            console.log(error);
        })
    })




