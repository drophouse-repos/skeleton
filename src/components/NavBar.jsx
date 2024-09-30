import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Drawer } from "antd";
import {
  MenuOutlined,
  HeartOutlined,
  ShoppingCartOutlined,
  CloseOutlined,
  CommentOutlined,
} from "@ant-design/icons";
import DrophouseLogo from "../assets/logo_footer_t.png";
import {
  OrderIcon,
  HeartIcon,
  ShopCartIcon,
} from "./Icons";
import { useUser } from "../context/UserContext";
import Loader from '../components/loader'
import ProductSection from "./ProductSection";
import { AppContext } from "../context/AppContext";
import { fetchCartAndFavNumber } from "../utils/fetch";
import NavBarModal from "./NavBarModal";
import { Orgcontext } from "../context/ApiContext";
import { updateFavicon } from '../utils';
export default function NavBar() {
  const { orgDetails } = useContext(Orgcontext)
  const [navbarHide, setNavbarHide] = useState(false);
  const [isInLandingPage, setIsInLandingPage] = useState(false);
  const [isModalOpen, setModalOpen] = useState(false);
  const { user, handleSignOut } = useUser();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const { favNumber, setFavNumber,cartNumber, setCartNumber,menuOpen, setMenuOpen } = useContext(AppContext);
  const onMenuClose = () => {
    setMenuOpen(false);
  };

  useEffect(() => {
    const syncCartAndFav = () => {
      if (user?.isLoggedIn) {
        fetchCartAndFavNumber().then((data) => {
          setCartNumber(data.cart_number);
          setLoading(false);
        })
        .catch((error) => {
          setCartNumber(0);
          console.error(error)
          setLoading(false)
        })
      }
    };
    setLoading(true)
    syncCartAndFav();
  }, [user]);

  const { favicon } = useContext(Orgcontext)
	useEffect(() => {
		updateFavicon(favicon);
	  }, []);
  

  const getCartItemNumber = () => {
    return cartNumber;
  };
  const getLikedItemNumber = () => {
    return favNumber;
  };
  function MenuItem({ icon, text, href }) {
    return (
      <div
        className={`ml-4 flex flex-row justify-start space-x-2 text-lg font-light nav-link ${(process.env.REACT_APP_CART_ENABLED == 'true') ? `` : `${!(href=='/cart') ? `` : `hidden`}`}`}
        onClick={() => {
          if (href) {
            setMenuOpen(false);
            navigate(href);
          }
        }}
      >
        {icon}
        <div className="text-xl" style={{fontFamily : `${orgDetails.font}`}} 
          onMouseEnter={(e)=>{
            if(e && e.target && e.target.style)
              e.target.style.color = orgDetails.theme_color
          }}
          onMouseLeave={(e)=>{
            if(e && e.target && e.target.style)
              e.target.style.color = ''
          }}
        >
          {text}
        </div>
      </div>
    );
  }

  useEffect(() => {
    if (!user.isLoggedIn && window.location.pathname === "/auth") {
      setNavbarHide(true);
    } else {
      setNavbarHide(false);
    }

    if (window.location.pathname === "/") {
      setIsInLandingPage(true);
    } else {
      setIsInLandingPage(false);
    }
  });

  return (
    <div className={`w-full z-[50] fixed ${navbarHide ? "hidden" : ""}`}>
      <div
        className={`flex flex-row p-2 ${(window.innerWidth >= 544) ? `h-[2rem]`: `h-[3rem]`} md:h-[3rem] items-center justify-center bg-gray-200`}
      >
        <div className="basis-1/3 space-x-4 px-2 md:space-x-8 text-start">
          <MenuOutlined
            className={
              "md:scale-125 lg:scale-150 text-black"}
            onClick={() => {
              setMenuOpen(true);
            }}
          />
        </div>
        <div className="basis-1/3 text-center">
          <img
            className={`${(window.innerWidth >= 544) ? `h-[2rem]`: `h-[3rem]`} md:h-[3rem] mx-auto`}
            src={DrophouseLogo}
            alt="logo"
            style={{maxWidth : `${(window.innerWidth >= 544) ? `` : `max-content`}`}}
            onClick={() => {
              navigate("/");
            }}
          />
        </div>
        <div className="basis-1/3 space-x-4 px-2 md:space-x-8 text-end">
          <div className="flex flex-row justify-end items-center space-x-2 md:space-x-5">
          {user.isLoggedIn && 
              <div className={`${(window.innerWidth >= 544) ? ``: `hidden`} inline md:space-x-2 whitespace-nowrap}`}>
              <HeartOutlined
              className={
                `${(window.innerWidth >= 544) ? ``: `hidden`} md:scale-125 lg:scale-150 text-black`}
              onClick={() => {
                navigate("/fav");
              }}
            /><div
            className={
              "inline md:scale-125 lg:scale-150 justify-self-center content-center items-center text-black" }
          >
            {getLikedItemNumber()}
          </div>
        </div>
            }
            {user.isLoggedIn &&
              <div className={`${(window.innerWidth >= 544) ? ``: `hidden`} inline md:space-x-2 whitespace-nowrap ${(process.env.REACT_APP_CART_ENABLED == 'true') ? `` : `hidden`}`}>
                <ShoppingCartOutlined
                  className={
                    `md:scale-125 lg:scale-150 text-black`}
                  onClick={() => {
                    navigate("/cart");
                  }}
                />
                <div
                  className={
                    "inline md:scale-125 lg:scale-150 justify-self-center content-center items-center text-black" }
                >
                  {getCartItemNumber()}
                </div>
              </div>
            }
            {isInLandingPage && !user.isLoggedIn && (
            <button
              className={
                "bg-yellow-400 text-white text-xs px-2 py-1 rounded-full hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition ease-in-out duration-150 md:scale-100 lg:scale-125 mr-2" +
                "text-red" +
                (isInLandingPage ? "text-white" : "text-black")
              }
              onClick={() => {
                navigate("/auth");
              }}
            >
              Sign In
            </button>
          )}
            {user.isLoggedIn && (
              <button
                className={
                  "bg-transparent border bg-yellow-500 text-white text-xs px-2 py-1 rounded-full hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:ring-opacity-50 transition ease-in-out duration-150 md:scale-100 lg:scale-125 mr-2" +
                  (isInLandingPage ? " text-white" : " text-black")
                }
                onClick={() => {
                  setModalOpen(true);
                }}
              >
                {user.firstName[0]}
              </button>
            )}

            {isModalOpen && (
              <NavBarModal
                user={user}
                handleSignOut={handleSignOut}
                onClose={() => setModalOpen(false)}
              />
            )}
          </div>
        </div>
      </div>
      <Drawer
        title={user?.isLoggedIn ? `Hello ${user.firstName}` : "Menu"}
        placement={"left"}
        closable={false}
        onClose={onMenuClose}
        open={menuOpen}
        style={{ width: "100%" }}
      >
        <div className="flex flex-row justify-end">
          <CloseOutlined
            onClick={() => {
              setMenuOpen(false);
            }}
          />
        </div>

        <div className="flex flex-col space-y-1">
          <div className="flex flex-row justify-start text-xl text-gray-bold mb-2">
            My Profile
          </div>

          <MenuItem
            icon={<OrderIcon />}
            text={"Account & Orders"}
            href="/user"
          />
          <MenuItem icon={<HeartIcon />} text={"Favorites"} href="/fav" />
          <MenuItem
            icon={<ShopCartIcon />}
            text={"Shopping Cart"}
            href="/cart"
          />
          <MenuItem icon={<div className="pl-1 pr-1 text-gray-500"><CommentOutlined /></div>} text={"Contact Us"} href="/contact" />

          <br />

          <div className="flex flex-row space-x-2">
            <div className="flex flex-row justify-start text-xl text-gray-bold mb-2">
              Quick Links
            </div>
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14 10L10 14"
                stroke="#6E6E73"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M16 13L18 11C19.3807 9.61929 19.3807 7.38071 18 6V6C16.6193 4.61929 14.3807 4.61929 13 6L11 8M8 11L6 13C4.61929 14.3807 4.61929 16.6193 6 18V18C7.38071 19.3807 9.61929 19.3807 11 18L13 16"
                stroke="#6E6E73"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <MenuItem text={"Product & Size Information"} href="/information/product" />
          <MenuItem text={"How to write prompt"} href="/information/prompt" />

          <br />

          {/* <ProductSection onClick={setMenuOpen(false)}/> */}
          <ProductSection />

        </div>
      </Drawer>
    </div>
  );
}
