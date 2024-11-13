import React from "react";
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import SearchPatron from "./searchPatron";
import AddPatron from "./AddPatronPage";

const PatronPage: React.FC = () => {
  return (
    <div className="flex w-full flex-col">
        <Tabs aria-label="Options" className="mx-auto pt-8">
          <Tab key="search" title="Search Patron">
            
                    <SearchPatron />
                
          </Tab>
          <Tab key="add" title="Add Patron">
            
                    <AddPatron />
                
          </Tab>
        </Tabs>
    </div>
  );
};

export default PatronPage; 