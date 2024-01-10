import { createContext, useState } from "react";

const SideBarContext = createContext();

// eslint-disable-next-line react/prop-types
export const SideBarContextProvider = ({ children }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <>
      <SideBarContext.Provider
        value={{
          isCollapsed,
          setIsCollapsed,
        }}
      >
        {children}
      </SideBarContext.Provider>
    </>
  );
};

export default SideBarContext;
