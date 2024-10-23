// file for hello world
import React from "react"; // Import React library
import "./helloworld.css";

// 2. Define a functional component named 'helloworld'
const HelloWorld: React.FC = () => {
  // Return JSX which renders an HTML-like <h1> element
  return (
    <div className="hello-container">
      <h1>Hello World!</h1> {/* JSX inside the component */}
    </div> 
    
  );
};

// Export the component so it can be imported and used elsewhere
export default HelloWorld;
