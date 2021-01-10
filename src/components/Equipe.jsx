import React, { useState, useEffect } from "react"
import { db, auth, firebase } from "../firebase"
import { withRouter } from "react-router-dom";
import "../App.css"
import { Modal, ModalHeader, ModalBody } from 'reactstrap';





const Equipe = (props) => {
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
    const [members, setMembers] = useState([])
    const [member, setMember] = useState("");
    const [modeEdit, setModeEdit] = useState(false);
    const [idPhotoEdit, setIdPhotoEdit] = useState("")



    const fetchMember = async () => {
        const data = await db.collection("equipe").orderBy("create").get()
        const menbers = await data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        setMembers(menbers)
    }

    useEffect(() => {
        fetchMember()
    }, [])


    const onFileChange = async (e) => {
        const file = e.target.files[0]
        const storageRef = firebase.storage().ref()
        const fileRef = storageRef.child(file.name)
        await fileRef.put(file)
        setFileUrl(await fileRef.getDownloadURL())
    }

    const createProfile = async (e) => {
        e.preventDefault()
        const firstName = e.target.firstName.value
        const lastName = e.target.lastName.value
        const poste = e.target.poste.value


        if (!firstName.trim()) {
            console.log("firsName")
            return
        }
        if (!lastName.trim()) {
            console.log("lastName")
            return
        }
        if (!poste.trim()) {
            console.log("poste")
            return
        }

        try {
            const newMember = {
                firsName: firstName,
                lastName: lastName,
                poste: poste,
                photo: fileUrl,
                create: Date.now()
            }
            const data = await db.collection("equipe").add(newMember)
            fetchMember()
        } catch (error) {
            console.log(error)
        }

    }


    const update = async (e) => {
        e.preventDefault()
        const firstName = e.target.firstName.value
        const lastName = e.target.lastName.value
        const poste = e.target.poste.value

        if (!firstName.trim()) {
            console.log("champ nom vide")
        }
        if (!lastName.trim()) {
            console.log("champ prénom vide")
        }
        if (!poste.trim()) {
            console.log("champ poste vide")
        }

        try {
            const id = member.id
            const res = await db.collection("equipe").doc(id).update({
                firstName: firstName,
                lastName: lastName,
                poste: poste

            })

            fetchMember()
        } catch (error) {
            console.log(error)
        }
    }

    const deleteMember = async (idMember) => {
        await db.collection("equipe").doc(idMember).delete()
        fetchMember()
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
            console.log(newPhotoURL)

            await db.collection("equipe").doc(idPhotoEdit).update({
                photo: newPhotoURL
            })
            fetchMember()

            // } else {

            // }


        } catch (error) {
            console.log(error)
        }
    }


    const takeOneMember = (memberId) => {
        const oneMember = members.map(item => (
            item.id === memberId ? setMember(item) : " "
        ), [])

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
                        Ajouter un membre
                    </button>
                </div>
            </div>

            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader>
                    <div className="modal-header">
                        <h5 className="modal-title" id="exampleModalLabel">
                            {
                                modeEdit ? `Modifier le profile de ${member.lastName}` : "Ajouter un nouveau membre dans l'équipe"
                            }
                        </h5>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={toggle} ></button>
                    </div>
                </ModalHeader>
                <ModalBody>
                    <div className="modal-body">
                        <form onSubmit={modeEdit ? update : createProfile}>
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
                                defaultValue={modeEdit ? member.firsName : ""}
                            ></input>

                            <label htmlFor="debut  mb-4">Prénom</label>
                            <input
                                className="form-control  mb-4 "
                                type="text"
                                name="lastName"
                                placeholder="Prénom "
                                defaultValue={modeEdit ? member.lastName : ""}
                            ></input>

                            <label htmlFor="debut">Poste</label>
                            <input
                                className="form-control  mb-4  "
                                type="text"
                                name="poste"
                                placeholder="poste"
                                defaultValue={modeEdit ? member.poste : ""}
                            >
                            </input>
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
                    members.map(item => (

                        <div key={item.id} className="profile-box">
                            <img src={item.photo} alt="..." width="200px" class="rounded-circle"></img>
                            <p>{item.firsName}</p>
                            <p>{item.lastName}</p>
                            <p>{item.poste}</p>
                            <button
                                className="btn btn-primary mt-2"
                                onClick={() => {
                                    toggle();
                                    setModeEdit(true);
                                    takeOneMember(item.id)

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
                                onClick={() => deleteMember(item.id)}
                            >
                                Effacer
                         </button>
                        </div>
                    ))
                }  </div>


        </div>
    )
}
export default withRouter(Equipe) 
