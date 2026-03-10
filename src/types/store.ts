export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  type: "DIGITAL" | "PHYSICAL";
}
