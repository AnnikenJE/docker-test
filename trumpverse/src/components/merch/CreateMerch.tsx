import { ChangeEvent, useContext, useState } from "react";
import { MerchContext } from "../../contexts/MerchContext";
import IMerchContext from "../../interfaces/IMerchContext";
import IMerch from "../../interfaces/IMerch";
import MerchItem from "./MerchItem";
import "./CreateMerch.css";

const CreateMerch = () => {
  const { postMerch } = useContext(MerchContext) as IMerchContext;

  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<string>("");
  const [category, setCategory] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [image, setImage] = useState<File | any>(null);
  const [isValidInput, setIsValidInput] = useState<boolean>(false);

  const [merch, setMerch] = useState<IMerch>({
    id: parseInt(localStorage.getItem("id") || "0"),
    name: localStorage.getItem("name") || "",
    price: parseFloat(localStorage.getItem("price") || "0.0"),
    category: localStorage.getItem("category") || "",
    description: localStorage.getItem("description") || "",
    image: localStorage.getItem("image") || null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    switch (e.target.name) {
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
      case "image":
        const file = e.target.files?.[0];
        setImage(file);
        break;
    }
  };

  const registerMerch = async () => {
    try {
      if (!name || !price || !category || !description || !image) {
        setIsValidInput(false);
      } else {
        setIsValidInput(true);

        const newMerch: IMerch = {
          name: name,
          price: parseFloat(price),
          category: category,
          description: description,
          image: image.name,
        };

        const createdItem: IMerch | null = await postMerch(newMerch, image);
        newMerch.id = createdItem?.id;
        setMerch(newMerch);

        localStorage.setItem("id", `${createdItem?.id}`);
        localStorage.setItem("name", name);
        localStorage.setItem("price", price);
        localStorage.setItem("category", category);
        localStorage.setItem("description", description);
        localStorage.setItem("image", image.name);

        setName("");
        setPrice("");
        setCategory("");
        setDescription("");
        setImage("");
      }
    } catch (e) {
      console.error("Cannot register merch - Create Merch.", e);
    }
  };

  const responseToUserJSX = () => {
    if (isValidInput) {
      return (
        <p className="text-center alert alert-success" role="alert">
          New merch got saved!
        </p>
      );
    } else if (!name || !price || !category || !description) {
      return (
        <p className="text-center alert alert-warning" role="alert">
          You need to fill in all the input fields.
        </p>
      );
    } else if (!image) {
      return (
        <p className="text-center alert alert-info" role="alert">
          You need to upload an image.
        </p>
      );
    }
  };

  const showLatestMadeMerchJSX = () => {
    if (merch.name) {
      return (
        <article className="col-lg-6 col-12 mt-3 p-3 border shadow">
          <h3 className="create-merch__txt text-center">Your newest merch</h3>
          <div className="row justify-content-center d-flex">
            <div className="col-sm-6 ">
              <MerchItem
                id={merch.id}
                name={merch.name}
                price={merch.price}
                category={merch.category}
                description={merch.description}
                image={merch.image}
              />
            </div>
          </div>
        </article>
      );
    }
  };

  return (
    <div className="container">
      <section className="row justify-content-center">
        <article className="col-lg-6 col-12 mt-3 p-3 border shadow ">
          <h3 className="text-center create-merch__txt">Create new merch</h3>
          <div className="d-flex row m-3">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                name="name"
                placeholder="Trump t-shirt"
                onChange={handleChange}
                className="form-control w-50"
                value={name}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Price USD</label>
              <input
                type="number"
                name="price"
                placeholder="14.99"
                onChange={handleChange}
                className="form-control w-25"
                value={price}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Category</label>
              <input
                type="text"
                name="category"
                placeholder="T-shirt"
                onChange={handleChange}
                className="form-control w-25"
                value={category}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <input
                type="text"
                name="description"
                placeholder="Nice t-shirt made of 100% cotton."
                onChange={handleChange}
                className="form-control"
                value={description}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Image</label>
              <input
                className="form-control"
                type="file"
                name="image"
                onChange={handleChange}
              />
            </div>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-success w-25 m-4"
                onClick={registerMerch}
              >
                Create
              </button>
            </div>
            {responseToUserJSX()}
          </div>
        </article>
        {showLatestMadeMerchJSX()}
      </section>
    </div>
  );
};

export default CreateMerch;
