import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableRow,
  TableCell,
  Chip,
  Tooltip,
  Button,
} from "@nextui-org/react";
import { EditIcon } from "./components/icons/EditIcon";
import { DeleteIcon } from "./components/icons/DeleteIcon";
import { EyeIcon } from "./components/icons/EyeIcon";
import { useNavigate } from "react-router-dom";

interface Item {
  ITEMID: number;
  ITEMNAME: string;
  ITEMTYPE: string;
  ITEMCOST: number;
  STATUS: string;
  LOANDURATION: number;
  Fee_Rate: number;
}

const columns = [
  { name: "ID", uid: "ITEMID" },
  { name: "NAME", uid: "ITEMNAME" },
  { name: "TYPE", uid: "ITEMTYPE" },
  { name: "COST", uid: "ITEMCOST" },
  { name: "STATUS", uid: "STATUS" },
  { name: "LOAN DURATION", uid: "LOANDURATION" },
  { name: "FEE RATE", uid: "Fee_Rate" },
  { name: "ACTIONS", uid: "actions" },
];

const Items: React.FC = () => {
  const [items, setItems] = useState<Item[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:5001/items");
        const data = await response.json();
        setItems(data);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchItems();
  }, []);

  const renderCell = (item: Item, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof Item];

    switch (columnKey) {
      case "STATUS":
        return (
          <Chip
            className="capitalize"
            color={item.STATUS === "AVAILABLE" ? "success" : "danger"}
            size="sm"
            variant="flat"
          >
            {item.STATUS.toLowerCase()}
          </Chip>
        );
      case "ITEMCOST":
      case "Fee_Rate":
        return `$${cellValue}`;
      case "LOANDURATION":
        return `${cellValue} days`;
      case "actions":
        return (
          <div className="relative flex items-center gap-2">
            <Tooltip content="Details">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => console.log("View", item.ITEMID)}
              >
                <EyeIcon />
              </Button>
            </Tooltip>
            <Tooltip content="Edit">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => console.log("Edit", item.ITEMID)}
              >
                <EditIcon />
              </Button>
            </Tooltip>
            <Tooltip content="Delete">
              <Button
                isIconOnly
                size="sm"
                variant="light"
                onPress={() => console.log("Delete", item.ITEMID)}
              >
                <DeleteIcon />
              </Button>
            </Tooltip>
          </div>
        );
      default:
        return cellValue;
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  const handleAddItems = () => {
    navigate("/add-items");
  };

  return (
    <div className="p-6">
      {/* Navigation Bar */}
      <nav className="flex justify-between items-center p-4 bg-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold">Library Management</h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleAddItems}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Items
          </button>
          <button
            onClick={handleBackToHome}
            className="px-4 py-2 bg-gray-300 text-black rounded hover:bg-gray-400"
          >
            Back to Home
          </button>
        </div>
      </nav>

      {/* Page Title */}
      <h1 className="text-2xl font-bold mt-6 mb-4">Library Items</h1>

      {/* Items Table */}
      <Table aria-label="Items table with custom cells">
        <TableHeader columns={columns}>
          {(column) => (
            <TableColumn
              key={column.uid}
              align={column.uid === "actions" ? "center" : "start"}
            >
              {column.name}
            </TableColumn>
          )}
        </TableHeader>
        <TableBody items={items}>
          {(item) => (
            <TableRow key={item.ITEMID}>
              {(columnKey) => (
                <TableCell>{renderCell(item, columnKey)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default Items;
