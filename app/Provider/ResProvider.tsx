import React, { createContext, PropsWithChildren, useCallback, useContext, useState } from "react";

type ResponseType = {
  response: string;
  setItem: (data: string) => void;
};

const defaultvalue: ResponseType = {
  response: "",
  setItem: () => {}, // Default empty function
};

export const ResContext = createContext<ResponseType>(defaultvalue);

const ResProvider = ({ children }: PropsWithChildren) => {
  const [response, setResponse] = useState<string>('');

  const setItem = useCallback((data: string) => {
    setResponse(data);
  }, []);

  return (
    <ResContext.Provider value={{ response, setItem }}>
      {children}
    </ResContext.Provider>
  );
};

export default ResProvider;
export const useResponse = () => useContext(ResContext);
