import { createContext, FC, useState } from "react";
import IMerch from "../interfaces/IMerch";
import IMerchContext from "../interfaces/IMerchContext";
import IProps from "../interfaces/IProps";
import MerchService from "../services/MerchService";

export const MerchContext = createContext<IMerchContext | null>(null);

export const MerchProvider: FC<IProps> = ({ children }) => {
  const [merch, setMerch] = useState<IMerch[]>([]);

  const getMerchFromService = async () => {
    try {
      const merchFromService = await MerchService.getAll();
      setMerch(merchFromService);
    } catch {
      console.error("Cant get merch in MerchContext");
      return null;
    }
  };

  const getMerchById = async (id: number) => {
    try {
      const merchFromService = await MerchService.getById(id);
      return merchFromService;
    } catch (e) {
      console.error(`Cant get merch by ID in MerchContext. ID: ${id}`, e);
      return null;
    }
  };

  const getMerchByName = async (name: string) => {
    try {
      const merchFromService = await MerchService.getByName(name);
      return merchFromService;
    } catch (e) {
      console.error("Cant get merch by name in MerchContext", e);
      return null;
    }
  };

  const postMerch = async (
    newMerch: IMerch,
    newMerchImage: File
  ): Promise<IMerch | null> => {
    try {
      const result = await MerchService.postMerch(newMerch, newMerchImage);
      if (result != null) {
        setMerch([result, ...merch]);
      }
      return result as IMerch;
    } catch (e) {
      console.error("Cant post merch in MerchContext", e);
      return null;
    }
  };

  const putMerch = async (
    editedMerch: IMerch,
    editedImage?: File
  ): Promise<IMerch | null> => {
    try {
      const result = await MerchService.putMerch(editedMerch, editedImage);

      if (result != null) {
        setMerch([result, ...merch]);
      }
      return result as IMerch;
    } catch (e) {
      console.error(`Cant edit merch in MerchContext.}`, e);
      return null;
    }
  };

  const deleteMerchById = async (id: number) => {
    try {
      const result = await MerchService.deleteMerchById(id);
      return result;
    } catch (e) {
      console.error(`Cant delete merch in MerchContext. ID: ${id}`, e);
      return null;
    }
  };

  return (
    <MerchContext.Provider
      value={{
        merch,
        getMerchFromService,
        getMerchById,
        getMerchByName,
        postMerch,
        putMerch,
        deleteMerchById,
      }}
    >
      {children}
    </MerchContext.Provider>
  );
};
