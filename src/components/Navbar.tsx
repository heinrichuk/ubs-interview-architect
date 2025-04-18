
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2.5 fixed w-full top-0 z-50">
      <div className="flex flex-wrap justify-between items-center">
        <div className="flex items-center">
          <span className="text-ubs-red font-bold text-2xl mr-2">GIC</span>
          <span className="text-ubs-darkgray text-lg">Recruitment Tool</span>
        </div>
        <div className="flex space-x-4">
          <button 
            onClick={() => navigate("/")}
            className={`px-3 py-2 ${location.pathname === "/" ? "text-ubs-red border-b-2 border-ubs-red" : "text-ubs-darkgray"}`}
          >
            Generate Job Specs
          </button>
          <button 
            onClick={() => navigate("/interview-questions")}
            className={`px-3 py-2 ${location.pathname === "/interview-questions" ? "text-ubs-red border-b-2 border-ubs-red" : "text-ubs-darkgray"}`}
          >
            Interview Questions
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
