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
  const [filterType, setFilterType] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<string>("Any");
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

  const handleFilterChange = (type: string) => {
    setFilterType(type);
  };

  const handleStatusFilterChange = (status: string) => {
    setStatusFilter(status);
  };

  const filteredItems = items.filter(item => {
    const matchesType = filterType === "All" || item.ITEMTYPE === filterType;
    const matchesStatus = 
      statusFilter === "Any" ||
      (statusFilter === "Available" && item.STATUS === "AVAILABLE") ||
      (statusFilter === "Checked In" && item.STATUS === "CHECKED IN") ||
      (statusFilter === "Checked Out" && item.STATUS === "CHECKED OUT");
    
    return matchesType && matchesStatus;
  });

  const renderCell = (item: Item, columnKey: React.Key) => {
    const cellValue = item[columnKey as keyof Item];

    switch (columnKey) {
      case "STATUS":
        const chipColor = item.STATUS === "AVAILABLE" ? "success" :
                          item.STATUS === "CHECKED OUT" ? "danger" : "warning";
        return (
          <Chip 
            className="capitalize" 
            color={chipColor}
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
    {/* Header Section with Title on the left and Button on the right */}
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold">Library Items</h1>
      <div className="ml-auto"> {/* This div will ensure alignment to the far right */}
        <button onClick={handleBackToHome} className="back-to-home-button">
          Back to Home Page
        </button>
        <button
        onClick={handleAddItems}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Add Items
      </button>
      </div>
    </div>

      {/* Filter Section */}
      <div className="flex gap-4 mb-6">
        <label>
          <input 
            type="radio" 
            value="All" 
            checked={filterType === "All"} 
            onChange={() => handleFilterChange("All")} 
          />
          All
        </label>
        <label>
          <input 
            type="radio" 
            value="Book" 
            checked={filterType === "Book"} 
            onChange={() => handleFilterChange("Book")} 
          />
          Book
        </label>
        <label>
          <input 
            type="radio" 
            value="Movie" 
            checked={filterType === "Movie"} 
            onChange={() => handleFilterChange("Movie")} 
          />
          Movie
        </label>
        <label>
          <input 
            type="radio" 
            value="Game" 
            checked={filterType === "Game"} 
            onChange={() => handleFilterChange("Game")}
          />
          Game
        </label>
      </div>

      {/* Status Filter Section */}
      <div className="flex gap-4 mb-6">
        <label>
          <input 
            type="radio" 
            value="Any" 
            checked={statusFilter === "Any"} 
            onChange={() => handleStatusFilterChange("Any")} 
          />
          Any
        </label>
        <label>
          <input 
            type="radio" 
            value="Available" 
            checked={statusFilter === "Available"} 
            onChange={() => handleStatusFilterChange("Available")} 
          />
          Available
        </label>
        <label>
          <input 
            type="radio" 
            value="Checked In" 
            checked={statusFilter === "Checked In"} 
            onChange={() => handleStatusFilterChange("Checked In")} 
          />
          Checked In
        </label>
        <label>
          <input 
            type="radio" 
            value="Checked Out" 
            checked={statusFilter === "Checked Out"} 
            onChange={() => handleStatusFilterChange("Checked Out")} 
          />
          Checked Out
        </label>
      </div>

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
        <TableBody items={filteredItems}>
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
