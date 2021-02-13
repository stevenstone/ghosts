import React, { useState, useCallback, useEffect } from "react";
import { Link, RouteProps } from "react-router-dom";
import Tabletop from "tabletop";

import LineMenu from "./components/line-menu/line-menu";

const publicSpreadsheetUrl =
  "https://docs.google.com/spreadsheets/d/1ezHECWEJhP2qGeQ7CqFMIulNvDMNuWPyLe_chxpVRTo/edit?usp=sharing";

const App = (props: RouteProps) => {
  const [contentEl, setContentEl] = useState(null);
  const [bodyClass, setBodyClass] = useState("light");
  const [content, setContent] = useState(null);
  const [data, setData] = useState();
  const [hexes, setHexes] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [page, setPage] = useState(props.location.pathname.split("/")[1]);

  const contentRef = useCallback<HTMLDivElement>((node) => setContentEl(node));

  const hexSizeMultiplier = 6;
  let lightInterval;

  useEffect(() => {
    Tabletop.init({
      key: publicSpreadsheetUrl,
      callback: (data, tabletop) => {
        setData(tabletop.models);
      },
      simpleSheet: false,
    });
  }, []);

  useEffect(() => {
    if (props.location.pathname === "/") {
      props.history.replace("/home");
    }
  }, []);

  useEffect(() => {
    if (props.location.pathname.split("/")[1] !== page) {
      changePages(props.location.pathname.split("/")[1]);
    }
  }, [props.location.pathname]);

  useEffect(() => {
    document.body.className = bodyClass;
  }, [bodyClass]);

  useEffect(() => {
    setContent(renderHtml());
  }, [data]);

  useEffect(() => {
    setContent(renderHtml());
  }, [page]);

  useEffect(() => {
    if (data && content && contentEl) {
      contentEl.classList.add("show");
    }
  }, [content]);

  useEffect(() => {
    const refreshHexGrid = () => {
      setHexes(renderHexes);
    };
    refreshHexGrid();

    window.addEventListener("resize", refreshHexGrid);

    return () => {
      window.removeEventListener("resize", refreshHexGrid);
    };
  }, []);

  useEffect(() => {
    const hexItems = document.querySelectorAll("use");
    window.clearInterval(lightInterval);
    if (!hexItems.length) {
      return;
    }
    lightInterval = window.setInterval(() => {
      const number = Math.floor(Math.random() * (hexItems.length / 24));
      for (let i = 0; i < number; i += 1) {
        const index = Math.floor(Math.random() * (hexItems.length - 1));
        hexItems[index].classList.add("show");
        window.setTimeout(() => {
          hexItems[index].classList.remove("show");
        }, 8000);
      }
    }, 4000);

    return () => {
      window.clearInterval(lightInterval);
    };
  }, [hexes]);

  const renderHexes = () => {
    let hexItems = [];
    const windowHeight = window.innerHeight;
    const windowWidth = window.innerWidth;
    let x = 0;
    let y = 0;
    let offset = 0;
    while (y < windowHeight) {
      while (x < windowWidth) {
        hexItems.push(
          <use
            key={`${x}${y}`}
            xlinkHref="#pod"
            transform={`translate(${x + offset} ${y})`}
          />,
        );
        x += 30 * hexSizeMultiplier;
      }
      x = 0;
      y += 9 * hexSizeMultiplier;
      offset =
        offset === 15.2 * hexSizeMultiplier ? 0 : 15.2 * hexSizeMultiplier;
    }

    return hexItems;
  };

  const changePages = (newPage: string) => {
    if (contentEl.classList.contains("show")) {
      contentEl.classList.remove("show");
      window.setTimeout(() => {
        setPage(newPage);
      }, 1000);
    } else {
      setPage(newPage);
    }
  };

  const x1 = 5 * hexSizeMultiplier;
  const y1 = -9 * hexSizeMultiplier;
  const x2 = -5 * hexSizeMultiplier;
  const y2 = y1;
  const x3 = -10 * hexSizeMultiplier;
  const y3 = 0;
  const x4 = x2;
  const y4 = 9 * hexSizeMultiplier;
  const x5 = x1;
  const y5 = y4;
  const x6 = 10 * hexSizeMultiplier;
  const y6 = y3;

  const renderHtml = () => {
    if (!data || !data[page]) {
      return "No content found";
    }
    return data[page].elements.map((row, index) => {
      if (row.title) {
        return (
          <h2 key={index} className="title">
            {row.title}
          </h2>
        );
      } else if (row.subtitle) {
        return (
          <h3 key={index} className="subtitle">
            {row.subtitle}
          </h3>
        );
      } else if (row.paragraph) {
        return <p key={index}>{row.paragraph}</p>;
      }
    });
  };

  const renderLink = (link: string, text: string) => {
    if (props.location.pathname === link) {
      return (
        <li className="sc-nav-menu-item">
          <span className="sc-nav-link sc-nav-link--active">{text}</span>
        </li>
      );
    }

    return (
      <li className="sc-nav-menu-item">
        <Link
          className="sc-nav-link"
          to={link}
          onClick={() => setMenuOpen(false)}
        >
          {text}
        </Link>
      </li>
    );
  };

  return (
    <>
      <div className="container">
        <h1 className="masthead">Stone Coded</h1>
        <nav className="sc-nav">
          <LineMenu
            isOpen={menuOpen}
            onClick={(isOpen) => setMenuOpen(isOpen)}
          />
          <ul className={`sc-nav-menu${menuOpen ? " show" : ""}`}>
            {/* 
           I'd love to dynamically populate this list
           based on what we fetch from tabletop, but there's 
           no good way to reconcile human-readable names from 
           url slugs 
           */}
            {renderLink("/home", "Home")}
            {/* {renderLink("/page-2", "Page 2")} */}
            {renderLink("/pnp/dice", "Dice Roller")}
          </ul>
        </nav>
        <button
          className="sc-lightswitch"
          onClick={() => setBodyClass(bodyClass === "dark" ? "light" : "dark")}
        >
          <div className="circle circle--outer"></div>
          <div className={`circle circle--inner ${bodyClass}`} />
        </button>
        <div className="content" ref={contentRef}>
          {content && <>{content}</>}
        </div>
        {/* <button onClick={() => changePages("Home")} disabled={page === "Home"}>
          Home Page
        </button>
        <button
          onClick={() => changePages("Page 2")}
          disabled={page === "Page 2"}
        >
          Page 2
        </button> */}
      </div>
      <div className="cell-container">
        <svg
          viewBox={`0 0 ${window.innerWidth} ${window.innerHeight}`}
          width="100%"
          height="100%"
        >
          <defs>
            <g id="pod">
              <polygon
                strokeWidth="0.2"
                points={`${x1},${y1} ${x2},${y2} ${x3},${y3} ${x4},${y4} ${x5},${y5} ${x6},${y6}`}
              />
            </g>
          </defs>

          <g className="pod-wrap">{hexes}</g>
        </svg>
      </div>
    </>
  );
};

export default App;
