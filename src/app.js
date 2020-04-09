const express = require("express");
const cors = require("cors");

const { uuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

// verify if repositorie exist and return the existing repositorie index
function checkIfExist(id, response) {
  const repIndex = repositories.findIndex(rep => rep.id === id);
  if(repIndex < 0){
    return response.status(400).json({
      error: "Repositorie not found"
    });
  };

  return repIndex;
}

app.get("/repositories", (request, response) => {
  
  // return array of repositories
  return response.json(repositories);

});

app.post("/repositories", (request, response) => {

  // get body data
  const {title, url, techs} = request.body;

  // create new repositorie object with body data
  const newRep = {
    id: uuid(),
    title,
    url: url ? url : `http://github.com/${title}`,
    techs,
    likes: 0
  };

  // push into repositories array
  repositories.push(newRep);

  // return new repositorie data
  return response.json(newRep);
});

app.put("/repositories/:id", (request, response) => {
  // get id param
  const {id} = request.params;

  // get body data
  const {title, url, techs} = request.body;

  // verify if exist and get Index
  const repIndex = checkIfExist(id, response);

  // get oldState repositorie
  const oldRep = repositories[repIndex];
  const {title: oldTitle, url: oldUrl, techs: oldTechs, likes} = oldRep;

  //update repositorie
  const newRep = {
    id,
    title: title ? title : oldTitle,
    url: url ? url : title ? `http://github.com/${title}`: oldUrl,
    techs: techs ? techs : oldTechs,
    likes
  }

  repositories[repIndex] = newRep;

  return response.json(newRep);

});

app.delete("/repositories/:id", (req, res) => {
  // get id param
  const {id} = req.params;

  // verify if exist and get Index
  const repIndex = checkIfExist(id, res);

  // delete repositorie by index
  repositories.splice(repIndex, 1);

  // return response with HTTP STATUS CODE = 204
  return res.status(204).json();
});

app.post("/repositories/:id/like", (request, response) => {
  // get id param
  const {id} = request.params;

  // verify if exist and get Index
 const repIndex = checkIfExist(id, response);

  // set likes value
  repositories[repIndex].likes++;

  // return repositorie data
  return response.json(repositories[repIndex]);
});

module.exports = app;
