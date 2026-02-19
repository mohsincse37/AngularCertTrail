import Navbar from "../components/Navbar";

const Header = ({list}) =>{
    return(
        <header>
            <div className="nav-area">
                <Navbar list={list} />
            </div>
        </header>
    );
};

export default Header;