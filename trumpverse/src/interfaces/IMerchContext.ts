import IMerch from "./IMerch";

interface IMerchContext {
  merch: IMerch[];
  getMerchFromService: () => void;
  getMerchById: (id: number) => Promise<IMerch | null>;
  getMerchByName: (name: string) => Promise<IMerch[] | null>;
  postMerch: (newMerch: IMerch, newMerchImage: File) => Promise<IMerch | null>;
  putMerch: (editedMerch: IMerch, editedImage?: File) => Promise<IMerch | null>;
  deleteMerchById: (id: number) => void;
}

export default IMerchContext;
