import React from "react";

interface FormProps {
  children?: React.ReactElement | React.ReactNode;
}

const Form = ({ children }: FormProps) => {
  return <form onSubmit={(e) => e.preventDefault()}>{children}</form>;
};

export default Form;
