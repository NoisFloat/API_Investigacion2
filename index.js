const express = require('express');
const app = express();
const bdCarreras = require('./datos/bdCarreras.json');
const bdInscripciones = require('./datos/bdInscripciones.json');
const fs = require('fs');


app.get('/', (req, res) => {
  res.status(200).send("Hola Mundo");
  res.send()

});

app.get('/API/carreras', (req, res) => {
  res.status(200).send(bdCarreras);
});

app.get('/API/inscripciones', (req, res) => {
  res.status(200).send(bdInscripciones);
});

//● Deberá haber una ruta para consulta de prerrequisitos de una materia por código.

//Para el tecnico
app.get('/API/carreras/tecnico/materia/prerrequisitos/:codigoM', (req, res) => {
  const codigoM = req.params.codigoM; 
  console.log(codigoM);

  const tecnico = bdCarreras.carreras.find(carrera => carrera.nombre === "Técnico en Ingeniería en Computación");
  const materia = tecnico.materias.find(materia => materia.codigo === codigoM);
  // Devuelve los prerrequisitos de la materia en formato JSON
  res.json(materia.prerrequisitos);
});


//Para el tecnico
app.get('/API/carreras/ingenieria/materia/prerrequisitos/:codigoM', (req, res) => {
  const codigoM = req.params.codigoM; 
  console.log(codigoM);

  const tecnico = bdCarreras.carreras.find(carrera => carrera.nombre === "Ingeniería en Ciencias de la Computación");
  const materia = tecnico.materias.find(materia => materia.codigo === codigoM);
  // Devuelve los prerrequisitos de la materia en formato JSON
  res.json(materia.prerrequisitos);
});
// FIN Deberá haber una ruta para consulta de prerrequisitos de una materia por código.





//● Deberá crear un ruta para consulta de materias por ciclo.

//Busca materias del ciclo espeficicado siendo del tecnico
app.get('/API/carreras/tecnico/ciclo/:nCiclo', (req, res) => {
  const nCiclo = parseInt(req.params.nCiclo); 

  const tecnico = bdCarreras.carreras.find(carrera => carrera.nombre === "Técnico en Ingeniería en Computación");

  const materiasCiclo = tecnico.materias.filter(materia => materia.ciclo === nCiclo);

  // Envía las materias como respuesta en formato JSON
  res.json(materiasCiclo);
});

//Busca materias del ciclo espeficicado siendo de la ingenieria
app.get('/API/carreras/ingenieria/ciclo/:nCiclo', (req, res) => {
  const nCiclo = parseInt(req.params.nCiclo); 
  const tecnico = bdCarreras.carreras.find(carrera => carrera.nombre === "Ingeniería en Ciencias de la Computación");
  const materiasCiclo = tecnico.materias.filter(materia => materia.ciclo === nCiclo);

  // Envía las materias como respuesta en formato JSON
  res.json(materiasCiclo);
});
//●FIN Deberá crear un ruta para consulta de materias por ciclo.






//Inscripcion de materias
// Ruta para inscribir materias
app.post('/inscripciones/:carrera', (req, res) => {
  const carrera = req.params.carrera;
  const { materias } = req.body;

  if (!carrera || !materias) {
    res.status(400).json({ error: 'Faltan datos necesarios.' });
    return;
  }

  if (materias.length !== 4) {
    res.status(400).json({ error: 'Debes inscribir exactamente 4 materias.' });
    return;
  }

  const materiasDisponibles = obtenerMaterias();

  if (!materiasDisponibles[carrera]) {
    res.status(404).json({ error: 'La carrera seleccionada no existe.' });
    return;
  }

  const materiasNoEncontradas = materias.filter((materia) => !materiasDisponibles[carrera].includes(materia));

  if (materiasNoEncontradas.length > 0) {
    res.status(400).json({ error: `Las siguientes materias no existen: ${materiasNoEncontradas.join(', ')}` });
    return;
  }

  const inscripciones = obtenerInscripciones();
  inscripciones[carrera] = materias;
  guardarInscripciones(inscripciones);

  res.status(200).json({ message: 'Inscripción exitosa.' });
});

app.listen(PORT, () => {
  console.log(`Servidor Express en funcionamiento en el puerto ${PORT}`);
});

function obtenerMaterias() {
  const data = fs.readFileSync('materias.json', 'utf8');
  return JSON.parse(data);
}

function obtenerInscripciones() {
  try {
    const data = fs.readFileSync('./datos/bdInscripciones.json', 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return {};
  }
}

function guardarInscripciones(inscripciones) {
  fs.writeFileSync('inscripciones.json', JSON.stringify(inscripciones, null, 2));
}

const puerto = 3000;
app.listen(puerto, () => {
  console.log("El servidor de la API está funcionando en el puerto " + puerto);
});
