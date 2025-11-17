import { Link } from "react-router";
import { Button } from "../ui/button";

export const Header = () => {
  return (
    <header className="fixed w-full top-0 left-0 px-6 py-6 md:px-8 lg:px-16 xl:px-32">
      <div className="flex justify-between items-center">
        <h2 className="font-bold text-2xl">Ride Balance</h2>
      <Link to="/app"><Button size={"lg"}>Login</Button></Link>
      </div>
    </header>
  );
};
