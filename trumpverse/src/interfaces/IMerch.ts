interface IMerch {
  id?: number;
  name: string;
  price: number;
  category: string;
  description: string;
  image: File | any;
}

export default IMerch;
