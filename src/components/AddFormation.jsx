import React, { useState, useEffect } from 'react'
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { db, auth, firebase } from "../firebase"







const AddFormation = (props) => {


    const [fileUrl, setFileUrl] = useState(null)
    const [formations, setFormations] = useState([])
    const [modeEdit, setModeEdit] = useState(false)



    //For modal 
    const {
        buttonLabel,
        className
    } = props;

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);



    const onFileChange = async (e) => {
        const file = e.target.files[0]
        const storageRef = firebase.storage().ref()
        const fileRef = storageRef.child(file.name)
        await fileRef.put(file)
        setFileUrl(await fileRef.getDownloadURL())
    }






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

        } catch (error) {
            console.log(error)
        }
    }






    return (
        <div>
            <div className=" mt-5  col-12 col-sm-8 col-md-6 col-xl-4" >
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
                </Modal>
            </div>
        </div>
    )
}

export default AddFormation
