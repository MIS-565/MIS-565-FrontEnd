import React, { useState } from "react";

const SimpleForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    patronid: "",
  });

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate Patron ID (ensure it's 8 digits)
    if (formData.patronid.length !== 8 || isNaN(Number(formData.patronid))) {
      alert("Patron ID must be an 8-digit number.");
      return; // Exit the function if validation fails
    }

    const timestamp = new Date().toLocaleString();
    console.log(`[${timestamp}] Form data submitted:`, formData);

    try {
      // Send form data to back-end API (running on localhost:3001)
      const response = await fetch("http://localhost:3001/submit-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData), // Convert formData to JSON format
      });

      const data = await response.json();
      console.log("Response from server:", data);

      if (response.ok) {
        alert("Form submitted successfully!");
      } else {
        alert("Failed to submit form.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("An error occurred. Please try again.");
    }

    // Reset the form
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
          />
        </div>

        <button type="submit">Submit</button>
      </form>
    </div>
  );
};

export default SimpleForm;
