import React, { useState, useEffect } from "react"
import { db, auth, firebase } from "../firebase"
import { withRouter } from "react-router-dom";
import "../App.css"
import { Modal, ModalHeader, ModalBody } from 'reactstrap';



const Benevoles = (props) => {
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
    const [benevoles, setBenevoles] = useState([])
    const [benevole, setBenevole] = useState("");
    const [modeEdit, setModeEdit] = useState(false);
    const [idPhotoEdit, setIdPhotoEdit] = useState("")



    const fetchBenevoles = async () => {
        const data = await db.collection("benevoles").orderBy("create").get()
        const benevoles = await data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setBenevoles(benevoles)
    }
    useEffect(() => {
        fetchBenevoles()
    }, [])

    const creteBenevoles = async (e) => {
        e.preventDefault()
        const firstName = e.target.firstName.value
        const lastName = e.target.lastName.value

        if (!firstName.trim()) {
            console.log("champ firsName")
            return
        }
        if (!lastName.trim()) {
            console.log("champ lastName vide")
            return
        }

        try {
            const newBenevole = {
                firstName: firstName,
                lastName: lastName,
                photo: fileUrl,
                create: Date.now()
            }
            const data = await db.collection("benevoles").add(newBenevole)
            fetchBenevoles()
        } catch (error) {
            console.log(error)
        }
    }

    const onFileChange = async (e) => {
        const file = e.target.files[0]
        const storageRef = firebase.storage().ref()
        const fileRef = storageRef.child(file.name)
        await fileRef.put(file)
        setFileUrl(await fileRef.getDownloadURL())
    }

    const updateBenevole = async (e) => {
        e.preventDefault()
        const firstName = e.target.firstName.value
        const lastName = e.target.lastName.value


        try {
            const id = benevole.id
            const res = await db.collection("benevoles").doc(id).update({
                firstName: firstName,
                lastName: lastName
            })

            fetchBenevoles()
        } catch (error) {
            console.log(error)
        }

    }

    const takeOneBenevole = (benevoleId) => {
        const oneBenevole = benevoles.map(item => (
            item.id === benevoleId ? setBenevole(item) : " "
        ), [])

    }


    const imageUpadate = async (image) => {
        const newImageProfile = image.target.files[0]

        try {
            if (newImageProfile === undefined) {
                console.log("pas d'image selectionner")
                return
            }

            // if (newImageProfile.type === "image/jpg" || newImageProfile.type === "image/png") {
            const imageRef = await firebase.storage().ref().child(newImageProfile.name)
            await imageRef.put(newImageProfile)
            const newPhotoURL = await imageRef.getDownloadURL()

            await db.collection("benevoles").doc(idPhotoEdit).update({
                photo: newPhotoURL
            })
            fetchBenevoles()

            // } else {

            // }
        } catch (error) {
            console.log(error)
        }
    }

    const deleteBenevole = async (idBenevole) => {
        await db.collection("benevoles").doc(idBenevole).delete()
        fetchBenevoles()
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
                            setModeEdit(false)
                        }}
                    >
                        Ajouter un benevole
                    </button>
                </div>
            </div>

            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader>
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                            {
                                modeEdit ? `Modifier le profile de ` : "Ajouter un nouveau membre dans l'équipe"
                            }
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={toggle} ></button>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="modal-body">
                        <form onSubmit={modeEdit ? updateBenevole : creteBenevoles}  >
                            {
                                modeEdit ? <div></div> :
                                    <div>
                                        <label htmlFor="formFile">Photo de profile</label>
                                        <input
                                            id="formFile"
                                            className="form-control"
                                            type="file"
                                            onChange={onFileChange}
                                            name="img"
                                        >
                                        </input>
                                    </div>
                            }

                            <label htmlFor="debut">Nom</label>
                            <input
                                className="form-control mb-4 "
                                type="text"
                                name="firstName"
                                placeholder="nom "
                                defaultValue={modeEdit ? benevole.firsName : ""}
                            ></input>

                            <label htmlFor="debut  mb-4">Prénom</label>
                            <input
                                className="form-control  mb-4 "
                                type="text"
                                name="lastName"
                                placeholder="Prénom "
                                defaultValue={modeEdit ? benevole.lastName : ""}
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
                                    {
                                        modeEdit ? "Modifier" : `Ajouter un nouveau membre`
                                    }
                                </button>
                            </div>
                        </form>
                    </div>
                </ModalBody>
            </Modal>


            <div className="container-profile">
                {
                    benevoles.map(item => (

                        <div key={item.id} className="profile-box">
                            <img src={item.photo} alt="..." width="200px" class="rounded-circle"></img>
                            <p>{item.firstName}</p>
                            <p>{item.lastName}</p>
                            <button
                                className="btn btn-primary mt-2"
                                onClick={() => {
                                    toggle();
                                    setModeEdit(true);
                                    takeOneBenevole(item.id)
                                }}
                            >
                                Modiffier
                         </button>

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
                                onClick={() => deleteBenevole(item.id)}
                            >
                                Effacer
                         </button>
                        </div>
                    ))
                }  </div>
        </div>
    )
}

export default withRouter(Benevoles)
