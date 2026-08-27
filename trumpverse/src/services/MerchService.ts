import axios from "axios";
import IMerch from "../interfaces/IMerch";

const MerchService = (() => {
  const serverURL: string = "http://localhost:5290";
  const apiURL: string = `${serverURL}/api`;

  const merchControllerEndpoint: string = `${apiURL}/TrumpMerch/`;
  const getByNameEndpoint: string = `${apiURL}/TrumpMerch/GetByName/`;
  const imageUploadControllerEndpoint: string = `${apiURL}/UploadImage/`;
  const imageEndpoint: string = `${serverURL}/images/`;

  const getAll = async (): Promise<IMerch[]> => {
    try {
      const result = await axios.get(merchControllerEndpoint);
      return result.data as IMerch[];
    } catch (e) {
      console.error("Error, cant get all merch in MerchService.", e);
      return [];
    }
  };

  const getById = async (id: number): Promise<IMerch | null> => {
    try {
      const result = await axios.get(merchControllerEndpoint + id);
      return result.data as IMerch;
    } catch (e) {
      console.error(`Error, cant get merch by ID ${id} in MerchService.`, e);
      return null;
    }
  };

  const getByName = async (name: string): Promise<IMerch[] | null> => {
    try {
      const result = await axios.get(getByNameEndpoint + name);
      return result.data as IMerch[];
    } catch (e) {
      console.error(
        "Error, cant get merch by name or it was no input in MerchService.",
        e
      );
      return null;
    }
  };

  const postMerch = async (
    newMerch: IMerch,
    newMerchImage: File
  ): Promise<IMerch | null> => {
    try {
      const result = await axios.post(merchControllerEndpoint, newMerch);

      const formData = new FormData();
      formData.append("file", newMerchImage);

      await axios({
        url: imageUploadControllerEndpoint,
        method: "POST",
        data: formData,
        headers: { "Content-Type": "multipart/form-data" },
      });

      formData.delete("file");

      return result.data as IMerch;
    } catch (e) {
      console.error(
        "Error, cant post merch or the fields did not have any input in MerchService.",
        e
      );
      return null;
    }
  };

  const putMerch = async (
    editedMerch: IMerch,
    editedImage?: File
  ): Promise<IMerch | null> => {
    try {
      const result = await axios.put(merchControllerEndpoint, editedMerch);

      if (editedImage) {
        const formData = new FormData();
        formData.append("file", editedImage);

        await axios({
          url: imageUploadControllerEndpoint,
          method: "PUT",
          data: formData,
          headers: { "Content-Type": "multipart/form-data" },
        });

        formData.delete("file");
      }

      return result.data as IMerch;
    } catch (e) {
      console.error("Error, cant edit merch in MerchService.", e);
      return null;
    }
  };

  const deleteMerchById = async (id: number): Promise<IMerch | null> => {
    try {
      const result = await axios.delete(merchControllerEndpoint + id);
      return result.data;
    } catch (e) {
      console.error("Error, cant delete merch in MerchService.", e);
      return null;
    }
  };

  const getImageEndpoint = () => {
    return imageEndpoint;
  };

  return {
    getAll,
    getById,
    getByName,
    getImageEndpoint,
    putMerch,
    deleteMerchById,
    postMerch,
  };
})();

export default MerchService;
