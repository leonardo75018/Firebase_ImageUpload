import React, { useState, useEffect } from "react"
import { db, auth, firebase } from "../firebase"
import { withRouter } from "react-router-dom";
import "../App.css"
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import AddFormation from "./AddFormation"



const Formations = (props) => {
    React.useEffect(() => {
        if (auth.currentUser) {
            // console.log("connecté")
        } else {
            console.log("aucun")
            props.history.push("/login")
        }

    }, [props.history])

    const [fileUrl, setFileUrl] = useState(null)
    const [formations, setFormations] = useState([])
    const [igmEdit, setImgEdit] = useState([])
    const [idImgEdit, setIdImgEdit] = useState("")
    const [modeEdit, setModeEdit] = useState(false)





    const onFileChange = async (e) => {
        const file = e.target.files[0]
        const storageRef = firebase.storage().ref()
        const fileRef = storageRef.child(file.name)
        await fileRef.put(file)
        setFileUrl(await fileRef.getDownloadURL())
    }


    const fetchFormations = async () => {
        const data = await db.collection("formations").get()

        const arrayData = await data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        console.log(arrayData)

        setFormations(arrayData)
    }


    useEffect(() => {
        fetchFormations()
    }, [])


    const onSubmit = async (e) => {
        e.preventDefault()
        const formationName = e.target.formationName.value
        const debutFormation = e.target.debut.value
        const finFormation = e.target.fin.value
        const diplome = e.target.diplome.value
        const descriptionMetier = e.target.description.value
        const savoirFaire = e.target.savoirFaire.value
        const prerequis = e.target.prerequis.value



        if (!formationName.trim()) {
            console.log("formation")
            return
        }

        if (!debutFormation.trim()) {
            console.log("debutFormation")
            return
        }
        if (!finFormation.trim()) {
            console.log("findFormation")
            return
        }


        if (!diplome.trim()) {
            console.log("Diplome")
            return
        }


        if (!descriptionMetier.trim()) {
            console.log("description")
            return
        }

        if (!savoirFaire.trim()) {
            console.log("savoirFaire")
            return
        }
        if (!prerequis.trim()) {
            console.log("prerequis")
            return
        }

        try {
            const newFormation = {
                nom: formationName,
                debut: debutFormation,
                find: finFormation,
                diplome: diplome,
                descriptionMetier: descriptionMetier,
                savoirFaire: savoirFaire,
                prerequis: prerequis,
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
                fetchFormations()

                setError(false)
            } else {
                setError(true)
            }

        } catch (error) {
            console.log(error)
        }

    }


    //For modal 
    const {
        buttonLabel,
        className
    } = props;

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);





    return (
        <div className=" mt-5  col-12 col-sm-8 col-md-6 col-xl-4" >
            <AddFormation setFormation={setFormations} />

            {/* 
            <button type="button" class="btn btn-primary" onClick={toggle} >
                Ajouter une formation
            </button>
            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader>
                    <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">vous vous appretez a creer une nouvelle Formation</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={toggle} ></button>
                    </div>


                </ModalHeader>
                <ModalBody>
                    <div class="modal-body">
                        <form onSubmit={onSubmit}>
                            <label for="formFile">Image page formation</label>
                            <input id="formFile" className="mb-3 form-control" type="file" onChange={onFileChange}></input>
                            <label htmlFor="">Nom de la formation</label>
                            <input className="form-control mb-3" type="text" name="formationName" placeholder="nom de la formation"></input>
                            <label htmlFor="debut">Date du début de la formtion</label>
                            <input className="form-control mb-3" type="date" id="debut" name="debut"></input>
                            <label htmlFor="fin">Date de fin de  formation</label>
                            <input className="form-control mb-3" type="date" id="find" name="fin"></input>
                            <label htmlFor="">Diplome </label>
                            <input className="form-control mb-3" type="text" name="diplome" placeholder="Ex: Diplome niveau 7 bac+2"></input>
                            <label for="exampleFormControlTextarea1">Le descriptif du métier (un paragraphe est attendu) </label>
                            <textarea class="form-control mb-3" id="exampleFormControlTextarea1" rows="3" name="description"></textarea>
                            <label for="exampleFormControlTextarea1">Ce que vous saurez faire après cette formation <br /> (Veuillez utiliser une ligne pour chaque compétence) </label>
                            <textarea class="form-control mb-3" id="exampleFormControlTextarea1" rows="3" name="savoirFaire" placeholder="Ex: Concevoir un disign en site web avec HTML/CSS     Concevoir un site avec  Bootstrap, JQuery, React "></textarea>
                            <label for="exampleFormControlTextarea1">Les prérequis <br /> (Veuillez utiliser une ligne pour chaque  prérequis) </label>
                            <textarea class="form-control mb-3" id="exampleFormControlTextarea1" rows="3" name="prerequis" placeholder="Ex: Lire et écrire en français                                       Maîtriser les bases de l’outil informatique (saisie au clavier, navigation"></textarea>

                            <div class="modal-footer">
                                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" onClick={toggle} >Annuler</button>
                                <button type="submit" class="btn btn-primary">Créer cette formation</button>
                            </div>
                        </form>
                    </div>
                </ModalBody>
            </Modal> */}



            {
                formations.map(item =>
                    <div key={item.id} className="mt-5" >
                        <img src={item.backdrop} width="120%" /> <br />
                        <p>Nom de la formation: {item.nom}</p>
                        <p>Début: {item.debut}------Find: {item.find}   </p>
                        <p> </p>
                        <p>Diplome {item.diplome}   </p>
                        <p>descriptionMetier {item.descriptionMetier}   </p>
                        <p>savoirFaire {item.savoirFaire}   </p>
                        <p> prerequis {item.prerequis}   </p>

                        <button
                            className="btn btn-danger mt-2"
                            onClick={() => deleteFormation(item.id)}
                        >
                            Effacer
                         </button>

                        <button
                            className="btn btn-primary mt-2"
                            onClick={() => { toggle(); setModeEdit(true) }}


                        >
                            Modifier
                         </button>

                        {
                            error &&
                            <div className="alert alert-warning mt-2">seul les archives pgn ou jpg sont acceptés </div>
                        }
                        <div className="custom-file">
                            <input
                                type="file"
                                className="custom-file-input"
                                id={"inputGroupFile01" + item.id}
                                style={{ display: 'none' }}
                                onChange={e => editImage(e)}
                                onClick={() => setIdImgEdit(item.id)}
                            />

                            <label
                                className="btn btn-dark mt-2"
                                htmlFor={"inputGroupFile01" + item.id}
                            >
                                changer l'image
                             </label>
                        </div>
                    </div>)
            }
        </div >
    )
}

export default withRouter(Formations) 
