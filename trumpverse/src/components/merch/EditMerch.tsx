import { ChangeEvent, useContext, useState } from "react";
import { MerchContext } from "../../contexts/MerchContext";
import IMerchContext from "../../interfaces/IMerchContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons/faSearch";
import IMerch from "../../interfaces/IMerch";
import MerchService from "../../services/MerchService";
import "./EditMerch.css";

const EditMerch = () => {
  const { getMerchById, putMerch, deleteMerchById } = useContext(
    MerchContext
  ) as IMerchContext;

  const [searchId, setSearchedId] = useState<string>("");

  const [id, setId] = useState<number | undefined>(0);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");

  const [image, setImage] = useState<File | any>(null);
  const [newImage, setNewImage] = useState<File | any>(null);

  const [message, setMessage] = useState<string>("");
  const [isDeleteClicked, setIsDeleteClicked] = useState<boolean>(false);
  const [isSchemaShowing, setIsSchemaShowing] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
      case "searchId":
        setSearchedId(e.target.value);
        break;
      case "name":
        setName(e.target.value);
        break;
      case "price":
        setPrice(e.target.value);
        break;
      case "category":
        setCategory(e.target.value);
        break;
      case "description":
        setDescription(e.target.value);
        break;
      case "newImage":
        const file = e.target.files?.[0];
        if (file) {
          setNewImage(file);
        }
        break;
    }
  };

  const resetInputFields = () => {
    setSearchedId("");
    setName("");
    setPrice("");
    setCategory("");
    setDescription("");
    setNewImage(null);
    setImage("");
  };

  const getMerchId = async () => {
    try {
      const merch = await getMerchById(parseInt(searchId));

      if (merch) {
        setId(merch.id);
        setName(merch.name);
        setPrice(merch.price.toString());
        setCategory(merch.category);
        setDescription(merch.description);
        setImage(merch.image);
        setMessage("");
        setIsDeleteClicked(false);
        setIsSchemaShowing(true);
      } else {
        setMessage("invalidSearchId");
        resetInputFields();
        setIsSchemaShowing(false);
      }
    } catch (e) {
      console.error(`Could not get merch ID in EditMerch: ${searchId}`);
    }
  };

  const editMerch = async () => {
    try {
      if (id && name && price && category && description && image) {
        const merchToEdit: IMerch = {
          id: id,
          name: name,
          price: parseFloat(price),
          category: category,
          description: description,
          //Bruker det gamle bildet om det ikke blir sendt inn et nytt bilde
          image: newImage ? newImage.name : image,
        };

        await putMerch(merchToEdit, newImage || null);

        setIsSchemaShowing(false);
        resetInputFields();
        setMessage("merchSaved");
        setIsDeleteClicked(false);
      } else {
        setMessage("invalidInput");
      }
    } catch (e) {
      console.error(`Cant edit merch with ID: ${id}`);
    }
  };

  const deleteMerch = () => {
    try {
      if (id && name && price && category && description && image) {
        setIsDeleteClicked(true);
      } else {
        setMessage("invalidInput");
      }
    } catch (e) {
      console.error(`Cant delete merch with ID: ${id}`);
    }
  };

  const confirmedDeleteMerch = async () => {
    if (id) {
      setMessage("merchGotDeleted");
      resetInputFields();
      setIsDeleteClicked(false);
      setIsSchemaShowing(false);
      await deleteMerchById(id);
    }
  };

  const canceledDeleteMerch = () => {
    setIsDeleteClicked(false);
  };

  const deleteMerchJSX = () => {
    if (isDeleteClicked) {
      return (
        <div className="alert alert-warning row m-2" role="alert">
          <p className="text-center">
            Are you sure you want to delete merch {name} with ID {id}?
          </p>
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-secondary m-2"
              onClick={canceledDeleteMerch}
            >
              Cancel
            </button>
            <button
              className="btn btn-danger m-2"
              onClick={confirmedDeleteMerch}
            >
              Confirm
            </button>
          </div>
        </div>
      );
    } else {
      <div></div>;
    }
  };

  const showImageJSX = () => {
    if (image) {
      return (
        <div className="mb-3">
          <p>Current image: {image.toString()}</p>
          <img
            className="w-100 m-1"
            src={MerchService.getImageEndpoint() + image}
            alt={name + " image."}
          />
        </div>
      );
    } else {
      return <div></div>;
    }
  };

  const responseToUserJSX = () => {
    switch (message) {
      case "invalidSearchId":
        return (
          <p className="alert alert-danger" role="alert">
            No merch with matching ID.
          </p>
        );
      case "invalidInput":
        return (
          <p className="alert alert-danger" role="alert">
            Not valid input. Please search for an item and make sure all the
            fields are filled.
          </p>
        );

      case "merchSaved":
        return (
          <p className="alert alert-success" role="alert">
            Merch with ID {id} got edited successfully.
          </p>
        );

      case "merchGotDeleted":
        return (
          <p className="alert alert-success" role="alert">
            Merch with ID {id} got deleted.
          </p>
        );
    }
    return <div></div>;
  };

  const showSchemaJSX = () => {
    if (isSchemaShowing == true) {
      return (
        <div>
          {" "}
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              name="name"
              placeholder="name"
              onChange={handleChange}
              value={name}
              className="form-control w-50"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Price USD</label>
            <input
              type="number"
              name="price"
              placeholder="price"
              onChange={handleChange}
              value={price}
              className="form-control w-25"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Category</label>
            <input
              type="text"
              name="category"
              placeholder="category"
              onChange={handleChange}
              value={category}
              className="form-control w-25"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <input
              type="text"
              name="description"
              placeholder="description"
              onChange={handleChange}
              value={description}
              className="form-control"
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Image</label>
            <input
              type="file"
              name="newImage"
              onChange={handleChange}
              className="form-control "
            />
          </div>
          <div className="mb-3 d-flex justify-content-center">
            <button onClick={editMerch} className="btn btn-success m-2">
              Edit
            </button>
            <button onClick={deleteMerch} className="btn btn-danger m-2">
              Delete
            </button>
          </div>
        </div>
      );
    }
  };

  return (
    <div className="container">
      <section className="row justify-content-center">
        <article className=" col-sm-12 col-md-6 mt-3 p-3 border shadow">
          <h3 className="edit-merch__txt text-center pt-3">
            Edit existing merch
          </h3>
          <div className="d-flex row">
            <div className="mb-3 ">
              <h5 className="text-center mt-2 edit-merch__txt">
                Find merch by ID
              </h5>
              <div className="d-flex justify-content-center">
                <input
                  type="number"
                  name="searchId"
                  placeholder="Search for id"
                  onChange={handleChange}
                  value={searchId}
                  className="form-control w-50"
                />
                <button className="btn btn-primary" onClick={getMerchId}>
                  Search <FontAwesomeIcon icon={faSearch} />
                </button>
              </div>
              <div className="text-center m-2">{responseToUserJSX()}</div>
            </div>

            {showSchemaJSX()}

            <div>{deleteMerchJSX()}</div>
            <div>{showImageJSX()}</div>
          </div>
        </article>
      </section>
    </div>
  );
};

export default EditMerch;
