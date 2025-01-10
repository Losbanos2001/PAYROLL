import Stepper from "./Stepper"
import { useContext } from "react"
import { EmployeeRegistrationContext } from "../../../contexts";

const Header = () => {
  const { step } = useContext(EmployeeRegistrationContext)
  
  return (
    <>
      <Stepper step={step} />
    </>
  );
};

export default Header;