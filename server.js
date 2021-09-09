// load the things we need
var express = require('express');
var app = express();
var fechas = []
var valoresV = []
var informacion = []
// set the view engine to ejs
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// pagina principal 
app.get('/', function (req, res) {
    res.render('pages/index', {
        id: req.query.id || "",
        log: ""
    });
});


// pagina del cálculo
app.post('/calculadora', (req, res) => {
    //Variables
    var id = req.body.id;
    var numero = parseFloat(req.body.numero);
    var accion = req.body.accion
    var horaActual = new Date()
    var operaciones = "";
    var fecha = fechas[id]
    fechas[id] = horaActual
    var valor = valoresV[id]

    informacion.push({ id, accion, numero, horaActual })

    if (isNaN(valor)) {
        valor = 0;
    }

    switch (accion) {
        case "+":
            valor += numero;
            break;

        case "-":
            valor -= numero;
            break;

        case "*":
            valor *= numero;
            break;

        case "/":
            valor /= numero;
            break;

        case "Resetear":
            limpiarRegistros(id)
            res.render('pages/index', {
                id,
                log: "Reseteados valores para id: " + id
            });
            return;
    }

    valoresV[id] = valor

    for (i = 0; i < informacion.length; i++) {
        if (informacion[i].id == id) {
            operaciones += " " + informacion[i].accion + " " + informacion[i].numero;
        }
    }

    res.render('pages/calculadora', {
        accion,
        numero,
        id,
        valor,
        operaciones,
        fecha,
        horaActual
    });
})


function limpiarRegistros(id) {
    fechas.splice(id, 1)
    valoresV.splice(id, 1)

    informacion = informacion.filter(i => {
        i.id != id
    })
}

function tiempoMinuto() {
    var minutoActual = new Date().getTime()

    const registros = informacion.find( i => 
        (minutoActual - i.horaActual.getTime()) >= 60000
    )

    for( i in registros ){
        limpiarRegistros(i.id)
    }

}


// pagina about
app.get('/about', function (req, res) {
    res.render('pages/about');
});


app.listen(443, () => {
    console.log('443 is the magic port');
    setInterval(tiempoMinuto, 1000);
});


