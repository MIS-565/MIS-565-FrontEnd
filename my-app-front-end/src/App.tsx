import React from "react";
import HelloWorld from "./helloworld"; // Import the HelloWorld component
import SimpleForm from "./SimpleForm";

const App: React.FC = () => {
  return (
    <>
      <HelloWorld /> {/* Use the HelloWorld component */}
      <div>
        <p>verify below</p>
        <SimpleForm />
      </div>
    </>
  );
};

export default App;
