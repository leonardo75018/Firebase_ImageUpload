import React, { useState, useEffect } from "react"
import './App.css';
import { firebase, db } from "./firebase"




function App() {
  const [fileUrl, setFileUrl] = useState(null)
  const [formations, setFormations] = useState([])
  const [igmEdit, setImgEdit] = useState([])
  const [idImgEdit, setIdImgEdit] = useState("")
  console.log(idImgEdit)



  const onFileChange = async (e) => {
    const file = e.target.files[0]
    const storageRef = firebase.storage().ref()
    const fileRef = storageRef.child(file.name)
    await fileRef.put(file)
    setFileUrl(await fileRef.getDownloadURL())
  }


  useEffect(() => {
    const fetchFormations = async () => {
      const data = await db.collection("formations").get()
      const arrayData = await data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
      setFormations(arrayData)
    }
    fetchFormations()

  }, [])


  const onSubmit = async (e) => {
    e.preventDefault()
    const formationName = e.target.formationName.value
    if (!formationName.trim()) {
      console.log("champ vide")
      return
    }

    try {
      const newFormation = {
        nom: formationName,
        backdrop: fileUrl
      }
      const data = await db.collection("formations").add(newFormation)
      setFormations([
        ...formations,
        { ...newFormation, id: data.id }
      ])

    } catch (error) {
      console.log(error)
    }
  }

  const deleteFormation = async (id) => {
    await db.collection("formations").doc(id).delete()
    const arrayFilter = formations.filter(item => item.id !== id)
    setFormations(arrayFilter)

  }




  const [error, setError] = useState(false)

  const editImage = async (image) => {
    const imageFormation = image.target.files[0]

    try {
      if (imageFormation === undefined) {
        console.log("pas d'image selectionner")
        return

      }

      if (imageFormation.type === "image/jpeg" || imageFormation.type === "image/png") {
        const imageRef = await firebase.storage().ref().child(imageFormation.name)
        await imageRef.put(imageFormation)
        const newImageURL = await imageRef.getDownloadURL()

        await db.collection("formations").doc(idImgEdit).update({
          backdrop: newImageURL
        })




        setError(false)
      } else {
        setError(true)
      }


    } catch (error) {
      console.log(error)
    }




  }







  return (
    <div className="App">
      <form onSubmit={onSubmit}>
        <input type="file" onChange={onFileChange}></input>
        <input type="text" name="formationName" placeholder="nom de la formation"></input>
        <button type="submit">Créer cette formation</button>
      </form> <br /> <br /> <br /> <br />
      {
        formations.map(item =>
          <div key={item.id} className="mb-5" >
            <img src={item.backdrop} width="100px" /> <br />
            <p>{item.nom}</p>
            <button
              className="btn btn-danger mt-2"
              onClick={() => deleteFormation(item.id)}
            >
              Effacer
            </button>

            {
              error &&
              <div className="alert alert-warning mt-2">seul les archives pgn ou jpg sont acceptés </div>
            }
            <div className="custom-file">
              <input
                type="file"
                className="custom-file-input"
                id="inputGroupFile01"
                style={{ display: 'none' }}
                onChange={e => editImage(e)}
                data-id={item}
                onClick={() => console.log(item.id)}
              />

              <label
                className="btn btn-dark mt-2"
                htmlFor="inputGroupFile01"
              >
                changer l'image
               </label>
            </div>


          </div>)
      }

    </div >
  );
}

export default App;
