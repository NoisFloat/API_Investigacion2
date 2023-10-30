const express = require('express');
const app = express();
const bdCarreras = require('./datos/bdCarreras.json');
const bdInscripciones = require('./datos/bdInscripciones.json');
const fs = require('fs');

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send("Hola Mundo");
});

app.get('/API/carreras', (req, res) => {
  res.status(200).json(bdCarreras);
});

app.get('/API/inscripciones', (req, res) => {
  res.status(200).json(bdInscripciones);
});

app.get('/API/carreras/tecnico/materia/prerrequisitos/:codigoM', (req, res) => {
  const codigoM = req.params.codigoM;
  const tecnico = bdCarreras.carreras.find(carrera => carrera.nombre === "Técnico en Ingeniería en Computación");
  const materia = tecnico.materias.find(materia => materia.codigo === codigoM);
  if (materia) {
    res.json(materia.prerrequisitos);
  } else {
    res.status(404).json({ error: 'Materia no encontrada' });
  }
});

app.get('/API/carreras/ingenieria/materia/prerrequisitos/:codigoM', (req, res) => {
  const codigoM = req.params.codigoM;
  const ingenieria = bdCarreras.carreras.find(carrera => carrera.nombre === "Ingeniería en Ciencias de la Computación");
  const materia = ingenieria.materias.find(materia => materia.codigo === codigoM);
  if (materia) {
    res.json(materia.prerrequisitos);
  } else {
    res.status(404).json({ error: 'Materia no encontrada' });
  }
});

app.get('/API/carreras/tecnico/ciclo/:nCiclo', (req, res) => {
  const nCiclo = parseInt(req.params.nCiclo);
  const tecnico = bdCarreras.carreras.find(carrera => carrera.nombre === "Técnico en Ingeniería en Computación");
  const materiasCiclo = tecnico.materias.filter(materia => materia.ciclo === nCiclo);
  res.json(materiasCiclo);
});

app.get('/API/carreras/ingenieria/ciclo/:nCiclo', (req, res) => {
  const nCiclo = parseInt(req.params.nCiclo);
  const ingenieria = bdCarreras.carreras.find(carrera => carrera.nombre === "Ingeniería en Ciencias de la Computación");
  const materiasCiclo = ingenieria.materias.filter(materia => materia.ciclo === nCiclo);
  res.json(materiasCiclo);
});

//
app.post('/inscribir', (req, res) => {
    try {
      // Verificar si el archivo JSON de inscripciones existe
      const filePath = './datos/bdInscripciones.json';
      let inscripciones = [];
  
      if (fs.existsSync(filePath)) {
        // Leer el contenido del archivo si existe
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        // Intenta parsear el contenido como JSON
        inscripciones = JSON.parse(fileContent);
  
        // Verifica si el resultado es un array, y si no, inicializa un nuevo array vacío
        if (!Array.isArray(inscripciones)) {
          inscripciones = [];
        }
      }
  
      // Obtener los datos de la inscripción del cuerpo de la solicitud
      const inscripcion = req.body;
       console.log(inscripcion)
      // Asigna un ID único a la inscripción
      inscripcion.id = inscripciones.length + 1;
  
      // Agregar la inscripción al arreglo de inscripciones
      inscripciones.push(inscripcion);
  
      // Escribir el archivo JSON de inscripciones
      fs.writeFileSync(filePath, JSON.stringify(inscripciones, null, 2));
      res.status(201).json({ message: 'Inscripción exitosa', id: inscripcion.id });
    } catch (error) {
      console.error('Error al escribir el archivo de inscripciones:', error);
      res.status(500).json({ error: 'Error al guardar la inscripción' });
    }
  });
  
  
  
  
  
  
  
//

const puerto = 3000;
app.listen(puerto, () => {
  console.log("El servidor de la API está funcionando en el puerto " + puerto);
});


