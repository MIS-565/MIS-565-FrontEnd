import React, { useEffect, useState } from "react";
import "./Home.css";

interface Item {
  ITEMID: number;
  ITEMNAME: string;
  ITEMCOST: number;
  ITEMTYPE: string;
}

const HomePage = () => {
  const [availableItems, setAvailableItems] = useState<Item[]>([]);

  useEffect(() => {
    const fetchAvailableItems = async () => {
      try {
        const response = await fetch("http://localhost:5001/available-items");
        const data = await response.json();
        setAvailableItems(data); // Assuming the response is an array of item objects
      } catch (error) {
        console.error("Failed to fetch available items:", error);
      }
    };
    fetchAvailableItems();
  }, []);

  return (
    <div className="home-page">
      <div className="text-box">
        Wayback Public Library The Wayback Public Library is a community
        resource that provides access to a wide range of informational and
        educational materials. It offers a diverse collection of books, e-books,
        and digital media, catering to all age groups and interests. The library
        hosts various programs and events, including workshops, reading clubs,
        and educational sessions, promoting lifelong learning. Additionally, it
        provides access to computers and internet resources, ensuring that all
        community members can connect and engage with information. The Wayback
        Public Library serves as a welcoming space for individuals and families
        to explore, learn, and grow together.
      </div>
    </div>
  );
};

export default HomePage;
