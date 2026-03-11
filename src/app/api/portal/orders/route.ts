import { NextResponse } from "next/server";

const mockOrders = [
  {
    id: "ord-1",
    date: "08 Mar 2026",
    total: "$45.000",
    status: "DELIVERED",
    items: [
      { name: "Diario de Gratitud", quantity: 1, price: "$25.000", type: "physical" },
      { name: "Guia de Meditacion (PDF)", quantity: 1, price: "$20.000", type: "digital", downloadUrl: "#" },
    ],
    shippingStatus: "Entregado el 10 Mar 2026",
  },
  {
    id: "ord-2",
    date: "25 Feb 2026",
    total: "$32.000",
    status: "PAID",
    items: [
      { name: "Kit de Aromaterapia", quantity: 1, price: "$32.000", type: "physical" },
    ],
    shippingStatus: "En preparacion",
  },
  {
    id: "ord-3",
    date: "10 Feb 2026",
    total: "$15.000",
    status: "SHIPPED",
    items: [
      { name: "Workbook: Manejo de Ansiedad (PDF)", quantity: 1, price: "$15.000", type: "digital", downloadUrl: "#" },
    ],
    shippingStatus: null,
  },
];

export async function GET() {
  return NextResponse.json(mockOrders);
}
