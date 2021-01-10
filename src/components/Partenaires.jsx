import React, { useState, useEffect } from "react"
import { db, auth, firebase } from "../firebase"
import { withRouter } from "react-router-dom";
import "../App.css"
import { Modal, ModalHeader, ModalBody } from 'reactstrap';



const Partenaires = (props) => {

    React.useEffect(() => {
        if (auth.currentUser) {
            // console.log("connecté")
        } else {
            console.log("aucun")
            props.history.push("/login")
        }

    }, [props.history])

    //For modal 
    const {
        buttonLabel,
        className
    } = props;
    const [modal, setModal] = useState(false);
    const toggle = () => setModal(!modal);
    const [fileUrl, setFileUrl] = useState(null)
    const [partenaires, setPartenaires] = useState([]);
    const [idPhotoEdit, setIdPhotoEdit] = useState("")


    const fetchPartenaires = async () => {
        const data = await db.collection("partenaires").orderBy("create").get()
        const partenaires = await data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setPartenaires(partenaires)
    }


    useEffect(() => {
        fetchPartenaires()
    }, [])

    const onFileChange = async (e) => {
        const file = e.target.files[0]
        const storageRef = firebase.storage().ref()
        const fileRef = storageRef.child(file.name)
        await fileRef.put(file)
        setFileUrl(await fileRef.getDownloadURL())
    }

    const createPartenaire = async (e) => {
        e.preventDefault()
        const parteNaireName = e.target.partenaireName.value

        if (!parteNaireName.trim()) {
            console.log("il faut ajouter le nom du partenaire")
        }

        try {
            const newPartenaire = {
                nom: parteNaireName,
                create: Date.now(),
                photo: fileUrl
            }

            fetchPartenaires()

            const data = await db.collection("partenaires").add(newPartenaire)
        } catch (error) {
            console.log(error)
        }
    }

    const deletePartenaires = async (idPatenaire) => {
        await db.collection("partenaires").doc(idPatenaire).delete()
        fetchPartenaires()
    }

    const imageUpadate = async (image) => {
        const partenairePhoto = image.target.files[0]
        try {
            if (partenaires === undefined) {
                console.log("pas d'image selectionner")
                return
            }

            // if (newImageProfile.type === "image/jpg" || newImageProfile.type === "image/png") {
            const imageRef = await firebase.storage().ref().child(partenairePhoto.name)
            await imageRef.put(partenairePhoto)
            const newPhotoURL = await imageRef.getDownloadURL()
            console.log(newPhotoURL)

            await db.collection("partenaires").doc(idPhotoEdit).update({
                photo: newPhotoURL
            })
            fetchPartenaires()

        } catch (error) {
            console.log(error)
        }
    }






    return (
        <div>
            <div className="ajouter-contente">
                <div className="ajouter">
                    <button
                        type="button"
                        className="btn btn-primary "
                        onClick={() => {
                            toggle();

                        }}
                    >
                        Ajouter un Partenaire
                    </button>
                </div>
            </div>

            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader>
                    <div className="modal-header">
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={toggle} ></button>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="modal-body">
                        <form onSubmit={createPartenaire}>

                            <div className="mb-4">
                                <label htmlFor="formFile">Logo du partenaire</label>
                                <input
                                    id="formFile"
                                    className="form-control"
                                    type="file"
                                    name="img"
                                    onChange={onFileChange}
                                >
                                </input>
                            </div>

                            <label htmlFor="debut">Nom du partenaire</label>
                            <input
                                className="form-control mb-4 "
                                type="text"
                                name="partenaireName"
                                placeholder="nom du partenaire"
                            ></input>

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
                                    Ajouter
                                </button>
                            </div>
                        </form>
                    </div>
                </ModalBody>
            </Modal>

            <div className="container-profile">
                {
                    partenaires.map(item => (

                        <div key={item.id} className="profile-box">
                            <img src={item.photo} alt="..." width="200px" class="rounded-circle"></img>
                            <p>{item.nom}</p>

                            <div className="custom-file">
                                <input
                                    type="file"
                                    className="custom-file-input"
                                    id={"inputGroupFile01" + item.id}
                                    style={{ display: 'none' }}
                                    onChange={e => imageUpadate(e)}
                                    onClick={() => setIdPhotoEdit(item.id)}
                                />

                                <label
                                    className="btn btn-dark mt-2"
                                    htmlFor={"inputGroupFile01" + item.id}
                                >
                                    changer l'image
                             </label>
                            </div>

                            <button
                                className="btn btn-danger mt-2"
                                onClick={() => deletePartenaires(item.id)}
                            >
                                Effacer
                         </button>
                        </div>
                    ))
                }  </div>
        </div>
    )
}

export default withRouter(Partenaires)