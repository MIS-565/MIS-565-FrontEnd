import React, { useState } from "react";

const SimpleForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    patronid: "",
  });

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // To Check if Patron ID is an 8-digit number
    if (formData.patronid.length !== 8 || isNaN(Number(formData.patronid))) {
      alert("Patron ID must be an 8-digit number.");
      return; // Exit the function if the validation fails
    }
    const timestamp = new Date().toLocaleString(); // Or use .toISOString() for more precision

    // The Name and patron Id is logged in console which can be sent to server with formData
    console.log(`[${timestamp}] Form data submitted:`, formData);

    setFormData({
      name: "",
      patronid: "",
    });
  };

  return (
    <div>
      <h2>Verify</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            placeholder="enter patron name"
          />
        </div>
        <div>
          <label>Patron ID:</label>
          <input
            type="text"
            name="patronid"
            value={formData.patronid}
            onChange={handleChange}
            required
            maxLength={8}
            placeholder="enter Patron Id"
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SimpleForm;
