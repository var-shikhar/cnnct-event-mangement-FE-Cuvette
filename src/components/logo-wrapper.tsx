import LOGO from "../assets/logo.svg"
import "./css/logo-wrapper.css"

const LogoWrapper = () => {
  return (
    <div className="logo-wrapper">
      <img src={LOGO} alt="CNNCT" width={25} />
      <span>CNNCT</span>
    </div>
  )
}

export default LogoWrapper
