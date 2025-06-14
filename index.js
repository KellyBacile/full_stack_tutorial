const express = require('express')
const app = express()

app.use(express.static('dist'))
app.use(express.json())

let notes = [
  {
    id: "1",
    content: "chat begin",
    important: true
  }
]


app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})

app.get('/api/notes', (req, res) => {
    res.json(notes)
})

app.get('/api/notes/:id', (req, res) => {
    const id = req.params.id
    const note = notes.find(note => note.id === id)

    if (note) {
        res.json(note)
    } else {
        res.status(404).end()
    }
})

app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id
    notes = notes.filter(note => note.id !== id)

    res.status(204).end()
})

app.post('/api/notes', (req, res) => {
  const body = req.body

  const generateId = () => {
    const maxId = notes.length > 0 
      ? Math.max(...notes.map(n => Number(n.id))) 
      : 0
    return String(maxId + 1)
  }

  if (!body.content) {
    return response.status(400).json({
      error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: body.important || false,
    id: generateId()
  }

  notes = notes.concat(note)

  res.json(note)
})

app.put('/api/notes/:id', (req, res) => {
    const id = req.params.id
    const newNote = req.body
    notes = notes.map(note => note.id === id ? newNote : note)

    res.json(newNote)
})


const unknownEndpoint = (req, res) => {
  console.log('error: unknown endpoint')
  res.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})