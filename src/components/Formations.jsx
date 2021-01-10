import React, { useState, useEffect } from "react"
import { db, auth, firebase } from "../firebase"
import { withRouter } from "react-router-dom";
import "../App.css"
import { Modal, ModalHeader, ModalBody } from 'reactstrap';
import { useForm } from 'react-hook-form'



const Formations = (props) => {

    const { register, errors, handleSubmit } = useForm();

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
    const [oneFormation, setOneFormation] = useState("")



    //For modal 
    const {
        buttonLabel,
        className
    } = props;

    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);





    const fetchFormations = async () => {
        const data = await db.collection("formations").get()
        const arrayData = await data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setFormations(arrayData)
    }


    useEffect(() => {
        fetchFormations()
    }, [])




    const onFileChange = async (e) => {
        const file = e.target.files[0]
        const storageRef = firebase.storage().ref()
        const fileRef = storageRef.child(file.name)
        await fileRef.put(file)
        setFileUrl(await fileRef.getDownloadURL())
    }



    const createFormation = async (e) => {
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


    const updateFormation = async (e) => {
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
            const id = oneFormation.id
            const res = await db.collection("formations").doc(id).update({
                nom: formationName,
                debut: debutFormation,
                find: finFormation,
                diplome: diplome,
                descriptionMetier: descriptionMetier,
                savoirFaire: savoirFaire,
                prerequis: prerequis,
            })
            fetchFormations()


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

            if (imageFormation.type === "image/jpg" || imageFormation.type === "image/png") {
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

    const takeFormation = (formationId) => {
        const takeFormation = formations.map(item => (
            item.id === formationId ? setOneFormation(item) : " "

        ), [])

    }













    return (
        <div className=" mt-5  " >
            <div className="ajouter">
                <button
                    type="button"
                    className="btn btn-primary "
                    onClick={() => { toggle(); setModeEdit(false) }} >
                    Ajouter une formation
            </button>
            </div>


            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader>
                    <div class="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">{
                            modeEdit ? `Modification de la formation ${oneFormation.nom}` : "Création d'une nouvelle formation  "
                        }</h5>


                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={toggle} ></button>
                    </div>


                </ModalHeader>
                <ModalBody>
                    <div className="modal-body">
                        <form onSubmit={modeEdit ? updateFormation : createFormation}>

                            {
                                modeEdit ? <div></div> :
                                    <div>
                                        <label htmlFor="formFile">Image page formation</label>
                                        <input
                                            id="formFile"
                                            className="form-control"
                                            type="file"
                                            onChange={onFileChange}
                                            name="img"
                                            ref={
                                                register({
                                                    required: {
                                                        value: true,
                                                        message: "ce champ est obligatoire"
                                                    }
                                                })
                                            }
                                        >
                                        </input>
                                        <span className="text-danger text-small d-block mb-3">
                                            {errors?.img?.message}
                                        </span>

                                    </div>
                            }



                            <label htmlFor="">Nom de la formation</label>
                            <input
                                className="form-control "
                                type="text"
                                name="formationName"
                                placeholder="nom de la formation"
                                ref={
                                    register({
                                        required: {
                                            value: true,
                                            message: "ce champ est obligatoire"
                                        }
                                    })
                                }
                                defaultValue={modeEdit ? oneFormation.nom : ""}
                            >
                            </input>
                            <span className="text-danger text-small d-block mb-3">
                                {errors?.formationName?.message}
                            </span>

                            <label htmlFor="debut">Date du début de la formtion</label>
                            <input
                                className="form-control "
                                type="date"
                                id="debut"
                                name="debut"
                                defaultValue={modeEdit ? oneFormation.debut : ""}
                                ref={
                                    register({
                                        required: {
                                            value: true,
                                            message: "ce champ est obligatoire"
                                        }
                                    })
                                }
                            >
                            </input>
                            <span className="text-danger text-small d-block mb-3">
                                {errors?.debut?.message}
                            </span>

                            <label htmlFor="fin">Date de fin de  formation</label>
                            <input
                                className="form-control"
                                type="date"
                                id="find"
                                name="fin"
                                defaultValue={modeEdit ? oneFormation.find : ""}
                                ref={
                                    register({
                                        required: {
                                            value: true,
                                            message: "ce champ est obligatoire"
                                        }
                                    })
                                }
                            >
                            </input>
                            <span className="text-danger text-small d-block mb-3">
                                {errors?.fin?.message}
                            </span>


                            <label htmlFor="">Diplome </label>
                            <input
                                className="form-control"
                                type="text"
                                name="diplome"
                                placeholder="Ex: Diplome niveau 7 bac+2"
                                defaultValue={modeEdit ? oneFormation.diplome : ""}
                                ref={
                                    register({
                                        required: {
                                            value: true,
                                            message: "ce champ est obligatoire"
                                        }
                                    })
                                }
                            >
                            </input>
                            <span className="text-danger text-small d-block mb-3">
                                {errors?.diplome?.message}
                            </span>

                            <label htmlFor="exampleFormControlTextarea1">Le descriptif du métier (un paragraphe est attendu) </label>
                            <textarea
                                className="form-control "
                                id="exampleFormControlTextarea1"
                                rows="3"
                                name="description"
                                defaultValue={modeEdit ? oneFormation.descriptionMetier : ""}
                                ref={
                                    register({
                                        required: {
                                            value: true,
                                            message: "ce champ est obligatoire"
                                        }
                                    })
                                }
                            >
                            </textarea>
                            <span className="text-danger text-small d-block mb-3">
                                {errors?.description?.message}
                            </span>

                            <label htmlFor="exampleFormControlTextarea1">Ce que vous saurez faire après cette formation <br /> (Veuillez utiliser une ligne pour chaque compétence) </label>
                            <textarea
                                className="form-control"
                                id="exampleFormControlTextarea1"
                                rows="3" name="savoirFaire"
                                placeholder="Ex: Concevoir un disign en site web avec HTML/CSS     Concevoir un site avec  Bootstrap, JQuery, React "
                                defaultValue={modeEdit ? oneFormation.savoirFaire : ""}
                                ref={
                                    register({
                                        required: {
                                            value: true,
                                            message: "ce champ est obligatoire"
                                        }
                                    })
                                }
                            >
                            </textarea>
                            <span className="text-danger text-small d-block mb-3">
                                {errors?.savoirFaire?.message}
                            </span>


                            <label htmlFor="exampleFormControlTextarea1">Les prérequis <br /> (Veuillez utiliser une ligne pour chaque  prérequis) </label>
                            <textarea
                                className="form-control"
                                id="exampleFormControlTextarea1"
                                rows="3" name="prerequis"
                                placeholder="Ex: Lire et écrire en français                                       Maîtriser les bases de l’outil informatique (saisie au clavier, navigation"
                                defaultValue={modeEdit ? oneFormation.prerequis : ""}
                                ref={
                                    register({
                                        required: {
                                            value: true,
                                            message: "ce champ est obligatoire"
                                        }
                                    })
                                }
                            ></textarea>
                            <span className="text-danger text-small d-block mb-3">
                                {errors?.prerequis?.message}
                            </span>


                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    data-bs-dismiss="modal"
                                    onClick={toggle}
                                >
                                    Annuler
                                 </button>

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                >
                                    {modeEdit ? "Modifier cette formation" : "Créer cette formation"}
                                </button>

                            </div>
                        </form>
                    </div>
                </ModalBody>
            </Modal>

            <div className="content ">
                {
                    formations.map(item =>
                        <div key={item.id}  >
                            <div>
                                <img src={item.backdrop} width="500px" alt="image d'une formation en informatique" /> <br />

                                <h3>{item.nom}</h3>
                                <h5>Début: {item.debut}------Find: {item.find}   </h5>
                                <h5>Diplome : {item.diplome}  </h5>
                                <h5>description du métier : {item.descriptionMetier}  </h5>
                                <h5>description du métier : {item.descriptionMetier}  </h5>
                                <h5>savoir faire {item.savoirFaire}   </h5>
                                <h5>prerequis : {item.prerequis}   </h5>

                                <button
                                    className="btn btn-danger mt-2"
                                    onClick={() => deleteFormation(item.id)}
                                >
                                    Effacer
                         </button>

                                <button
                                    className="btn btn-primary mt-2"
                                    onClick={() => { toggle(); setModeEdit(true); takeFormation(item.id) }}

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
                            </div>
                        </div>)
                }
            </div>
        </div >
    )
}

export default withRouter(Formations) 
